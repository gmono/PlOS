 # PlOS
基于Web前端技术的可扩展WebOS系统
## 总体规划
为了简化设计和开发，目前第三次重新设计了整体架构，目测具有可行性
模块：
1.  System.Tools 提供基础工具函数的支持，主要给系统和系统模块用
2.  System.ProcessCore 负责为进程的创建销毁和服务(sharedWorker)的创建销毁和其他操作提供基本支持
3.  System.MessageCore 负责分拣消息，消息可以是从Process中传出的，也可以是系统传入Process的 其直接与ProcessCore连接
4.  System.
5.  System.UI 提供UI支持 包括窗口创建销毁 绘图等
6.  System.Data 命名空间提供对公用类和接口定义的包装
System.ProcessCore 中有Process类封装了Worker，其提供一个传入消息的消息队列功能，只有当Worker内的程序主动发送get消息时其才会将队列顶部的消息返回，没有消息则根据get消息中的信息选择等待有后返回，或直接返回无消息

由Worker传出的基本消息为System.Data.IMessage对象 其中有Type成员表示Get或Post
Data成员表示具体信息 Get时 Data为一个bool值true表示需要等待，false表示无需等待
Post时 Data表示要发送出去的数据对象
Process内部直接将Post消息中的Data发送出去，而不管其中的内容
Data在Process内部被包装到一个IProcessMessage接口对象里，此对象中PID为发送者进程的GUID，Data就为Data对象本身
这个IProcessMessage被发送到MessageCore中对应的接收函数中，剩下的就是MessageCore的事情了
关于MessageCore的工作日后再补
## 系统支持库
在系统核心完成后，系统支持库就要开始编写，系统支持库是给Worker中的脚本使用的库，通过importScript函数加载，此部分可能是本项目具有一定意义的关键所在
## 进展
目前进行了第三次设计 目测有较强的可实现性，目前已经完成了ProcessCore部分，核心部分还剩MessageCore未完成