
namespace Protocol
{
    export namespace OPServer
    {
        //对于Both为Object在前 BinObject在后
        //由于BinObject之间可互相转化 因此不做特殊声明处理
        export enum ParsType{
            BinObject,
            Object,
            Both,
            None
        };
        /**
         * 此为IPOP协议中的标准被调用接口的基本类
         * 提供附加属性
         * 例如有无返回值（是否需要等待返回值）
         * 接受什么类型的参数（TransPort会提供三种参数声明方式 BinObject Object 和双选）
         * 由于TransPort仅负责传输数据 对于两个调用参数的接口
         * 需要特殊处理
         */
        export class IPOPFunction
        {
            public Pars:ParsType=ParsType.None;
            public HasResult:boolean=false;
            public Func:Function=null;
            public constructor(fun:Function,partype:ParsType=ParsType.None,result:boolean=false)
            {
                this.Func=fun;
                this.Pars=partype;
                this.HasResult=result;
            }
        }
    }
}