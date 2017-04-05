//传输层标准接口

namespace Protocol
{
    export namespace TransPort
    {
        export type TransFunction=(obj:any)=>any;
        export type BinObject=ArrayBuffer|SharedArrayBuffer|Blob;
        export type GenericData=BinObject|object;
        export type ReceiveFunction=(obj:GenericData)=>any;
        /**
         * 必要的说明：监听器函数可以接受4种类型，但是实际上不同的TransPort调用监听器函数
         * 时，传过来的数据类型不一定相同，例如JSONTransPort就只会提供Object型数据
         * 在转换时，任何GenericData类型的数据统一被转换为JSON字符串，后被接收函数
         * 转换为Object
         */
        export abstract class TransPortBase
        {
            //注意此函数并不与Transport传输的具体数据例如 Object 
            //其为TransPort的后台传输接口
            //例如JSONTransPort就需要一个可以接受string参数的TransFunc
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
            //这个数据data其实是TransPort的内部数据格式 具体视情况而定
            public abstract receiveData(data:any):void;
            public registReceiver(func:ReceiveFunction):void
            {
                this.RectiverSet.push(func);
            }
            protected CallAllReceiver(data:GenericData):void
            {
                for(let t of this.RectiverSet)
                {
                    t(data);
                }
            }

        }
    }
}