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
         * 对于所有TransPort来说 数据发送时为固定的几种类型
         * 而接收到数据调用Receive时 是GenericData中的任意类型
         * 具体类型是不确定的
         * 因此要求Receive具有判断obj类型并根据需要转换的能力
         * 如果是直接对接
         */
        export abstract class TransPortBase
        {
            //注意此函数并不与Transport传输的具体数据例如 Object 
            //其为TransPort的后台传输接口
            //例如JSONTransPort就需要一个可以接受string参数的TransFunc
            protected TransFunc:TransFunction=null;
            protected RectiverSet:Array<ReceiveFunction>=[];
            protected RawRectivers:Array<TransFunction>=[];
            public constructor(tfunc:TransFunction)
            {
                //注册传输函数
                this.TransFunc=tfunc;
            }
            /**
             * InnerSend
             * 内部数据传递函数
             * 此函数与sendData函数类似 但不做任何数据上的转换，直接转发内部数据
             * 内部通道入口
             */
            public InnerSend(data:any) {
                this.TransFunc(data);
            }
            /**
             * sendData 通用数据发送函数
             * 调用内部的两个抽象函数发送数据
             * 正向通道入口
             */
            public sendData(data:GenericData) {
                let t;
                if(data instanceof ArrayBuffer||data instanceof SharedArrayBuffer||data instanceof Blob)
                {
                    t=this.TransBlob(data);
                }
                else
                {
                    t=this.TransObject(data);
                }
                this.TransFunc(t);
            }
            //转换函数
            public abstract TransObject(obj:object):any;
            public abstract TransBlob(blob:BinObject):any;
            /**
             * Receive为反向通道入口
             */
            public Receive(data:any):void {
                
            }

        }
    }
}