/**
 * Created by gaozijian on 2017/3/31.
 */
//启动主程序
var System;
(function (System) {
    var Main;
    (function (Main_1) {
        //系统初始化函数 此函数执行后系统才能正常工作
        function Init() {
        }
        function Main() {
            var guid = System.UIManager.CreateWindow();
            System.UIManager.SetRect(guid, { x: 400, y: 100, h: 300, w: 400 });
            System.UIManager.SetPaintProj(guid, "fillStyle", "#000000");
            System.UIManager.Paint(guid, "fillRect", JSON.stringify([0, 0, 300, 400]));
            var w2 = System.UIManager.CreateWindow();
            System.UIManager.SetRect(w2, { x: 500, y: 0, h: 200, w: 300 });
            System.UIManager.SetPaintProj(w2, "fillStyle", "#ffc0cb");
            System.UIManager.Paint(w2, "fillRect", JSON.stringify([0, 0, 200, 300]));
            System.UIManager.Show(w2);
            System.UIManager.Show(guid);
        }
        Main_1.Main = Main;
    })(Main = System.Main || (System.Main = {}));
})(System || (System = {}));
window.onload = System.Main.Main;
//# sourceMappingURL=Main.js.map