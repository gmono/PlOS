namespace System
{
    /**
     * 系统总初始化函数
     */
    export function Init()
    {
        let CreateProcess=ProcessCore.CreateProcessByCode;
        let sign=CreateProcess(`
        onmessage=function(){
            for(let i=0;i<100;++i){console.log(i);}
        postMessage({operation:"Post",data:{DestType:"Process",Dest:"hello",Data:"hello world"}});
        }
        
        `);
        
        ProcessCore.OnSendMessage.ListenerList.push((msg:DataType.IMessage)=>{
            alert(JSON.stringify(msg));
        })
    }
}