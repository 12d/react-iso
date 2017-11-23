export default class CanvasRecorder {
    constructor (speed, quality) {
        this.fps = speed || 30;
        this.quality = quality || 0.8;
        console.log('canvasrecorder')
    }
    compile (outputAsArray, callback) {
        debugger
        // this._recordedStream.stop();
        console.log(this._recordedStream);
    }
    add (canvas, timing) {
        if(!this._canvas){
            this._canvas = canvas;
            this._recordedStream = canvas.captureStream(this.fps);
        }
    }
}