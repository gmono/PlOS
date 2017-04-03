//传输层标准接口
var Protocol;
(function (Protocol) {
    var TransPort;
    (function (TransPort) {
        var TransPortBase = (function () {
            function TransPortBase() {
                this.TransFunc = null;
                this.RectiverSet = [];
            }
            TransPortBase.prototype.TransPortBase = function (tfunc) {
                //注册传输函数
                this.TransFunc = tfunc;
            };
            TransPortBase.prototype.registReceiver = function (func) {
                this.RectiverSet.push(func);
            };
            return TransPortBase;
        }());
        TransPort.TransPortBase = TransPortBase;
    })(TransPort = Protocol.TransPort || (Protocol.TransPort = {}));
})(Protocol || (Protocol = {}));
//# sourceMappingURL=ITransPort.js.map