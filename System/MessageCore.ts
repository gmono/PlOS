namespace System
{
    /**
     * 此为消息核心
     * 从系统各处收集各种消息分拣后进行重定向
     * 消息核心在ProcessCore之后初始化所以此处已经可以引用ProcessCore中的内容
     */
    export namespace MessageCore
    {
        import MessageHub=ProcessCore.OnSendMessage;
        import IMessage=DataType.IMessage;
        import MSGReceiver=ProcessCore.MessageReceiver;
        import Process=ProcessCore.Process;
        function MessageHandle(msg:IMessage):void{
            //这里接收所有消息并进行分拣
            if(msg.DestType=="System"){
                SystemMSGHub(msg);
                return;
            }
            //如果是到进程的消息 回发给ProcessCore
            let proc=ProcessCore.GetProcessBySign(msg.Receiver);
            if(proc!=null){
                //此为有效sign
                proc.ReceiveMessage(msg);
            }
        }


        //下面为系统消息分发部分
        //此为从dest名到接收器的映射
        let SystemReceivers=new Map<string,MSGReceiver>();
        //对于系统消息 会根据注册的情况进行分发
        /**
         * 
         * @param destname 注册目的名
         * @param receive 注册接收器
         * @return 是否注册成功 如果没有说明有冲突
         */
        export function SystemDestRegist(destname:string,receiver:MSGReceiver):boolean
        {
            if(SystemReceivers.has(destname)) return false;
            if(receiver==null) throw new Error("错误 ，Receiver不能为null");
            SystemReceivers.set(destname,receiver);
        }
        /**
         * 系统消息集线器
         * @param msg 消息
         */
         function SystemMSGHub(msg:IMessage)
        {
            if(SystemReceivers.has(msg.Receiver)){
                let receiver=SystemReceivers.get(msg.Receiver);
                receiver(msg);
            }
            //否则什么也不做
        }
        MessageHub.ListenerList.push(MessageHandle);
    }
}