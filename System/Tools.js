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
//# sourceMappingURL=Tools.js.map