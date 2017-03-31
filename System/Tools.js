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
        //容器类
        //这里自己模拟一个Map和Set类 以免受到智能提示支持不足的影响
        //同时实现一个栈
        var Stack = (function () {
            function Stack() {
                this.contain = [];
            }
            ///此函数返回当前栈的item数
            Stack.prototype.push = function (obj) {
                this.contain.push(obj);
                return this.contain.length;
            };
            //此函数弹出当前栈的栈顶 如果栈空则返回undefined
            Stack.prototype.pop = function () {
                if (this.contain.length == 0) {
                    return undefined;
                }
                var temp = this.front();
                this.contain.length--;
                return temp;
            };
            //返回栈顶引用空返回undefined
            Stack.prototype.front = function () {
                if (this.contain.length == 0) {
                    return undefined;
                }
            };
            Stack.prototype.length = function () {
                return this.contain.length;
            };
            return Stack;
        }());
        Tools.Stack = Stack;
    })(Tools = System.Tools || (System.Tools = {}));
})(System || (System = {}));
//# sourceMappingURL=Tools.js.map