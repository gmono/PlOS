
let arr=new SharedArrayBuffer(20);
onmessage=function(e)
{
    if(e.data==true)
    {
        //启动
        //发送
        let ars=new Uint8Array(arr);
        ars[0]=21;
        console.log(ars);
        postMessage(arr);
    }
    else
    {
        let ars=new Uint8Array(arr);
        console.log(ars);
    }
}