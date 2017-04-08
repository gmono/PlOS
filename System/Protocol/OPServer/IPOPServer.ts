
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


            protected TopContainer:Map<string,object>=new Map<string,object>();
            /**
             * 使用一个顶层容器 注意不可有名字冲突
             * 否则将发生替换
             * @param cont 函数集顶层容器
             */
            public Use(name:string,cont:object):void
            {
                this.TopContainer.set(name,cont);
            }
            /**
             * HasContainer 是否存在指定对象容器
             */
            public HasContainer(name:string) {
                return this.TopContainer.has(name);
            }
            /**
             * CallMethod 直接调用一个方法
             * 使用常规调用方法 返回值有的话会返回 否则返回undefined
             */
            public CallMethod(path:string|string[],par:TransPort.GenericData):any {
                //搜索指定路径的对象
                try
                {
                    if(typeof path=="string")
                    {
                        path=path.split('.');
                    }
                    let nowobj=this.TopContainer;
                    for(let n of path)
                    {
                        nowobj=nowobj[n];
                    }
                    if(!(nowobj instanceof IPOPFunction))
                    {
                        throw "目标不是一个可调用函数！";
                    }
                    let objfun:IPOPFunction=nowobj as IPOPFunction;
                    let fun=objfun.Func;
                    switch(objfun.Pars)
                    {
                        case ParsType.None:
                        if(par!=null) throw "调用参数类型错误!应为NULL"
                        case ParsType.Both:
                        break;
                        case ParsType.BinObject:
                        if(!(par instanceof ArrayBuffer||par instanceof SharedArrayBuffer))
                        {
                            throw "调用参数类型错误 应为BinObject";
                        }
                        break;
                        case ParsType.Object:
                        //如果是Bin
                        if((par instanceof ArrayBuffer||par instanceof SharedArrayBuffer))
                        {
                            throw "调用参数类型错误 应为普通Object";
                        }
                        break;
                    }
                    if(objfun.HasResult)
                    {
                        return fun(par);
                    }
                    else fun(par);
                }
                catch(e)
                {
                    throw `调用错误:${e}`;
                }
            }
            /**
             * ClientOperate 客户端调用函数
             * 此函数接受一个特定格式的数据（通常此数据为Client类生成)
             * 此函数对数据进行解析后执行相应操作
             * 此函数包含与Client交互的相关操作
             */
            public ClientOperate(data:any) {
                
            }
            /**
             * ClientCall客户端调用函数 真正起作用的函数
             * 此函数解析后执行调用并通过TransPort返回结果
             */
            protected ClientCall(data:any) {
                
            }

        }
    }
}