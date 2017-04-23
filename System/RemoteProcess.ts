namespace System
{
    /**
     * 远程过程调用模块
     * 处理远程调用 关联到顶层容器
     */
    export namespace RemoteProcess
    {
        export type SendFunc=(ret:RemoteReturn)=>void;
        export interface RemoteCallInfo
        {
            name:string;
            sign:string;
            params:any[];
        }
        export interface RemoteReturn
        {
            sign:string;
            data:any;
        }
        let Container:any={};
        /**
         * 注册一个顶层容器
         * @param name 顶层容器名
         * @param obj 顶层容器
         */
        export function RegistContainer(name:string,obj:any)
        {
            if(!(name in Container))
            {
                Container[name]=obj;
                return true;
            }
            return false;
        }
        /**
         * 通过一个通用的调用信息对象来调用方法
         * 此为异步方法 不返回值 
         * @param info 调用信息对象
         * @param msgfunc 调用结束后的回调方法 用于传回返回值
         */
        export async function Call(info:RemoteCallInfo,msgfunc:SendFunc)
        {
            let paths=info.name.split('.');
            let now=Container;
            let old=null;
            for(let t of paths)
            {
                old=now;
                now=now[t];
                if(now==null) throw new Error("远程函数调用错误！路径不存在");
            }
            //now为function对象
            if(typeof now !="function")
            {
                throw new Error("远程函数调用错误！目标不是函数");
            }
            //是function
            let ret=(<Function>now).apply(old,info.params);
            //回送返回值
            msgfunc(<RemoteReturn>{sign:info.sign,data:ret});
        }

    }
}