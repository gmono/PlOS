/**
 * Created by gaozijian on 2017/3/31.
 */
//通用工具函数库
var System;
(function (System) {
    var Tools;
    (function (Tools) {
        function Guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        Tools.Guid = Guid;
        //简单的将一个对象方法转换为一个静态方法
        function ToStaticFunction(func, obj) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                func.apply(obj, args);
            };
        }
        Tools.ToStaticFunction = ToStaticFunction;
        //将一个对象的某个方法“对接”到另一个对象的另一方法上
        //注意这和方法赋值是不同的 后者会改变this默认值
        function AdaptFunction(rfname, rawobj, afname, adaptobj) {
            adaptobj[afname] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                //这里处理如果外部调用call或者apply时的情况
                if (this != adaptobj) {
                    rawobj[rfname].apply(this, args);
                }
                else
                    rawobj[rfname].apply(rawobj, args);
            };
        }
        Tools.AdaptFunction = AdaptFunction;
        function AdaptProp(rfname, rawobj, afname, adaptobj) {
            Object.defineProperty(adaptobj, afname, { get: function () { return rawobj[rfname]; },
                set: function (v) { rawobj[rfname] = v; } });
        }
        Tools.AdaptProp = AdaptProp;
        //对接两个对象的同名方法
        function AdaptOneFunc(name, robj, aobj) {
            AdaptFunction(name, robj, name, aobj);
        }
        Tools.AdaptOneFunc = AdaptOneFunc;
        function AdaptOneProp(name, robj, aobj) {
            AdaptProp(name, robj, name, aobj);
        }
        Tools.AdaptOneProp = AdaptOneProp;
        //嫁接所有方法和属性
        function AdaptAll(robj, aobj, except) {
            for (var t in robj) {
                //跳过排除的
                if (except.has(t))
                    continue;
                if (typeof robj[t] == "function") {
                    AdaptOneFunc(t, robj, aobj);
                }
                else {
                    AdaptOneProp(t, robj, aobj);
                }
            }
        }
        Tools.AdaptAll = AdaptAll;
        //桥接多个
        function AdaptMore(robj, aobj, adapts) {
            for (var t in robj) {
                //跳过不桥接的
                if (!adapts.has(t))
                    continue;
                if (typeof robj[t] == "function") {
                    AdaptOneFunc(t, robj, aobj);
                }
                else {
                    AdaptOneProp(t, robj, aobj);
                }
            }
        }
        Tools.AdaptMore = AdaptMore;
        //以下为工具类区域
        /**
         * 此类为事件集线器
         * 通过此类的成员ListenerList添加监听器
         */
        var EventHub = (function () {
            function EventHub() {
                this.ListenerList = [];
            }
            EventHub.prototype.Call = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.ListenerList.forEach(function (item) {
                    try {
                        item.apply(null, args);
                    }
                    catch (e) {
                        console.log("eventfunc error!", e);
                    }
                });
            };
            return EventHub;
        }());
        Tools.EventHub = EventHub;
    })(Tools = System.Tools || (System.Tools = {}));
})(System || (System = {}));
var System;
(function (System) {
    var ProcessCore;
    (function (ProcessCore) {
        var EventHub = System.Tools.EventHub;
        //Process封装类
        var Process = (function () {
            function Process(Sign, codeurl) {
                var _this = this;
                this.Sign = Sign;
                this.pwork = null;
                //表示Worker是否正在等待此消息 若是 则在接收到消息时迅速发送回去
                //否则放入队列
                this.isWaiting = false;
                //消息队列 保存接收的消息 不得不说JS的Array真是万能
                this.MsgQueue = [];
                //SendMessage事件回调函数
                this.OnSendMessage = null;
                this.pwork = new Worker(codeurl);
                //这里为了保证this指针的正常..
                this.pwork.onmessage = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this.OnWorkerMessage.apply(_this, args);
                };
            }
            //杀死进程
            Process.prototype.Kill = function () {
                this.pwork.terminate();
            };
            /**
             * Worker消息接收器
             * @param ev 事件对象
             */
            Process.prototype.OnWorkerMessage = function (ev) {
                try {
                    var data = ev.data;
                    if (data == null)
                        throw new Error("错误！消息不能为NULL或Undefined");
                    //判断是不是发送消息
                    if (data.operation == "Post") {
                        if (this.OnSendMessage)
                            this.OnSendMessage(this.Sign, data.data);
                        return;
                    }
                    //如果是请求消息
                    var getmsg = data.data;
                    //注意 worker同时只能请求一个消息
                    //所以只要是Waiting状态如果在发出一次不是Waiting状态的请求
                    //则自动退出Waiting
                    this.isWaiting = false;
                    if (this.MsgQueue.length == 0) {
                        if (getmsg.isWait) {
                            this.isWaiting = true;
                            return;
                        }
                        else {
                            //如果不等待就直接返回null消息
                            this.pwork.postMessage(null);
                            return;
                        }
                    }
                    //这里是消息队列有内容的情况
                    //取出发送
                    var msg = this.MsgQueue.shift();
                    this.pwork.postMessage(msg);
                }
                catch (e) {
                    console.log("the worker send a error message!");
                    console.log(e);
                }
            };
            //发送一个消息给进程
            Process.prototype.ReceiveMessage = function (msg) {
                //这里判断 如果正在等待则直接发送 否则放入队列
                //直接发送消息
                if (this.isWaiting)
                    this.pwork.postMessage(msg);
                else {
                    //如果不是等待状态 就放入队列等待请求
                    this.MsgQueue.push(msg);
                }
            };
            /**
             * 发送一个消息而不经过队列
             * @param msg 消息
             */
            Process.prototype.ReceiveNow = function (msg) {
                this.pwork.postMessage(msg);
            };
            return Process;
        }());
        ProcessCore.Process = Process;
        //此为本模块的消息构造函数 
        //构造一个本模块发送给进程的消息
        //Receiver不设置
        function MakeMsg(type, data) {
            return {
                Type: "System",
                Owner: "ProcessCore",
                DestType: "Process",
                Receiver: null,
                Data: {
                    Type: type,
                    Data: data
                }
            };
        }
        //进程表
        var ProcessMap = new Map();
        /**
         * 创建进程的基础函数
         * @param sign 进程的标记号
         * @param codeurl 进程脚本文件的url
         * @return 提供的sign或生成的sign
         */
        function CreateProcess(codeurl, sign) {
            if (sign === void 0) { sign = null; }
            if (sign == null)
                sign = System.Tools.Guid();
            //下面这行检测自定义sign的重复性
            if (ProcessMap.has(sign))
                return null;
            var proc = new Process(sign, codeurl);
            ProcessMap.set(sign, proc);
            //将process的发送消息事件绑定到消息集线器
            proc.OnSendMessage = MessageHub;
            //一切就绪 发送启动信号
            var msg = MakeMsg("Start", null);
            msg.Receiver = sign;
            proc.ReceiveNow(msg);
            return sign;
        }
        ProcessCore.CreateProcess = CreateProcess;
        //消息集合
        ProcessCore.OnSendMessage = new EventHub();
        /**
         * 消息集线器 所有进程的消息都发送到这个函数由这个函数包装为一个
         * 标准信息对象后发出
         * 此模块的消息集线器只负责包装消息后发出
         * 不负责解析消息 消息内容与集线器无关
         * @param sign 进程sign 由Process类报告
         * @param data 发送的消息
         */
        function MessageHub(sign, data) {
            var msg = {
                Type: "Process",
                Owner: sign,
                DestType: data.DestType,
                Receiver: data.Dest,
                Data: data.Data
            };
            //调用所有监听器
            ProcessCore.OnSendMessage.Call(msg);
        }
        /**
         * 由代码文本创建进程
         * @param code 代码文本
         * @param sign 进程sign
         */
        function CreateProcessByCode(code, sign) {
            if (sign === void 0) { sign = null; }
            var blob = new Blob([code]);
            var url = window.URL.createObjectURL(blob);
            return CreateProcess(url, sign);
        }
        ProcessCore.CreateProcessByCode = CreateProcessByCode;
        /**
         * 获取一个进程结构体
         * @param sign 进程sign
         */
        function GetProcessBySign(sign) {
            if (ProcessMap.has(sign))
                return ProcessMap.get(sign);
            return null;
        }
        ProcessCore.GetProcessBySign = GetProcessBySign;
        /**
         * 杀死一个进程 timeout设置等待时间 如果发送了kill消息进程指定时间内无回复
         * 则强制结束 timeout设为0则直接结束不等待
         * @param sign 进程sign
         * @param timeout 超时
         */
        function KillProcess(sign, timeout) {
            var proc = ProcessMap.get(sign);
            if (proc == null)
                return;
            var checkfun = function () {
                //检查函数 如果到时间了还有 就直接结束
                if (ProcessMap.has(sign)) {
                    proc.Kill();
                }
            };
            //这里先发送Kill消息
            var msg = MakeMsg("Kill", null);
            msg.Receiver = sign;
            proc.ReceiveNow(msg);
            //设置超时检查
            setTimeout(checkfun, timeout);
            //如果没有超时则进程应该发送了kill消息 此时下面的Kill接收者应该响应从而结束发送者进程
        }
        ProcessCore.KillProcess = KillProcess;
        //这里设置一个固定的Kill接收者
        //其接受进程发来的Kill消息并结束对应进程
        ProcessCore.OnSendMessage.ListenerList.push(function (msg) {
            var proc = ProcessMap.get(msg.Owner);
            proc.Kill();
        });
    })(ProcessCore = System.ProcessCore || (System.ProcessCore = {}));
})(System || (System = {}));
var System;
(function (System) {
    /**
     * 系统总初始化函数
     */
    function Init() {
        var CreateProcess = System.ProcessCore.CreateProcessByCode;
        var sign = CreateProcess("\n        onmessage=function(){\n            for(let i=0;i<100;++i){console.log(i);}\n        postMessage({operation:\"Post\",data:{DestType:\"Process\",Dest:\"hello\",Data:\"hello world\"}});\n        }\n        \n        ");
        System.ProcessCore.OnSendMessage.ListenerList.push(function (msg) {
            alert(JSON.stringify(msg));
        });
    }
    System.Init = Init;
})(System || (System = {}));
//# sourceMappingURL=System.js.map