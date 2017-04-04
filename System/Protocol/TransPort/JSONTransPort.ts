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
            public receiveData(obj:GenericData):void
            {

            }
        }
    }
}