/**
 * Created by gaozijian on 2017/3/31.
 */
//消息核心模块 提供消息注册和广播的功能
//以及消息校验功能
var System;
(function (System) {
    //此处采用多级查询方式 数组 从0号元素开始分别表示一个查询 例如 ['System','Event','CreateWindow']
    //就代表System.Event.CreateWindow消息
    //每个消息带有一个对象作为消息参数 类型不限
    var MessageCore;
    (function (MessageCore) {
        var ArrayName = 'Listeners';
        var TypeSet = {};
        //查询是否有指定类型的消息
        function HasMessageType(tyns) {
            var nowobj = TypeSet;
            for (var _i = 0, tyns_1 = tyns; _i < tyns_1.length; _i++) {
                var t = tyns_1[_i];
                nowobj = nowobj[t];
                if (nowobj != null) {
                    //找到
                    return false;
                }
            }
            return true;
        }
        MessageCore.HasMessageType = HasMessageType;
        //获取指定类型消息对应的监听器列表
        function GetMessageListenObject(tyns) {
            var nowobj = TypeSet;
            for (var _i = 0, tyns_2 = tyns; _i < tyns_2.length; _i++) {
                var t = tyns_2[_i];
                nowobj = nowobj[t];
                if (nowobj == null) {
                    //找不到
                    return null;
                }
            }
            return nowobj[ArrayName];
        }
        MessageCore.GetMessageListenObject = GetMessageListenObject;
        //注册一个消息类型
        function RegistMessageType(tyns) {
            if (HasMessageType(tyns))
                return false;
            var nowobj = TypeSet;
            //校验
            for (var _i = 0, tyns_3 = tyns; _i < tyns_3.length; _i++) {
                var t = tyns_3[_i];
                nowobj = TypeSet[t];
                if (nowobj == null) {
                    //没有就创建
                    TypeSet[t] = {};
                    nowobj = TypeSet[t];
                }
            }
            nowobj[ArrayName] = []; //创建一个空数组
            //注册完成 最底层对象为空对象 占位表示有此消息类型 其中有个数组 此数组里的每一个成员都是监听器函数
            return true;
        }
        MessageCore.RegistMessageType = RegistMessageType;
        //obj为消息参数
        //在广播消息时由广播者提供
        //注册一个消息监听器
        function RegistEventListener(tyns, listen) {
            if (HasMessageType(tyns)) {
                var obj = GetMessageListenObject(tyns);
                obj.push(listen);
                return true;
            }
            else
                return false;
        }
        MessageCore.RegistEventListener = RegistEventListener;
        //发送一个消息
        function SendMessage(tyns, obj) {
            var larr = GetMessageListenObject(tyns);
            for (var _i = 0, larr_1 = larr; _i < larr_1.length; _i++) {
                var tfun = larr_1[_i];
                //提供obj的副本
                var tempobj = JSON.parse(JSON.stringify(obj)); //这样获得一个副本
                tfun(tempobj);
            }
        }
        MessageCore.SendMessage = SendMessage;
        //辅助函数 装饰器实现
        //此函数用于将System.Event.XXX这样的字符串类型名转换为数组
        //返回一个新函数 用于提供字符串参数接收功能
        function ToStrFun(fun) {
            return function (fullname) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var arr = fullname.split('.');
                fun.apply(void 0, [arr].concat(args));
            };
        }
        MessageCore.SendMsg = ToStrFun(SendMessage);
        MessageCore.HasMsgType = ToStrFun(HasMessageType);
        MessageCore.GetListenerArray = ToStrFun(GetMessageListenObject);
        MessageCore.Regist = ToStrFun(RegistMessageType);
        MessageCore.ListenRegist = ToStrFun(RegistEventListener);
    })(MessageCore = System.MessageCore || (System.MessageCore = {}));
})(System || (System = {}));
//# sourceMappingURL=MessageCore.js.map