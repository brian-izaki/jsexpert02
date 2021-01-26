// intersecção entre a lógica do video e a tela
class Business {
  constructor({ room, media, view, socketBuilder }) {
    this.room = room;
    this.media = media;
    this.view = view;
    this.socketBuilder = socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build();

    this.socketBuilder.emit("join-room", this.room, "teste01");
    this.currentStream = {};
  }

  // quem chamar a business vai chamar pelo método estático
  static initialize(deps) {
    const instance = new Business(deps);
    return instance._init();
  }
  // classe para inicializar as dependencias
  async _init() {
    this.currentStream = await this.media.getCamera();
    this.addVideoStream("test01");
  }

  addVideoStream(userId, stream = this.currentStream) {
    const isCurrentId = false;
    this.view.renderVideo({
      userId,
      stream,
      isCurrentId,
    });
  }

  onUserConnected = function () {
    return (userId) => {
      console.log("user connected", userId);
    };
  };

  onUserDisconnected = function () {
    return (userId) => {
      console.log("user disconnected", userId);
    };
  };
}
