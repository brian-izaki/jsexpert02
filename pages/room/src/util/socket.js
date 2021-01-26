// construir objtos sob demanda
class SocketBuilder {
  constructor({ socketUrl }) {
    this.socketUrl = socketUrl;
    this.onUserConnected = () => {};
    this.onUserDisconnected = () => {};
  }

  setOnUserConnected(fn) {
    this.onUserConnected = fn;
    return this;
  }

  setOnUserDisconnected(fn) {
    this.onUserDisconnected = fn;
    return this;
  }

  // é que realiza as instancias setadas (ele é utilizado para concluir a "montagem das instancias")
  build() {
    // já foi importado na pasta deps
    const socket = io.connect(this.socketUrl, {
      withCredentials: false,
    });

    socket.on("user-connected", this.onUserConnected);
    socket.on("user-disconnected", this.onUserDisconnected);

    return socket;
  }
}
