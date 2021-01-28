class Recorder{
  constructor (userName, stream){
    this.userName = userName;
    this.stream = stream;

    this.fileName = `id:${userName}-when:${Date.now()}`
    this.videoType = 'video/webm'

    this.mediaRecorder = {} // cada usuário terá um mediaRecorder
    this.recorderBlobs = [] // binarios dos videos
    this.completeRecordings = [] // todas as gravações do usuário que foi parado e continuado
    this.recordingsActive = false
  }

  _setup(){
    const commonCodecs = [
      "codecs=vp9,opus",
      "codecs=vp8,opus",
      ""
    ]

    const options = commonCodecs  
      .map(codec => ({ mimeType: `${this.videoType};${codec}`}))
      .find(options => MediaRecorder.isTypeSupported(options.mimeType))

    if(!options){
      throw new Error(`none of the codecs ${commonCodecs.join('.')} are supported`)
    }

    return options;
  }

  startRecording() {
    const options = this._setup()
    // se a camera estiver inativa ele ignora
    if(!this.stream.active) return;

    this.mediaRecorder = new MediaRecorder(this.stream, options)
    console.log(`Created MediaRecorder ${this.mediaRecorder} with options ${options}`)

    this.mediaRecorder.onstop = (event) => {
      console.log("Recorded Blobs", this.recorderBlobs)
    }

    this.mediaRecorder.ondataavailable = (event) => {
      // caso não tenha dados de gravação
      console.log(event)
      if(!event.data || !event.data.size) return;

      // caso tenha dados de gravação no blob, ele armazena no array
      this.recorderBlobs.push(event.data);
    }

    this.mediaRecorder.start()
    console.log(`media Recorded started`, this.mediaRecorder)
    this.recordingsActive = true
  }

  async stopRecording() {
    if(!this.recordingActive) return;

    if(this.mediaRecorder.state === 'inactive') return;

    console.log("media recorded stopped", this.userName)
    this.mediaRecorder.stop()

    this.recordingActive = false;
    await Util.sleep(200)

    this.completeRecordings.push([...this.recorderBlobs])
    this.recorderBlobs = []
  }
}