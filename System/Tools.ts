/**
 * Created by gaozijian on 2017/3/31.
 */
//通用工具函数库
namespace System
{
    export namespace Tools
    {
        export function Guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
        //简单的将一个对象方法转换为一个静态方法
        export function ToStaticFunction(func:Function,obj:object)
        {
            return (...args)=>{
                func.apply(obj,args);
            }
        }
        //将一个对象的某个方法“对接”到另一个对象的另一方法上
        //注意这和方法赋值是不同的 后者会改变this默认值
        export function AdaptFunction(rfname:string,rawobj:object,afname:string,adaptobj:object)
        {
            
            adaptobj[afname]=function(...args){
                //这里处理如果外部调用call或者apply时的情况
                if(this!=adaptobj)
                {
                    rawobj[rfname].apply(this,args);
                }
                else rawobj[rfname](...args);
            }
        }
        export function AdaptProp(rfname:string,rawobj:object,afname:string,adaptobj:object)
        {
            Object.defineProperty(adaptobj,afname,
                                                    {get:()=>{return rawobj[rfname];},
                                                    set:(v)=>{rawobj[rfname]=v;}})
        }
        //对接两个对象的同名方法
        export function AdaptOneFunc(name:string,robj:object,aobj:object)
        {
            AdaptFunction(name,robj,name,aobj);
        }
        export function AdaptOneProp(name:string,robj:object,aobj:object)
        {
            AdaptProp(name,robj,name,aobj);
        }
        
        
        //嫁接所有方法和属性
        export function AdaptAll(robj:any,aobj:any,except:Set<string>)
        {
            for(let t in robj)
            {
                //跳过排除的
                if(except.has(t)) continue;
                if(typeof robj[t] =="function")
                {
                    AdaptOneFunc(t,robj,aobj);
                }
                else
                {
                    AdaptOneProp(t,robj,aobj);
                }
            }
        }
        //桥接多个
        export function AdaptMore(robj:any,aobj:any,adapts:Set<string>)
        {
            for(let t in robj)
            {
                //跳过不桥接的
                if(!adapts.has(t)) continue;
                if(typeof robj[t] =="function")
                {
                    AdaptOneFunc(t,robj,aobj);
                }
                else
                {
                    AdaptOneProp(t,robj,aobj);
                }
            }
        }
        //以下为工具类区域

        /**
         * 此类为事件集线器
         * 通过此类的成员ListenerList添加监听器
         */
        export class EventHub<T extends Function>
        {
            public ListenerList:Array<T>=[];
            public Call(...args):void
            {
                this.ListenerList.forEach((item)=>{
                    try
                    {
                        item.apply(null,args);
                    }
                    catch(e)
                    {
                        console.log("eventfunc error!",e);
                    }
                });
            }
        }
    }
}