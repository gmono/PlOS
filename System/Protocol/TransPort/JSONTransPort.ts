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
            public TransObject(obj:object):any
            {
                let json=JSON.stringify(obj);
                return json;
            }
            public TransBlob(blob:BinObject):any
            {
                if(blob==null)
                {
                    return null;
                }
                if(blob instanceof ArrayBuffer||blob instanceof SharedArrayBuffer)
                {
                    let str=arrayBufferToJson(blob);
                    return str;
                }
                else 
                {
                    
                    let reader=new FileReader();
                    reader.readAsArrayBuffer(blob);
                    return this.TransBlob(reader.result); //调用自身发送arraybuffer
                }
            }
    }
}