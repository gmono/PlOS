/**
 * Created by gaozijian on 2017/3/31.
 */
//UI层基础设施 提供窗口创建 焦点管理，输入管理
//窗口查询等（所属Worker）
var System;
(function (System) {
    var UIManager;
    (function (UIManager) {
        var Guid = System.Tools.Guid;
        var WindowInfo = (function () {
            function WindowInfo(pos, size, index) {
                if (index === void 0) { index = 0; }
                //封装Canvas
                //保存窗口的位置 大小 层次信息
                this.canvas = null;
                this.context = null;
                this.Rect = null;
                this.IsShowing = false;
                this.Index = 0;
                this.canvas = document.createElement("canvas");
                this.Rect = {};
                this.SetPosition(pos);
                this.SetSize(size);
                this.SetIndex(index);
                document.body.appendChild(this.canvas);
                this.context = this.canvas.getContext("2d");
            }
            WindowInfo.prototype.SetPosition = function (pos) {
                this.canvas.style.left = pos.x + "px";
                this.canvas.style.top = pos.y + "px";
                this.Rect.x = pos.x;
                this.Rect.y = pos.y;
            };
            WindowInfo.prototype.SetSize = function (size) {
                this.canvas.style.height = size.h + "px";
                this.canvas.style.width = size.w + "px";
                this.Rect.h = size.h;
                this.Rect.w = size.w;
            };
            WindowInfo.prototype.Hide = function () {
                this.canvas.style.display = "none";
                this.IsShowing = false;
            };
            WindowInfo.prototype.Show = function () {
                this.IsShowing = true;
                this.canvas.style.display = "block";
            };
            WindowInfo.prototype.SetIndex = function (index) {
                this.canvas.style.zIndex = "" + index;
                this.Index = index;
            };
            //窗口绘图
            WindowInfo.prototype.Paint = function (fun, pars) {
                try {
                    var parobj = JSON.parse(pars);
                    var funobj = this.context[fun];
                    funobj.apply(this.context, parobj);
                }
                catch (e) {
                    //捕捉到任何错误都抛出一个绘图错误
                    //可能的错误：JSON解析失败 没有指定函数 其他未知
                    throw "绘图错误！";
                }
            };
            //设置属性的函数
            WindowInfo.prototype.SetContextPars = function (proj, val) {
                try {
                    this.context[proj] = val;
                }
                catch (e) {
                    throw "绘图属性设置错误！";
                }
            };
            WindowInfo.prototype.AddListener = function (name, fun) {
                this.canvas.addEventListener(name, fun);
            };
            WindowInfo.prototype.Focus = function () {
                this.canvas.focus();
            };
            return WindowInfo;
        }());
        var WinSet = {}; //string -> WindowInfo
        var WindowStack = [];
        function CreateWindow() {
            var guidstr = Guid();
            //以当前窗口栈的最高序号后以为作为新窗口的index
            var win = new WindowInfo({ x: 0, y: 0 }, { h: 0, w: 0 }, WindowStack.length);
            WinSet[guidstr] = win;
            //加入窗口栈
            WindowStack.push(win);
            //添加点击激活
            win.AddListener("click", function () { Active(guidstr); });
            return guidstr;
        }
        UIManager.CreateWindow = CreateWindow;
        function SetRect(guid, rect) {
            UIManager.SetPosition(guid, { x: rect.x, y: rect.y });
            UIManager.SetSize(guid, { w: rect.w, h: rect.h });
        }
        UIManager.SetRect = SetRect;
        //以下为包装函数 使用装饰器包装
        //此函数将window类的对应函数对外公开为全局函数
        function ToGlobalFun(fun) {
            return function (guid) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var win = WinSet[guid];
                fun.apply(win, args);
            };
        }
        UIManager.SetPosition = ToGlobalFun(WindowInfo.prototype.SetPosition);
        UIManager.SetSize = ToGlobalFun(WindowInfo.prototype.SetSize);
        UIManager.Show = ToGlobalFun(WindowInfo.prototype.Show);
        UIManager.Hide = ToGlobalFun(WindowInfo.prototype.Hide);
        //最小化
        function Min(guid) {
        }
        UIManager.Min = Min;
        //最大化
        function Max(guid) {
        }
        UIManager.Max = Max;
        //窗口操作区域
        ///刷新窗口栈 重置zindex
        function UpdateWins() {
            var t = 0;
            for (var _i = 0, WindowStack_1 = WindowStack; _i < WindowStack_1.length; _i++) {
                var w = WindowStack_1[_i];
                w.SetIndex(t);
                t++;
            }
        }
        //激活一个窗口，使之处于窗口栈的最上层
        //此函数将重置叠加栈
        function Active(guid) {
            //从窗口栈中取出一个并放入末尾
            var win = WinSet[guid];
            var index = win.Index;
            for (var t = index + 1; t < WindowStack.length; ++t) {
                var tw = WindowStack[t];
                tw.SetIndex(t - 1);
                WindowStack[t - 1] = WindowStack[t];
            }
            WindowStack[WindowStack.length - 1] = win;
            win.SetIndex(WindowStack.length - 1);
            win.Focus(); //窗口放在顶层并获得焦点
        }
        UIManager.Active = Active;
        //绘图
        UIManager.Paint = ToGlobalFun(WindowInfo.prototype.Paint);
        UIManager.SetPaintProj = ToGlobalFun(WindowInfo.prototype.SetContextPars);
        //事件
        UIManager.AddListener = ToGlobalFun(WindowInfo.prototype.AddListener);
    })(UIManager = System.UIManager || (System.UIManager = {}));
})(System || (System = {}));
//# sourceMappingURL=UIManager.js.map