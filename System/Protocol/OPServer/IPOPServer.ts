
namespace Protocol
{
    /**
     * 此为OP服务器命名空间
     */
    export namespace OPServer
    {
        import TransPortBase=TransPort.TransPortBase;
        /**
         * 这是内部接口操作协议服务器部分
         * 它提供注册接口函数 和提供接口函数调用的功能
         * 接口函数可以由多方注册，调用同样是多方调用
         * 与提供一个综合的函数容器System.Ports 差不多
         * 但是不同的是，此服务器采用TransPort为基本信息传递方式
         * 提供基于通用数据传递的调用
         * 其为注册的函数提供了一些附加属性 例如接收参数类型 object BinObject
         */
        export class IPOPServer
        {
            private Transer:TransPortBase=null;
            public constructor(transer:TransPortBase)
            {
                this.Transer=transer;
            }
            /**
             * 使用一个顶层容器 注意不可有名字冲突
             * @param cont 函数集顶层容器
             */
            public Use(name:string,cont:object):void
            {

            }

        }
    }
}