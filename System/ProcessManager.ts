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
        type DataReceiver=(data:any)=>any;
        //封装Worker为Process
        export class Process
        {
            private worker:Worker=null;
            //此进程的进程号
            public guid:string="";
            public path:string="";
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

        let ProcessMap:Map<string,Process>=new Map<string,Process>();
        function GlobalReceive(guid:string)
        {

        }
        export function CreateProcessFromUrl(path:string)
        {
            let guid=Tools.Guid();
            let proc=new Process(guid,path,()=>{});
            
        }
        export function CreateProcess(code:string)
        {
            
        }

    }
}