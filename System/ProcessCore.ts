namespace System
{
    export namespace ProcessCore
    {
        import IMessage=DataType.IMessage;
        import EventHub=Tools.EventHub;
        import MessageType=DataType.MessageType;
        interface IPostMessage
        {
            DestType:MessageType;
            Dest:string;
            Data:any;
        }
        interface IGetMessage
        {
            isWait:boolean;
            Timeout:number;
        }
        /**
         * 进程发出的原始消息
         * 如果是Get消息则data被忽略
         * data为Post消息中的消息体 并非一个IMessage对象
         */
        export interface IWorkerMessage
        {
            operation:"Get"|"Post";
            //消息体
            data:IPostMessage|IGetMessage;
            
        }
        //Process封装类
        export class Process
        {
            protected pwork:Worker=null;
            public constructor(public Sign:string,codeurl:string)
            {
                this.pwork=new Worker(codeurl);
                this.pwork.onmessage=this.OnWorkerMessage;
            }
            //杀死进程
            public Kill()
            {
                this.pwork.terminate();
            }
            //表示Worker是否正在等待此消息 若是 则在接收到消息时迅速发送回去
            //否则放入队列
            protected isWaiting:boolean=false;
            //消息队列 保存接收的消息 不得不说JS的Array真是万能
            protected MsgQueue:Array<IMessage>=[];
            /**
             * Worker消息接收器
             * @param ev 事件对象
             */
            protected OnWorkerMessage(ev:MessageEvent)
            {
                try
                {
                    let data=ev.data as IWorkerMessage;
                    if(data==null) throw new Error("错误！消息不能为NULL或Undefined");
                    //判断是不是发送消息
                    if(data.operation=="Post")
                    {
                        if(this.OnSendMessage) this.OnSendMessage(this.Sign,data.data as IPostMessage);
                        return;
                    }
                    //如果是请求消息
                    let getmsg=data.data as IGetMessage;
                    //注意 worker同时只能请求一个消息
                    //所以只要是Waiting状态如果在发出一次不是Waiting状态的请求
                    //则自动退出Waiting
                    this.isWaiting=false;
                    if(this.MsgQueue.length==0)
                    {
                        if(getmsg.isWait)
                        {
                            this.isWaiting=true;
                            return;
                        }
                        else
                        {
                            //如果不等待就直接返回null消息
                            this.pwork.postMessage(null);
                            return;
                        }
                    }
                    //这里是消息队列有内容的情况
                    //取出发送
                    let msg=this.MsgQueue.shift();
                    this.pwork.postMessage(msg);
                }
                catch(e)
                {
                    console.log("the worker send a error message!");
                    console.log(e);
                }
                
            }
            //发送一个消息给进程
            public ReceiveMessage(msg:IMessage)
            {
                //这里判断 如果正在等待则直接发送 否则放入队列
                //直接发送消息
                if(this.isWaiting)
                    this.pwork.postMessage(msg);
                else
                {
                    //如果不是等待状态 就放入队列等待请求
                    this.MsgQueue.push(msg);
                }
            }
            //SendMessage事件回调函数
            public OnSendMessage:(sign:string,data:IPostMessage)=>void=null;
        }



        //此为本模块的消息构造函数 
        //构造一个本模块发送给进程的消息
        //Receiver不设置
        function MakeMsg(type:string,data:any)
        {
            return <IMessage>{
                Type:"System",
                Owner:"ProcessCore",
                DestType:"Process",
                Receiver:null,
                Data:{
                    Type:type,
                    Data:data
                }
            };
        }
        //进程表
        let ProcessMap:Map<string,Process>=null;
        /**
         * 创建进程的基础函数
         * @param sign 进程的标记号
         * @param codeurl 进程脚本文件的url 
         */
        export function CreateProcess(codeurl:string,sign:string=null)
        {
            if(sign==null) sign=Tools.Guid();
            //下面这行检测自定义sign的重复性
            if(ProcessMap.has(sign)) return false;
            let proc=new Process(sign,codeurl);
            ProcessMap.set(sign,proc);
        }
        //消息集合
        export let OnSendMessage=new EventHub<(msg:IMessage)=>void>();
        /**
         * 消息集线器 所有进程的消息都发送到这个函数由这个函数包装为一个
         * 标准信息对象后发出
         * @param sign 进程sign 由Process类报告
         * @param data 发送的消息
         */
        function MessageHub(sign:string,data:IPostMessage)
        {
            let msg=<IMessage>{
                Type:"Process",
                Owner:sign,
                DestType:data.DestType,
                Receiver:data.Dest,
                Data:data.Data
            };
            //调用所有监听器
            OnSendMessage.Call(msg);
        }

        /**
         * 由代码文本创建进程
         * @param code 代码文本
         * @param sign 进程sign
         */
        export function CreateProcessByCode(code:string,sign:string=null)
        {
            let blob=new Blob([code]);
            let url=window.URL.createObjectURL(blob);
            CreateProcess(url,sign);
        }
        /**
         * 获取一个进程结构体
         * @param sign 进程sign
         */
        export function GetProcessBySign(sign:string)
        {
            if(ProcessMap.has(sign)) return ProcessMap.get(sign);
            return null;
        }
        /**
         * 杀死一个进程 timeout设置等待时间 如果发送了kill消息进程指定时间内无回复
         * 则强制结束 timeout设为0则直接结束不等待
         * @param sign 进程sign
         * @param timeout 超时
         */
        export function KillProcess(sign:string,timeout:number)
        {
            let proc=ProcessMap.get(sign);
            if(proc==null) return;
            let checkfun=()=>{
                //检查函数 如果到时间了还有 就直接结束
                if(ProcessMap.has(sign))
                {
                    proc.Kill();
                }
            }
            //这里先发送Kill消息
            let msg=MakeMsg("Kill",null);
            msg.Receiver=sign;
            proc.ReceiveMessage(msg);
            //设置超时检查
            setTimeout(checkfun, timeout);
            //如果没有超时则进程应该发送了kill消息 此时下面的Kill接收者应该响应从而结束发送者进程
        }
        //这里设置一个固定的Kill接收者
        //其接受进程发来的Kill消息并结束对应进程
        OnSendMessage.ListenerList.push((msg:IMessage)=>{
            let proc=ProcessMap.get(msg.Owner);
            proc.Kill();
        });

        
    }
}