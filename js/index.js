//本程序兼容IE9及IE9+
var indexPage = document.getElementById('indexPage');
var aboutPage = document.getElementById('aboutPage');
var productPage = document.getElementById('productPage');
var customer = document.getElementById('customer');
var contact = document.getElementById('contact');
var navArr = document.getElementById('navName').getElementsByTagName('a')
var pageArr = [indexPage, aboutPage, productPage, customer, contact]
var idx = 0;
//函数节流
var look = false;
var wh = window.innerHeight;
//窗口发生变化时
window.onresize = function() {
    pageHeight(pageArr[idx])
}
pageHeight(pageArr[idx])

//鼠标滚轮
//chrome和IE
window.onmousewheel = mouseWheelHandle;
// 火狐绑定滚轮事件
window.addEventListener("DOMMouseScroll", mouseWheelHandle, true);

function mouseWheelHandle(event) {
    var event = event || window.event;
    if (event.wheelDelta) {
        // 向上滚是正数
        var direction = event.wheelDelta > 0 ? 1 : -1;
    } else {
        var direction = event.detail > 0 ? -1 : 1;
    }
    if (direction == 1) {
        previousPage();
    } else if (direction == -1) {
        nextPage();
    }
};

//nav点击事件
for (let i = 0; i < navArr.length; i++) {
    navArr[i].addEventListener('click', function() {
        var bfidx = idx;
        if (bfidx < i) {
            nextPage(i + 1)
        } else if (bfidx > i) {
            previousPage(i + 1)
        }
    })
}

function previousPage(id) {
    if (idx <= 0 || look) return
    toggleCur()
    if (id) {
        pageArr[id - 1].style.top = -wh + 'px';
        animate(pageArr[idx], { top: wh }, 500);
        animate(pageArr[id - 1], { top: 0 }, 500);
        idx = id - 1;
        navArr[id - 1].className = 'cur';
    } else {
        pageArr[idx - 1].style.height = wh + 'px';
        pageArr[idx - 1].style.top = -wh + 'px';
        animate(pageArr[idx], { top: wh }, 500)
        animate(pageArr[idx - 1], { top: 0 }, 500)
        navArr[idx - 1].className = 'cur';
        idx--
    }

}

function nextPage(id) {
    if (idx >= pageArr.length - 1 || look) return
    toggleCur()
    if (id) {
        pageArr[id - 1].style.top = wh + 'px';
        animate(pageArr[idx], { top: -wh }, 500);
        animate(pageArr[id - 1], { top: 0 }, 500);
        idx = id - 1;
        navArr[id - 1].className = 'cur';
    } else {
        pageArr[idx + 1].style.height = wh + 'px';
        animate(pageArr[idx], { top: -wh }, 500)
        animate(pageArr[idx + 1], { top: 0 }, 500)
        navArr[idx + 1].className = 'cur';
        idx++
    }

}

function toggleCur() {
    look = true;
    for (let i = 0; i < pageArr.length; i++) {
        navArr[i].className = '';
    }
}

function pageHeight(id) {
    wh = window.innerHeight
    pageArr.forEach(function(item) {
        item.style.height = wh + 'px';
    })
    pageArr.forEach(function(item) {
        if (item != id) {
            item.style.top = wh + 'px';
        }
    });
}

//简单运动函数
function animate(obj, jieshuJSON, time) {
    // 必须知道结束位置json，开始json（信号量json），步长json
    // 开始json，所有属性名要与结束json保持一致
    // 定义开始json是个空json，循环遍历结束json，通过相同的属性名，获取对应的初始值
    var kaishiJSON = {};
    for (var k in jieshuJSON) {
        kaishiJSON[k] = parseFloat(getStyle(obj, k));
    }
    // console.log(kaishiJSON);
    // 定义信号量json，初始值等于开始json
    var xinhaoliangJSON = {};
    for (var k in kaishiJSON) {
        xinhaoliangJSON[k] = kaishiJSON[k];
    }
    // 求步长json = （结束json - 开始json） / 总次数
    // 总次数 = 总时间 / 时间间隔
    var interval = 50;
    var zongcishu = time / interval;
    // 次数累加器
    var cishu = 0;
    // 求步长json
    var buchangJSON = {};
    for (var k in jieshuJSON) {
        // 为了保证结束json都是数字类型
        jieshuJSON[k] = parseFloat(jieshuJSON[k]);
        buchangJSON[k] = (jieshuJSON[k] - kaishiJSON[k]) / zongcishu;
    }
    // console.log(xinhaoliangJSON);
    // console.log(buchangJSON);
    // 存储定时器变量timer
    var timer;
    // ==========已知：信号量json，步长json，总次数，次数累加器=========
    timer = setInterval(function() {
        // 信号量json每次递加一个步长json
        for (var k in xinhaoliangJSON) {
            xinhaoliangJSON[k] += buchangJSON[k];
        }
        // 次数累加器累加
        cishu++;
        // 判断运动停止，次数大于等于总次数，拉终停表
        if (cishu >= zongcishu) {
            // 拉到终点
            for (var k in jieshuJSON) {
                xinhaoliangJSON[k] = jieshuJSON[k];
            }
            // 停止定时器
            clearInterval(timer);
            //运动完成后开锁
            look = false;
        }
        // 属性赋值
        // 遍历信号量json，给对应obj元素对象相应的k属性赋值
        for (var k in xinhaoliangJSON) {
            // 看是否是opacity属性，如果是单独书写
            if (k == "opacity") {
                // 透明度要写兼容
                obj.style.opacity = xinhaoliangJSON[k];
                obj.style.filter = "alpha(opacity=" + xinhaoliangJSON[k] * 100 + ")";
            } else {
                // 如果是其他属性要拼接px单位
                obj.style[k] = xinhaoliangJSON[k] + "px";
            }
        }
    }, interval);
}
// 一个计算后样式函数：传入一个元素对象和某个css样式属性名，返回这个对象对应的css属性值。
function getStyle(obj, property) {
    // 能力测试
    if (window.getComputedStyle) {
        // 高版本浏览器
        // 属性名不论是何种格式，都改为横线模型
        property = property.replace(/\-?([A-Z])/g, function(match, $1) {
            return "-" + $1.toLowerCase();
        });
        // 输出计算后样式
        return window.getComputedStyle(obj)[property];
    } else {
        // 低版本浏览器
        // 属性名不论是何种格式，都改为驼峰命名法形式
        property = property.replace(/\-([a-z])/gi, function(match, $1) {
            return $1.toUpperCase();
        });
        // 输出计算后样式
        return obj.currentStyle[property];
    }
}