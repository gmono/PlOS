let ars=null;
let worker=null;
window.onload=function()
{
    worker=new Worker("./worker.js");
    worker.onmessage=function(e)
    {
        ars=new Uint8Array(e.data);
        console.log(ars);
        ars[1]=22;
        worker.postMessage(false);
    }
    worker.postMessage(true);
}