namespace System
{
    export namespace DataType
    {
        /**
         * 消息类型
         * 在类型为System时 Owner或Receiver指的是系统各部自定义的代号
         * 在类型为Process时为对应的进程sign
         */
        export type MessageType="System"|"Process";
        /**
         * 标准消息格式
         */
        export interface IMessage
        {
            //源
            Type:MessageType;
            Owner:string;
            //目的
            DestType:MessageType;
            Receiver:string;
            Data:any;
        }
    }
}