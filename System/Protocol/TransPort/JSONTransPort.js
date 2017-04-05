//使用JSON为传输数据的基本形式
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Protocol;
(function (Protocol) {
    var TransPort;
    (function (TransPort) {
        var JSONTransPort = (function (_super) {
            __extends(JSONTransPort, _super);
            function JSONTransPort() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            JSONTransPort.prototype.sendObject = function (obj) {
            };
            JSONTransPort.prototype.sendBlob = function (blob) {
            };
            //下面这个函数由外部调用传入一个接收到的数据
            JSONTransPort.prototype.receiveData = function (data) {
                if (typeof data == "string") {
                    try {
                        var obj = JSON.parse(data);
                        this.CallAllReceiver(obj);
                    }
                    catch (e) {
                        throw "错误！接收数据解析失败！";
                    }
                }
                throw "错误！JSONTransPort接收数据类型错误！";
            };
            return JSONTransPort;
        }(TransPort.TransPortBase));
        TransPort.JSONTransPort = JSONTransPort;
    })(TransPort = Protocol.TransPort || (Protocol.TransPort = {}));
})(Protocol || (Protocol = {}));
//# sourceMappingURL=JSONTransPort.js.map