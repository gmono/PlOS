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
            UIManager.SetRect(guid,<UIManager.IRect>{x:400,y:100,h:400,w:300});
            UIManager.SetProj(guid,"fillStyle","#000000");
            UIManager.Paint(guid,"fillRect",JSON.stringify([0,0,200,200]));
            let w2=UIManager.CreateWindow();
            UIManager.SetRect(w2,<UIManager.IRect>{x:400,y:100,h:400,w:300});
            UIManager.SetProj(w2,"fillStyle","#ffc0cb");
            UIManager.Paint(w2,"fillRect",JSON.stringify([100,100,200,200]));
            UIManager.Show(w2);
            UIManager.Show(guid);
        }

    }
}
window.onload=System.Main.Main;