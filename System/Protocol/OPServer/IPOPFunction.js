var Protocol;
(function (Protocol) {
    var OPServer;
    (function (OPServer) {
        //对于Both为Object在前 BinObject在后
        //由于BinObject之间可互相转化 因此不做特殊声明处理
        var ParsType;
        (function (ParsType) {
            ParsType[ParsType["BinObject"] = 0] = "BinObject";
            ParsType[ParsType["Object"] = 1] = "Object";
            ParsType[ParsType["Both"] = 2] = "Both";
            ParsType[ParsType["None"] = 3] = "None";
        })(ParsType = OPServer.ParsType || (OPServer.ParsType = {}));
        ;
        /**
         * 此为IPOP协议中的标准被调用接口的基本类
         * 提供附加属性
         * 例如有无返回值（是否需要等待返回值）
         * 接受什么类型的参数（TransPort会提供三种参数声明方式 BinObject Object 和双选）
         * 由于TransPort仅负责传输数据 对于两个调用参数的接口
         * 需要特殊处理
         */
        var IPOPFunction = (function () {
            function IPOPFunction(fun, partype, result) {
                if (partype === void 0) { partype = ParsType.None; }
                if (result === void 0) { result = false; }
                this.Pars = ParsType.None;
                this.HasResult = false;
                this.Func = null;
                this.Func = fun;
                this.Pars = partype;
                this.HasResult = result;
            }
            return IPOPFunction;
        }());
        OPServer.IPOPFunction = IPOPFunction;
    })(OPServer = Protocol.OPServer || (Protocol.OPServer = {}));
})(Protocol || (Protocol = {}));
//# sourceMappingURL=IPOPFunction.js.map