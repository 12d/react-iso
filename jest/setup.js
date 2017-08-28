/**
 * @author xuweichen@meitu.io
 * @date 2017/8/24
 */
global.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};