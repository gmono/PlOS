//传输层标准接口

namespace Protocol
{
    export namespace TransPort
    {
        export type TransFunction=(obj:any)=>any;
        export type BinObject=ArrayBuffer|SharedArrayBuffer|Blob;
        export type GenericData=BinObject|object;
        export type ReceiveFunction=(obj:GenericData)=>any;
        export abstract class TransPortBase
        {
            
            protected TransFunc:TransFunction=null;
            protected RectiverSet:Array<ReceiveFunction>=[];
            public constructor(tfunc:TransFunction)
            {
                //注册传输函数
                this.TransFunc=tfunc;
            }
            public abstract sendObject(obj:object):void;
            public abstract sendBlob(blob:BinObject):void;
            //下面这个函数由外部调用传入一个接收到的数据
            public abstract receiveData(obj:GenericData):void;
            public registReceiver(func:ReceiveFunction):void
            {
                this.RectiverSet.push(func);
            }

        }
    }
}