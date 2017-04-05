//传输层标准接口
var Protocol;
(function (Protocol) {
    var TransPort;
    (function (TransPort) {
        /**
         * 必要的说明：监听器函数可以接受4种类型，但是实际上不同的TransPort调用监听器函数
         * 时，传过来的数据类型不一定相同，例如JSONTransPort就只会提供Object型数据
         * 在转换时，任何GenericData类型的数据统一被转换为JSON字符串，后被接收函数
         * 转换为Object
         */
        var TransPortBase = (function () {
            function TransPortBase(tfunc) {
                //注意此函数并不与Transport传输的具体数据例如 Object 
                //其为TransPort的后台传输接口
                //例如JSONTransPort就需要一个可以接受string参数的TransFunc
                this.TransFunc = null;
                this.RectiverSet = [];
                //注册传输函数
                this.TransFunc = tfunc;
            }
            TransPortBase.prototype.registReceiver = function (func) {
                this.RectiverSet.push(func);
            };
            TransPortBase.prototype.CallAllReceiver = function (data) {
                for (var _i = 0, _a = this.RectiverSet; _i < _a.length; _i++) {
                    var t = _a[_i];
                    t(data);
                }
            };
            return TransPortBase;
        }());
        TransPort.TransPortBase = TransPortBase;
    })(TransPort = Protocol.TransPort || (Protocol.TransPort = {}));
})(Protocol || (Protocol = {}));
//# sourceMappingURL=ITransPort.js.map