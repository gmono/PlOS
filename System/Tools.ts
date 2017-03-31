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

        //容器类
        //这里自己模拟一个Map和Set类 以免受到智能提示支持不足的影响
        //同时实现一个栈
        export class Stack<T>
        {
            private contain:Array<T>=[];
            ///此函数返回当前栈的item数
            public push(obj:T):number
            {
                this.contain.push(obj);
                return this.contain.length;
            }
            //此函数弹出当前栈的栈顶 如果栈空则返回undefined
            public pop():T
            {
                if(this.contain.length==0) {
                    return undefined;
                }
                let temp=this.front();
                this.contain.length--;
                return temp;
            }
            //返回栈顶引用空返回undefined
            public  front():T
            {
                if(this.contain.length==0) {
                    return undefined;
                }
            }
            public length():number {
                return this.contain.length;
            }
        }
    }
}