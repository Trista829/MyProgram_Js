/**
 * 获取元素id
 * @param {String} id 
 */
function my$(id) {
    return document.getElementById(id);
}

/**
 * 标签中的文本内容
 * @param {*} element 
 * @param {String} text 
 */
// 设置任意标签中间的文本内容
function setInnerText(element, text) {
    if (typeof element.textContent == "undefined") {
        // 不支持
        element.innerText = text;
    } else {
        element.textContent = text;
    }
}
// 获取任意标签中间的文本内容
function getInnerText(element) {
    if (typeof element.textContent == "undefined") {
        // 不支持
        return element.innerText;
    } else {
        return element.textContent;
    }
}

/**
 * 获取节点的兼容代码
 * @param {*} element 
 */
// 第一个节点和第一个元素的获取的代码在IE8中可能不支持
// 获取任意一个父级元素的第一个子级元素
function getFirstElementChild(element) {
    if (element.firstElementChild) {
        // 支持
        return element.firstElementChild;
    } else {
        // ie8
        var node = element.firstChild;
        while (node && node.nodeType != 1) {
            node = node.nextSibling;
        }
        return node;
    }
}
// 最后一个节点和最后一个元素的获取的代码在IE8中可能不支持
//获取任意一个父级元素的最后一个子级元素
function getLastElementChild(element) {
    if (element.lastElementChild) {
        // 支持
        return element.lastElementChild;
    } else {
        var node = element.lastChild;
        while (node && node.nodeType != 1) {
            node = node.previousSibling;
        }
        return node;
    }
}
// 前一个节点和前一个元素的获取的代码在IE8中可能不支持
// 获取任意一个元素的前一个元素
function getPreviousElement(element) {
    if (element.previousElementSibling) {
        return element.previousElementSibling;
    } else {
        var node = element.previousSibling;
        while (node && node.nodeType != 1) {
            node = node.previousSibling;
        }
        return node;
    }
}
// 后一个节点和后一个元素的获取的代码在IE8中可能不支持
// 获取任意一个元素的后一个元素
function getNextElement(element) {
    if (element.nextElementSibling) {
        return element.nextElementSibling;
    } else {
        var node = element.nextSibling;
        while (node && node.nodeType != 1) {
            node = node.nextSibling;
        }
        return node;
    }
}

/**
 * 绑定事件和解绑事件的兼容代码
 * @param {*} element 
 * @param {*} type 
 * @param {Function} fn 
 */
//为任意元素.绑定任意的事件, 任意的元素,事件的类型,事件处理函数
function addEventListener(element, type, fn) {
    //判断浏览器是否支持这个方法
    if (element.addEventListener) {
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, fn);
    } else {
        element["on" + type] = fn;
    }
}
// 为任意的一个元素，解绑对应的事件
function removeEventListener(element, type, fnName) {
    //判断浏览器是否支持这个方法
    if (element.removeEventListener) {
        element.removeEventListener(type, fnName, false);
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, fnName);
    } else {
        element["on" + type] = null;
    }
}



/**
 * 卷曲事件的函数
 * getScroll.left
 * getScroll.top
 */
function getScroll() {
    return {
        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    };
}

/**
 * 封装动画函数,元素、目标位置===>匀速动画
 * @param {*} element 
 * @param {Number} target 
 */
function uniformAnimate(element, target) {
    clearInterval(element.timeId)
    element.timeId = setInterval(function () {
        // 获取当前div的位置
        var current = element.offsetLeft;
        // 每次移动的步数
        var step = 10;
        step = current < target ? step : -step;
        // 每次移动后的距离
        current += step;
        // 判断当前移动后的位置是否到达目标位置
        if (Math.abs(target - current) > Math.abs(step)) {
            element.style.left = current + "px";
        } else {
            clearInterval(element.timeId);
            element.style.left = target + "px";
        }
    }, 20);
}


/**
 * 变速动画
 * @param {*} element 
 * @param {*} target 
 */
function shiftingAnimate(element, target) {
    clearInterval(element.timeId)
    element.timeId = setInterval(function () {
        // 获取当前div的位置
        var current = element.offsetLeft;
        // 每次移动的步数
        var step = (target - current) / 10;
        step = (step > 0) ? Math.ceil(step) : Math.floor(step);
        // 每次移动后的距离
        current += step;
        element.style.left = current + "px";
        if (current == target) {
            clearInterval(element.timeId);
        }
    }, 20);
}

/**
 * 获取任意一个元素的任意一个样式属性的值
 * @param {*} element 
 * @param {*} attr 
 */
function getStyle(element, attr) {
    return window.getComputedStyle ? window.getComputedStyle(element, attr)[attr] : element.currentStyle[attr];
}

/**
 * 任意多个属性
 * element --- 元素
 * json --- 对象：多个属性及多个目标
 * 
 * */
function multipleAnimate(element, json) {
    clearInterval(element.timeId);
    element.timeId = setInterval(function () {
        // 默认，假设全部到达目标
        var flag = true;
        // 遍历json对象中每个元素
        for (var attr in json) {
            // 获取当前div的位置
            var current = parseInt(getStyle(element, attr));
            // 当前属性对应的目标值
            var target = json[attr];
            // 每次移动的步数
            var step = (target - current) / 10;
            step = (step > 0) ? Math.ceil(step) : Math.floor(step);
            // 每次移动后的距离
            current += step;
            element.style[attr] = current + "px";
            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timeId);
        }
    }, 20);
}

// 增加回调函数
function reMultipleAnimate(element, json, fn) {
    clearInterval(element.timeId);
    element.timeId = setInterval(function () {
        var flag = true;
        for (var attr in json) {
            var current = parseInt(getStyle(element, attr));
            var target = json[attr];
            var step = (target - current) / 10;
            step = (step > 0) ? Math.ceil(step) : Math.floor(step);
            current += step;
            element.style[attr] = current + "px";
            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timeId);
            // 所有属性到达目标后调用函数
            fn();
        }
    }, 20);
}


// 增加回调函数,层级和透明度----最终版！！
function animate(element, json, fn) {
    clearInterval(element.timeId);
    element.timeId = setInterval(function () {
        var flag = true;
        for (var attr in json) {
            // 判断属性是不是opacity
            if (attr == "opacity") {
                //获取元素的当前的透明度,当前的透明度放大100倍
                var current = getStyle(element, attr) * 100;
                //目标的透明度放大100倍
                var target = json[attr] * 100;
                var step = (target - current) / 10;
                step = (step > 0) ? Math.ceil(step) : Math.floor(step);
                current += step;
                element.style[attr] = current / 100;
            } else if (attr == "zIndex") {
                // 判断属性是不是zIndex
                element.style[attr] = json[attr];
            } else {
                var current = parseInt(getStyle(element, attr));
                var target = json[attr];
                var step = (target - current) / 10;
                step = (step > 0) ? Math.ceil(step) : Math.floor(step);
                current += step;
                element.style[attr] = current + "px";
            }

            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timeId);
            // 所有属性到达目标后调用函数
            if (fn) {
                fn();
            }
        }
    }, 20);
}