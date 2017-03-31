/**
 * Created by gaozijian on 2017/3/31.
 */
//UI层基础设施 提供窗口创建 焦点管理，输入管理
//窗口查询等（所属Worker）
namespace System
{
    export namespace UIManager
    {
        import Guid = System.Tools.Guid;
        class WindowInfo
        {
            //封装Canvas
            //保存窗口的位置 大小 层次信息
            private canvas:HTMLCanvasElement=null;
            private context:CanvasRenderingContext2D=null;
            public Rect:IRect=null;
            public IsShowing:boolean=false;
            public Index:number=0;
            public constructor(pos:IPoint,size:ISize,index:number=0)
            {
                this.canvas=document.createElement("canvas");
                this.Rect=<IRect>{};
                this.SetPosition(pos);
                this.SetSize(size);
                this.SetIndex(index);
                document.body.appendChild(this.canvas);
                this.context=this.canvas.getContext("2d");
            }
            public SetPosition(pos:IPoint)
            {
                this.canvas.style.left=`${pos.x}px`;
                this.canvas.style.top=`${pos.y}px`;
                this.Rect.x=pos.x;
                this.Rect.y=pos.y;
            }
            public SetSize(size:ISize)
            {
                this.canvas.style.height=`${size.h}px`;
                this.canvas.style.width=`${size.w}px`;
                this.Rect.h=size.h;
                this.Rect.w=size.w;
            }
            public Hide()
            {
                this.canvas.style.display="none";
                this.IsShowing=false;
            }
            public Show()
            {
                this.IsShowing=true;
                this.canvas.style.display="block";
            }
            public SetIndex(index:number)
            {
                this.canvas.style.zIndex=`${index}`;
                this.Index=index;
            }
            //窗口绘图
            public Paint(fun:string,pars:string)
            {
                try
                {
                    let parobj=JSON.parse(pars);
                    let funobj:Function=this.context[fun];
                    funobj.apply(this.context,parobj);
                }
                catch(e)
                {
                    //捕捉到任何错误都抛出一个绘图错误
                    //可能的错误：JSON解析失败 没有指定函数 其他未知
                    throw "绘图错误！";
                }

            }
            //设置属性的函数
            public SetContextPars(proj:string,val:string)
            {
                try
                {
                    this.context[proj]=val;
                    
                }
                catch(e)
                {
                    throw "绘图属性设置错误！";
                }
            }
            public AddListener(name:string,fun:EventListener)
            {
                this.canvas.addEventListener(name,fun);
            }
            public Focus()
            {
                this.canvas.focus();
            }
        }
        let WinSet={};//string -> WindowInfo
        let WindowStack:Array<WindowInfo>=[];
        export function CreateWindow()
        {
            let guidstr=Guid();
            //以当前窗口栈的最高序号后以为作为新窗口的index
            let win:WindowInfo=new WindowInfo({x:0,y:0},{h:0,w:0},WindowStack.length);
            WinSet[guidstr]=win;
            //加入窗口栈
            WindowStack.push(win);
            //添加点击激活
            win.AddListener("click",()=>{Active(guidstr);});
            return guidstr;
        }
        export function SetRect(guid:string,rect:IRect)
        {
            SetPosition(guid,<IPoint>{x:rect.x,y:rect.y});
            SetSize(guid,<ISize>{w:rect.w,h:rect.h});
        }
        export function SetPosition(guid:string,pos:IPoint)
        {
            let win:WindowInfo=WinSet[guid];
            win.SetPosition(pos);
        }
        export function SetSize(guid:string,size:ISize)
        {
            let win:WindowInfo=WinSet[guid];
            win.SetSize(size);
        }
        export function Show(guid:string)
        {
            let win:WindowInfo=WinSet[guid];
            win.Show();
        }
        export function Hide(guid:string)
        {
            let win:WindowInfo=WinSet[guid];
            win.Hide();
        }
        //最小化
        export function Min(guid:string)
        {
            
        }
        //最大化
        export function Max(guid:string)
        {

        }
        //窗口操作区域

        ///刷新窗口栈 重置zindex
        function UpdateWins()
        {
            let t=0;
            for(var w of WindowStack)
            {
                w.SetIndex(t);
                t++;
            }
        }
        //激活一个窗口，使之处于窗口栈的最上层
        //此函数将重置叠加栈
        export function Active(guid:string)
        {
            //从窗口栈中取出一个并放入末尾
            let win:WindowInfo=WinSet[guid];
            let index=win.Index;
            for(let t=index+1;t<WindowStack.length;++t)
            {
                let tw=WindowStack[t];
                tw.SetIndex(t-1);
                WindowStack[t-1]=WindowStack[t];
            }
            WindowStack[WindowStack.length-1]=win;
            win.SetIndex(WindowStack.length-1);
            win.Focus(); //窗口放在顶层并获得焦点
        }

        //绘图
        export function Paint(guid:string,fun:string,pars:string)
        {
            let win:WindowInfo=WinSet[guid];
            win.Paint(fun,pars);
        }
        export function SetProj(guid:string,proj:string,val:string)
        {
            let win:WindowInfo=WinSet[guid];
            win.SetContextPars(proj,val);
        }
        //事件
        export function AddListener(guid:string,name:string,fun:EventListener)
        {
            let win:WindowInfo=WinSet[guid];
            win.AddListener(name,fun);
        }

        //下面为类型定义
        export interface IRect
        {
            x:number;
            y:number;
            w:number;
            h:number;
        }
        export interface IPoint
        {
            x:number;
            y:number;
        }
        export interface ISize
        {
            w:number;
            h:number;
        }

    }
}