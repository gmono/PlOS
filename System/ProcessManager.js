/**
 * Created by gaozijian on 2017/3/31.
 */
//实现Worker的管理和查询
//包括基础的通信支持
//以及Worker级别上的权限管理
//准确的说 是提供对权限号的查询 权限号是一个数字 不同程序根据此标号来判断是否提供服务
//因此权限控制在此管理器中仅仅为保存一个信息，并不指定其意义
var System;
(function (System) {
    var ProcessManager;
    (function (ProcessManager) {
        //封装Worker为Process
        var Process = (function () {
            function Process(guid, path, receiver) {
                this.worker = null;
                //此进程的进程号
                this.guid = "";
                this.path = "";
                //接收到数据时被调用
                //null则不调用
                this.receive = null;
                this.guid = guid;
                this.receive = receiver;
                this.path = path;
            }
            Process.prototype.SetReceiver = function (rece) {
                this.receive = rece;
            };
            Process.prototype.Init = function () {
                var _this = this;
                //初始化函数
                //只有在这个函数被调用时 worker真正被创建
                this.worker = new Worker(this.path);
                this.worker.onmessage = function (event) {
                    //调用接收器函数
                    _this.receive(event.data);
                };
            };
            Process.prototype.Kill = function () {
                this.worker.terminate();
            };
            Process.prototype.postMessage = function (data) {
                this.worker.postMessage(data);
            };
            return Process;
        }());
        ProcessManager.Process = Process;
        //以下为管理器部分
        //guid->process
        var ProcessMap = new Map();
        function GlobalReceive(guid, data) {
        }
        function CreateProcessFromUrl(path) {
            var guid = System.Tools.Guid();
            var proc = new Process(guid, path, function (data) {
                GlobalReceive(guid, data);
            });
            ProcessMap.set(guid, proc);
            proc.Init();
            return guid;
        }
        ProcessManager.CreateProcessFromUrl = CreateProcessFromUrl;
        function CreateProcess(code) {
            var blob = new Blob([code], { type: "text/plain" });
            var url = window.URL.createObjectURL(blob);
            return CreateProcessFromUrl(url);
        }
        ProcessManager.CreateProcess = CreateProcess;
    })(ProcessManager = System.ProcessManager || (System.ProcessManager = {}));
})(System || (System = {}));
//# sourceMappingURL=ProcessManager.js.map