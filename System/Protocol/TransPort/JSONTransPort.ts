//使用JSON为传输数据的基本形式

namespace Protocol
{
    export namespace  TransPort
    {
        export class JSONTransPort extends TransPortBase
        {
            public sendObject(obj:object):void
            {
                
            }
            public sendBlob(blob:BinObject):void
            {

            }
            //下面这个函数由外部调用传入一个接收到的数据
            public receiveData(data:any):void
            {
                if(typeof data =="string")
                {
                    try
                    {
                        let obj=JSON.parse(data);
                        this.CallAllReceiver(obj);
                    }
                    catch(e)
                    {
                        throw "错误！接收数据解析失败！";
                    }
                }
                throw "错误！JSONTransPort接收数据类型错误！";
            }
        }
    }
}