// intersecção entre a lógica do video e a tela
class Business {
  constructor({ room, media, view, socketBuilder, peerBuilder }) {
    this.room = room;
    this.media = media;
    this.view = view;
    this.socketBuilder = socketBuilder;
    this.peerBuilder = peerBuilder;

    this.currentStream = {};
    this.socket = {};
    this.currentPeer = {};

    this.peers = new Map();
    this.userRecordings = new Map()
  }

  // quem chamar a business vai chamar pelo método estático
  static initialize(deps) {
    const instance = new Business(deps);
    return instance._init();
  }

  // classe para inicializar as dependencias
  async _init() {
    this.view.configureRecorderButton(this.onRecorderPressed.bind(this))

    this.currentStream = await this.media.getCamera(true);
    this.socket = this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build();

    this.currentPeer = await this.peerBuilder
      .setOnError(this.onError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onPeerCallReceived())
      .setOnPeerStreamReceived(this.onPeerStreamReceived())
      .setOnCallError(this.onPeerCallError())
      .setOnCallClose(this.onPeerCallClose())
      .build();

    this.addVideoStream(this.currentPeer.id);
  }

  addVideoStream(userId, stream = this.currentStream) {
    const recorderInstance = new Recorder(userId, stream)
    this.userRecordings.set(recorderInstance.fileName, recorderInstance)
    if(this.recordingEnabled) {
      recorderInstance.startRecording()
    }

    const isCurrentId = false;
    this.view.renderVideo({
      userId,
      stream,
      isCurrentId,
    });
  }

  onUserConnected() {
    return (userId) => {
      console.log("user connected", userId);
      this.currentPeer.call(userId, this.currentStream);
    };
  }

  onUserDisconnected() {
    return (userId) => {
      console.log("user disconnected", userId);

      // no Map tem essa função
      if(this.peers.has(userId)){
        this.peers.get(userId).call.close();
        this.peers.delete(userId)
      }

      this.view.setParticipants(this.peers.size);
      this.view.removeVideoElement(userId)
    };
  }

  onError() {
    return (error) => {
      console.log("error on peer", error);
    };
  }

  onPeerConnectionOpened() {
    return (peer) => {
      const id = peer.id;
      console.log("peer", peer);
      this.socket.emit("join-room", this.room, id);
    };
  }

  onPeerCallReceived() {
    return (call) => {
      console.log("answering call", call);
      call.answer(this.currentStream);
    };
  }

  onPeerStreamReceived() {
    return (call, stream) => {
      const callerId = call.peer;
      console.log("Strean teste", this.peers);
      this.addVideoStream(callerId, stream);

      this.peers.set(callerId, { call });

      this.view.setParticipants(this.peers.size);
    };
  }

  onPeerCallError() {
    return (call, error) => {
      console.log("a call error ocurred", error);
      this.view.removeVideoElement(call.peer)
      
    };
  }

  onPeerCallClose(){
    return (call) => {
      console.log('call closed', call.peer)
    }
  }

  onRecorderPressed (recordingEnabled){
    this.recordingEnabled = recordingEnabled
    console.log('pressionado', recordingEnabled)
    for( const [key, value] of this.userRecordings) {
      if(this.recordingEnabled) {
        value.startRecording()
        continue;
      }
      this.stopRecording(key)
    }
  }

  // se o usuário entrar e sair, vai parar as gravações
  async stopRecording(userId) {
    const usersRecordings = this.userRecordings;
    for (const [key, value] of usersRecordings){
      const isContextUser = key.includes(userId)
      if(!isContextUser) continue;

      const rec = value;
      const isRecordingActive = rec.recordingActive;
      if(!isRecordingActive) continue;

      await rec.stopRecording()
    }

  }
}
