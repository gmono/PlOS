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
                //是否处于等待调用返回的状态
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
        //这里规定进程发送的信息必须都是系统调用即复合RemoteCallInfo标准
        //每个进程同时只能进行一次系统调用然后就要等待其返回
        //查找表 从调用sign->process guid
        //用于标识一个sign对应哪个进程guid
        var ProcessCallMap = new Map();
        function GlobalReceive(guid, data) {
            var proc = ProcessMap.get(guid);
            if (proc != null) {
                var info_1 = data;
                //把调用的sign和进程的guid关联
                ProcessCallMap.set(info_1.sign, guid);
                System.RemoteProcess.Call(info_1, function (ret) {
                    //通过调用sign找到process sign
                    var psign = ProcessCallMap.get(ret.sign);
                    if (psign == null)
                        return; //直接忽略
                    var retproc = ProcessMap.get(psign);
                    if (retproc == null)
                        return; //也是忽略
                    //这里确定回执成功进行 则删除此调用在表中的映射
                    ProcessCallMap.delete(info_1.sign);
                    //发送回执到进程
                    retproc.postMessage(ret);
                });
            }
            throw new Error("错误！全局调用接收器无法找到对应Process");
        }
        //从一个URL创建一个进程
        //此URL应是一个合法的js文件
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
        //此函数通过string创建进程
        //通过bolb创建对象url来创建Worker
        function CreateProcess(code) {
            var blob = new Blob([code], { type: "text/plain" });
            var url = window.URL.createObjectURL(blob);
            return CreateProcessFromUrl(url);
        }
        ProcessManager.CreateProcess = CreateProcess;
        /**
         * 杀死一个进程
         * @param guid 进程guid
         */
        function Kill(guid) {
            var proc = ProcessMap.get(guid);
            if (proc != null) {
                ProcessMap.delete(guid);
                proc.Kill();
            }
        }
        ProcessManager.Kill = Kill;
    })(ProcessManager = System.ProcessManager || (System.ProcessManager = {}));
})(System || (System = {}));
//# sourceMappingURL=ProcessManager.js.map