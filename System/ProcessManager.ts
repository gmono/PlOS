/**
 * Created by gaozijian on 2017/3/31.
 */
//实现Worker的管理和查询
//包括基础的通信支持
//以及Worker级别上的权限管理
//准确的说 是提供对权限号的查询 权限号是一个数字 不同程序根据此标号来判断是否提供服务
//因此权限控制在此管理器中仅仅为保存一个信息，并不指定其意义

namespace System
{
    export namespace ProcessManager
    {
        import RemoteCallInfo=RemoteProcess.RemoteCallInfo;
        import RemoteReturn=RemoteProcess.RemoteReturn;
        type DataReceiver=(data:any)=>any;
        //封装Worker为Process
        export class Process
        {
            private worker:Worker=null;
            //此进程的进程号
            public guid:string="";
            public path:string="";
            //是否处于等待调用返回的状态
            //接收到数据时被调用
            //null则不调用
            private receive:DataReceiver=null;
            public constructor(guid:string,path:string,receiver:DataReceiver)
            {
                this.guid=guid;
                this.receive=receiver;
                this.path=path;
            }
            public SetReceiver(rece:DataReceiver)
            {
                this.receive=rece;
            }
            public Init()
            {
                //初始化函数
                //只有在这个函数被调用时 worker真正被创建
                this.worker=new Worker(this.path);
                this.worker.onmessage=(event:MessageEvent)=>{
                    //调用接收器函数
                    this.receive(event.data);
                };
            }
            public Kill()
            {
                this.worker.terminate();
            }
            public postMessage(data:any)
            {
                this.worker.postMessage(data);
            }
        }
        

        //以下为管理器部分
        //guid->process
        let ProcessMap:Map<string,Process>=new Map<string,Process>();
        //这里规定进程发送的信息必须都是系统调用即复合RemoteCallInfo标准
        //每个进程同时只能进行一次系统调用然后就要等待其返回

        //查找表 从调用sign->process guid
        //用于标识一个sign对应哪个进程guid
        let ProcessCallMap=new Map<string,string>();
        function GlobalReceive(guid:string,data:any)
        {
            let proc=ProcessMap.get(guid);
            if(proc!=null)
            {
                let info=data as RemoteProcess.RemoteCallInfo;
                //把调用的sign和进程的guid关联
                ProcessCallMap.set(info.sign,guid);
                RemoteProcess.Call(info,(ret:RemoteReturn)=>{
                    //通过调用sign找到process sign
                    let psign=ProcessCallMap.get(ret.sign);
                    if(psign==null) return;//直接忽略
                    let retproc=ProcessMap.get(psign);
                    if(retproc==null) return;//也是忽略
                    //这里确定回执成功进行 则删除此调用在表中的映射
                    ProcessCallMap.delete(info.sign);
                    //发送回执到进程
                    retproc.postMessage(ret);
                });
            }
            throw new Error("错误！全局调用接收器无法找到对应Process");
        }
        export function CreateProcessFromUrl(path:string):string
        {
            let guid=Tools.Guid();
            let proc=new Process(guid,path,(data:any)=>{
                GlobalReceive(guid,data);
            });
            ProcessMap.set(guid,proc);
            proc.Init();
            return guid;
        }
        export function CreateProcess(code:string):string
        {
            let blob=new Blob([code],{type:"text/plain"});
            let url=window.URL.createObjectURL(blob);
            return CreateProcessFromUrl(url);
        }
        /**
         * 杀死一个进程
         * @param guid 进程guid
         */
        export function Kill(guid:string)
        {
            let proc=ProcessMap.get(guid);
            if(proc!=null)
            {
                ProcessMap.delete(guid);
                proc.Kill();
            }
        }

    }
}