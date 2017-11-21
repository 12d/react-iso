import WhammyRecorder from './WhammyRecorder';
import ConcatenateBlobs from './ConcatenateBlobs';
export default class Recorder {
    constructor (mediaStream) {
        this.mediaStream = mediaStream;
        this.chunks = [];
        this.createRecorder();

    }
    createRecorder () {
        this.recorder = new WhammyRecorder(this.mediaStream);
        this.recorder.ondataavailable = (data)=>{
            this.chunks.push(data.data)
            this.ondataavailable(data)
        }
        this.recorder.onstop = ()=>{
            this.onstop && this.onstop();
            ConcatenateBlobs(this.chunks, this.chunks[0].type, (rs)=>{
                this.oncomplete && this.oncomplete(rs);
            })

        }
    }
    start (timeSlice) {
        this.recorder.start(timeSlice)
    }
    pause () {
        this.recorder.pause()
    }
    stop () {
        this.recorder.stop()
    }
    resume() {
        this.recorder.resume()
    }


}