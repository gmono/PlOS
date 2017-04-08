//使用JSON为传输数据的基本形式

namespace Protocol
{
    export namespace  TransPort
    {
        function arrayBufferToJson(buffer:ArrayBuffer|SharedArrayBuffer)
        {
            let gbuff:ArrayBuffer=buffer as any;
            let v=new Uint8Array(gbuff);
            let ret=JSON.stringify(v);
            return ret;
        }
        export class JSONTransPort extends TransPortBase
        {
            public sendObject(obj:object):void
            {
                let json=JSON.stringify(obj);
                this.TransFunc(json);
            }
            public sendBlob(blob:BinObject):void
            {
                if(blob==null)
                {
                    this.TransFunc("null");
                    return;
                }
                if(blob instanceof ArrayBuffer||blob instanceof SharedArrayBuffer)
                {
                    let str=arrayBufferToJson(blob);
                    this.TransFunc(str);
                }
                else 
                {
                    
                    let reader=new FileReader();
                    reader.readAsArrayBuffer(blob);
                    this.sendBlob(reader.result); //调用自身发送arraybuffer
                }
            }
            //下面这个函数由外部调用传入一个接收到的数据
            protected receiveData(data:any):void
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