export default class MediaStream {
    constructor (video, fps) {
        this.source = video;
        this.height = video.height;
        this.width = video.width;
        this.fps = fps || 60;
    }
}