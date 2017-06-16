 # PlOS
基于Web前端技术的可扩展WebOS系统
## 协议
废除IPOP协议，直接全局使用JSON进行通信，对于系统调用有专门的RemoteProcess模块处理
而对于普通对等通信则直接互发消息即可
## 总体架构
外围模块: System.Tools 命名空间用于提供基本工具函数支持 例如GUID生成器
核心模块:
1.  System.RemoteProcess 命名空间用于提供“远程过程调用”支持 提供受限容器功能
2.  System.MessageCore 命名空间用于提供消息广播功能支持
3.  System.ProcessManager 命名空间用于提供进程的创建销毁和进程间通信支持
4.  System.Store 命名空间用于提供统一的“文件系统API”
5.  System.ApplicationManager 命名空间用于提供应用级别的管理功能 包括权限记录 应用安装记录等
6.  System.UIManager 命名空间用于提供UI绘图支持 目前此模块的实现有很大问题 考虑改为“拟自绘”方式
7.  System.ModuleManager 命名空间提供系统模块加载功能
8.  System.Service 命名空间提供服务管理（主要是SharedWebWorker的管理）