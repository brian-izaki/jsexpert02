const recordClick = function (recorderBtn) {
  this.recordingEnabled = false;
  return () => {
    this.recordingEnabled = !this.recordingEnabled;
    recorderBtn.style.color = this.recordingEnabled ? "red" : "white";
  };
};

const onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const room = urlParams.get("room");
  console.log("this is the room", room);

  // const recorderBtn = document.getElementById('record')
  // recorderBtn.addEventListener('click', recordClick(recorderBtn))

  const socketUrl = "http://localhost:3000";
  const socketBuilder = new SocketBuilder({ socketUrl });

  // peerConfig apenas recebe os valores, as chaves dos valores não (ajuda a deixar mais semântico)
  const  peerConfig = Object.values({
    id: undefined,
    config: {
      port: 9000,
      host: 'localhost',
      path: '/'
    }
  })
  const peerBuilder = new PeerBuilder({ peerConfig })

  const view = new View();
  const media = new Media(); // utiliza o mediaDevices
  const deps = {
    view,
    media,
    room,
    socketBuilder,
    peerBuilder
  };
  // não precisa passar new pois initialize já faz isso
  Business.initialize(deps);
};

window.onload = onload;
