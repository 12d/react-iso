import Whammy from './WhammyNew';
const states = {
    INACTIVE: 'inactive',
    RECORDING: 'recording',
    PAUSED: 'paused'
};
class MediaRecorder {
    constructor (stream, options, videoStage) {
        console.log(stream, 'stream', options)
        this.init(options);
        this.videoStage = videoStage;

        this.mimeType = this.options.mimeType;
        this.stream = stream;
        this._prepareRecorder();
    }
    _prepareRecorder () {
        var stream = this.stream;
        this._video = this.videoStage ? this.videoStage : document.createElement('video');
        this._canvas = document.createElement('canvas');
        this._canvas.width= this._video.width;
        this._canvas.height= this._video.height;
        this._canvasContext = this._canvas.getContext('2d');
        this._recorder = new Whammy.Video();
    }
    init (options) {
       this.option = Object.assign({}, this.options, options);
    }
    /**
     * media stream , used for recording
     * @type {MediaStream}
     */
    stream = null
    /**
     * state for media recorder
     * @type {string}
     */
    state = states.INACTIVE
    /**
     * settings for recorder
     * @type {{mimeType: string, bitsPerSecond: number, audioBitsPerSecond: number, videoBitsPerSecond: number}}
     */
    options = {
        /**
         * mimeType for media
         * @type {string}
         */
        mimeType: 'video/webm;codecs="vp9,vp8"',
        bitsPerSecond: 128,
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000
    }
    isTypeSupported () {

    }
    pause () {
        this.state = states.PAUSED;
    }
    requestData () {

    }
    resume () {
        this.state = states.RECORDING;
    }
    start () {

        this.state = states.RECORDING;
        this._reset();
        // this._video.src=URL.createObjectURL(this.stream);
        // this._video.addEventListener('loadedmetadata', ()=>{
        //     this._video.play();
        //     this._recordVideoFrame();
        //     this._reconciler = setInterval(this._recordVideoFrame.bind(this), this.options.duration);
        // });
        this._timing = (+new Date);
        this._recordVideoFrame();

        this._reconciler = setInterval(this._recordVideoFrame.bind(this), 1000/30);
        this.onstart()
    }
    stop () {
        clearInterval(this._reconciler);
        this.state = states.INACTIVE;
        var startTime = + new Date;
        this._recorder.compile(false, (webm)=>{
            this.ondataavailable({data:webm});
        });
        this.onstop();
    }
    _recordVideoFrame (timing) {
        let video = this._video;

        this._canvasContext.drawImage(video, 0,0, video.width, video.height);
        this._recorder.add(this._canvas, this._timing);
        this._timing = (+new Date);
    }
    _reset () {
        this._chunks = [];
    }

    ondataavailable () {

    }
    onerror () {

    }
    onpause () {

    }
    onresume () {

    }
    onstart () {

    }
    onstop () {

    }
}
export default MediaRecorder