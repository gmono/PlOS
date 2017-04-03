//传输层标准接口

namespace Protocol
{
    export namespace TransPort
    {
        type TransFunction=(obj:any)=>any;
        type ReceiveFunction=(obj:Object|ArrayBuffer|SharedArrayBuffer)=>any;
        export abstract class TransPortBase
        {
            
            private TransFunc:TransFunction=null;
            private RectiverSet:Array<ReceiveFunction>=[];
            public TransPortBase(tfunc:TransFunction)
            {
                //注册传输函数
                this.TransFunc=tfunc;
            }
            public abstract sendObject(obj:Object):void;
            public abstract sendBlob(blob:ArrayBuffer|SharedArrayBuffer):void;
            public registReceiver(func:ReceiveFunction):void
            {
                this.RectiverSet.push(func);
            }
            //下面这个函数由外部调用传入一个接收到的数据
            public abstract receiveData(obj:any):void;
        }
    }
}