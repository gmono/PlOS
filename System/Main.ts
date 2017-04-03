/**
 * Created by gaozijian on 2017/3/31.
 */
//启动主程序
namespace System
{
    export namespace Main
    {
        //系统初始化函数 此函数执行后系统才能正常工作
        function Init()
        {
        }
        export function Main()
        {
            let guid=UIManager.CreateWindow();
            UIManager.SetRect(guid,<UIManager.IRect>{x:400,y:100,h:300,w:400});
            UIManager.SetPaintProj(guid,"fillStyle","#000000");
            UIManager.Paint(guid,"fillRect",JSON.stringify([0,0,300,400]));
            let w2=UIManager.CreateWindow();
            UIManager.SetRect(w2,<UIManager.IRect>{x:500,y:0,h:200,w:300});
            UIManager.SetPaintProj(w2,"fillStyle","#ffc0cb");
            UIManager.Paint(w2,"fillRect",JSON.stringify([0,0,200,300]));
            UIManager.Show(w2);
            UIManager.Show(guid);
        }
    }
}
window.onload=System.Main.Main;