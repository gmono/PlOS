/**
 * Created by gaozijian on 2017/3/31.
 */
//消息核心模块 提供消息注册和广播的功能
//以及消息校验功能
namespace System
{

    //此处采用多级查询方式 数组 从0号元素开始分别表示一个查询 例如 ['System','Event','CreateWindow']
    //就代表System.Event.CreateWindow消息
    //每个消息带有一个对象作为消息参数 类型不限
    export namespace MessageCore
    {
        const ArrayName='Listeners';
        let TypeSet={};
        export  function HasMessageType(tyns:Array<string>):boolean
        {
            let nowobj=TypeSet;
            for(var t of tyns)
            {
                nowobj=nowobj[t];
                if(nowobj!=null)
                {
                    //找到
                    return false;
                }
            }
            return true;
        }
        export function GetMessageListenObject(tyns:Array<string>):Array<(obj:any)=>void>
        {
            let nowobj=TypeSet;
            for(var t of tyns)
            {
                nowobj=nowobj[t];
                if(nowobj==null)
                {
                    //找不到
                    return null;
                }
            }
            return nowobj[ArrayName];
        }
        export function RegistMessageType(tyns:Array<string>):boolean
        {
            if(HasMessageType(tyns)) return false;
            let nowobj=TypeSet;
            //校验
            for(var t of tyns)
            {
                nowobj=TypeSet[t];
                if(nowobj==null)
                {
                    //没有就创建
                    TypeSet[t]={};
                    nowobj=TypeSet[t];
                }
            }
            nowobj[ArrayName]=[]; //创建一个空数组
            //注册完成 最底层对象为空对象 占位表示有此消息类型 其中有个数组 此数组里的每一个成员都是监听器函数
            return true;
        }
        //obj为消息参数
        //在广播消息时由广播者提供
        export function RegistEventListener(tyns:Array<string>,listen:(obj:any)=>void):boolean
        {
            if(HasMessageType(tyns))
            {
                let obj=GetMessageListenObject(tyns);
                obj.push(listen);
                return true;
            }
            else return false;
        }
        export function SendMessage(tyns:Array<string>,obj:any)
        {
            let larr=GetMessageListenObject(tyns);
            for(var tfun of larr)
            {
                //提供obj的副本
                let tempobj=JSON.parse(JSON.stringify(obj));//这样获得一个副本
                tfun(tempobj);
            }
        }

        //辅助函数 装饰器实现
        function ToStrFun(fun:Function)
        {
            return (fullname:string,...args):any=>{
                let arr=fullname.split('.');
                fun(arr,...args);
            };
        }
        let SendMsg=ToStrFun(SendMessage);
        let HasMsgType=ToStrFun(HasMessageType);
        let GetListenerArray=ToStrFun(GetMessageListenObject);
        let Regist=ToStrFun(RegistMessageType);
        let ListenRegist=ToStrFun(RegistEventListener);
    }
}