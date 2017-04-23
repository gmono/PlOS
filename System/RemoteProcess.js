var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var System;
(function (System) {
    /**
     * 远程过程调用模块
     * 处理远程调用 关联到顶层容器
     */
    var RemoteProcess;
    (function (RemoteProcess) {
        var Container = {};
        /**
         * 注册一个顶层容器
         * @param name 顶层容器名
         * @param obj 顶层容器
         */
        function RegistContainer(name, obj) {
            if (!(name in Container)) {
                Container[name] = obj;
                return true;
            }
            return false;
        }
        RemoteProcess.RegistContainer = RegistContainer;
        /**
         * 通过一个通用的调用信息对象来调用方法
         * 此为异步方法 不返回值
         * @param info 调用信息对象
         * @param msgfunc 调用结束后的回调方法 用于传回返回值
         */
        function Call(info, msgfunc) {
            return __awaiter(this, void 0, void 0, function () {
                var paths, now, old, _i, paths_1, t, ret;
                return __generator(this, function (_a) {
                    paths = info.name.split('.');
                    now = Container;
                    old = null;
                    for (_i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                        t = paths_1[_i];
                        old = now;
                        now = now[t];
                        if (now == null)
                            throw new Error("远程函数调用错误！路径不存在");
                    }
                    //now为function对象
                    if (typeof now != "function") {
                        throw new Error("远程函数调用错误！目标不是函数");
                    }
                    ret = now.apply(old, info.params);
                    //回送返回值
                    msgfunc({ sign: info.sign, data: ret });
                    return [2 /*return*/];
                });
            });
        }
        RemoteProcess.Call = Call;
    })(RemoteProcess = System.RemoteProcess || (System.RemoteProcess = {}));
})(System || (System = {}));
//# sourceMappingURL=RemoteProcess.js.map