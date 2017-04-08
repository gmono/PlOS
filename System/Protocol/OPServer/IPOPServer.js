var Protocol;
(function (Protocol) {
    /**
     * 此为OP服务器命名空间
     */
    var OPServer;
    (function (OPServer) {
        /**
         * 这是内部接口操作协议服务器部分
         * 它提供注册接口函数 和提供接口函数调用的功能
         * 接口函数可以由多方注册，调用同样是多方调用
         * 与提供一个综合的函数容器System.Ports 差不多
         * 但是不同的是，此服务器采用TransPort为基本信息传递方式
         * 提供基于通用数据传递的调用
         * 其为注册的函数提供了一些附加属性 例如接收参数类型 object BinObject
         */
        var IPOPServer = (function () {
            function IPOPServer(transer) {
                this.Transer = null;
                this.TopContainer = new Map();
                this.Transer = transer;
            }
            /**
             * 使用一个顶层容器 注意不可有名字冲突
             * 否则将发生替换
             * @param cont 函数集顶层容器
             */
            IPOPServer.prototype.Use = function (name, cont) {
                this.TopContainer.set(name, cont);
            };
            /**
             * HasContainer 是否存在指定对象容器
             */
            IPOPServer.prototype.HasContainer = function (name) {
                return this.TopContainer.has(name);
            };
            /**
             * CallMethod 直接调用一个方法
             * 使用常规调用方法 返回值有的话会返回 否则返回undefined
             */
            IPOPServer.prototype.CallMethod = function (path, par) {
                //搜索指定路径的对象
                try {
                    if (typeof path == "string") {
                        path = path.split('.');
                    }
                    var nowobj = this.TopContainer;
                    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                        var n = path_1[_i];
                        nowobj = nowobj[n];
                    }
                    if (!(nowobj instanceof OPServer.IPOPFunction)) {
                        throw "目标不是一个可调用函数！";
                    }
                    var objfun = nowobj;
                    var fun = objfun.Func;
                    switch (objfun.Pars) {
                        case OPServer.ParsType.None:
                            if (par != null)
                                throw "调用参数类型错误!应为NULL";
                        case OPServer.ParsType.Both:
                            break;
                        case OPServer.ParsType.BinObject:
                            if (!(par instanceof ArrayBuffer || par instanceof SharedArrayBuffer)) {
                                throw "调用参数类型错误 应为BinObject";
                            }
                            break;
                        case OPServer.ParsType.Object:
                            //如果是Bin
                            if ((par instanceof ArrayBuffer || par instanceof SharedArrayBuffer)) {
                                throw "调用参数类型错误 应为普通Object";
                            }
                            break;
                    }
                    if (objfun.HasResult) {
                        return fun(par);
                    }
                    else
                        fun(par);
                }
                catch (e) {
                    throw "\u8C03\u7528\u9519\u8BEF:" + e;
                }
            };
            /**
             * ClientOperate 客户端调用函数
             * 此函数接受一个特定格式的数据（通常此数据为Client类生成)
             * 此函数对数据进行解析后执行相应操作
             * 此函数包含与Client交互的相关操作
             */
            IPOPServer.prototype.ClientOperate = function (data) {
            };
            /**
             * ClientCall客户端调用函数 真正起作用的函数
             * 此函数解析后执行调用并通过TransPort返回结果
             */
            IPOPServer.prototype.ClientCall = function (data) {
            };
            return IPOPServer;
        }());
        OPServer.IPOPServer = IPOPServer;
    })(OPServer = Protocol.OPServer || (Protocol.OPServer = {}));
})(Protocol || (Protocol = {}));
//# sourceMappingURL=IPOPServer.js.map