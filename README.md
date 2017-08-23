 # PlOS
基于Web前端技术的可扩展WebOS系统
## 总体规划
为了简化设计和开发，目前第三次重新设计了整体架构，目测具有可行性
模块：
1.  System.Tools 提供基础工具函数的支持，主要给系统和系统模块用
2.  System.ProcessCore 负责为进程的创建销毁和服务(sharedWorker)的创建销毁和其他操作提供基本支持
3.  System.MessageCore 负责分拣消息，消息可以是从Process中传出的，也可以是系统传入Process的 其直接与ProcessCore连接
4.  System.UI 提供UI支持 包括窗口创建销毁 绘图等
5.  System.DataType 命名空间提供对公用类和接口定义的包装
System.ProcessCore 中有Process类封装了Worker，其提供一个传入消息的消息队列功能，只有当Worker内的程序主动发送get消息时其才会将队列顶部的消息返回，没有消息则根据get消息中的信息选择等待有后返回，或直接返回无消息
核心框架中IMessage对象为在各模块之间传递消息的唯一标准对象
## 系统库
在系统核心完成后，系统库就要开始编写，系统库是给Worker中的脚本使用的库，通过importScript函数加载，此部分可能是本项目具有一定意义的关键所在
系统库包括最主要的一个部分就是对接收消息的初级解析，和对发送消息的初步封装，解析包括对ProcessCore发送的Start和Kill消息提供回调接口等
## 进展
目前进行了第三次设计 目测有较强的可实现性，目前已经完成了ProcessCore部分
Test为测试文件 目前已经将最关键的支撑技术之一 SharedArrayBuffer测试成功
它将用来进行高效“进程”间通信，特别是程序和UI模块之间的通信
目前关于共享内存即SharedArrayBuffer的支持还没有考虑进去
先做出原型再说
## 附加说明
### 依赖顺序
已经在tsconfig中配置好 为Tools和DataType为第一级 ProcessCore为第二级 MessageCore为第三级 UI为第四级别 
### UI说明
由于完全使用Canvas绘制UI可能导致一般的网页技术不能再使用，目前考虑通过VirtualDOM对象直接传递HTML数据或者直接允许传送HTML和CSS
如果采用Canvas则需要提供一个类Canvas 2D Renderer对象的类实例 已允许已有的通过Canvas绘制UI的界面库或游戏直接执行
