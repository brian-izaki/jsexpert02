# Projeto base da JS Expert Week 2.0

- Acesse o [home](./pages/home/index.html) para acessar a home page
- Acesse o [room](./page/room/index.html) uma room específica

## Home Page

![home page](./prints/home.png)

## Room

![room](./prints/room.png)

---

# Anotações

## aula 01
- visto: 
  - **websocket** foi configurado para realizar o processo de signaling, gerenciar o estado de sessão.
- utilizado:
  - socket.io
  - padrão de projeto: *Builder*, *business* e *view*
- desenvolvido:
  - componente HTML que gera a tag video para mostar os usuários no *view.js*
  - criado um server para operar o socket.io.
  - na public foi criado um *builder* para criar a conexão com o socket, assim permitindo verificar quem se juntou à sala ou que se disconectou da sala.
  - um controlador (*Business*) que gerencia as lógicas do socket, criar video captando a camera

## aula 02
- visto:
  - **WebRTC**: projeto open source para comunicação p2p, realiza acesso aos recursos de vídeo e audio
  - **signaling**: processo de coordenação da comunicação (exemplo: numero de telefone), ele vai ser o responsável por saber o que os usuários estão fazendo na plataforma.
  - **Interactive Connectivity Establishment (ICE)**: técnica de redes de computadores utilizado para encontrar a maneira mais efetiva de estabelecer comunicação entre clientes na rede p2p. (ajuda a diminuir a complexidade entre as redes: políticas internas da empresa). ICE utiliza o endereço de conexão do host, caso não consiga acessar ele utiliza o endereço público que é obtido através do STUN server.
  - **Session Traversal Utilities for Network Address Translator (STUN)**: descobrir o endereço público necessário para a conexão entre os usuários (para manter o usuário conectado).
  - **Traversal Using Relay for Network Address Translator (TURN)**: garantir o tráfego de mensagens e streams como contingência (caso a conexão direta falhar)... é um STUN "turbinado"
  - STUN e TURN são contingências, para os casos dos usuários tiverem problemas de conexão (neste projeto não será implementado)
- utilizado:
  - PeerJS (abstração para comunicação p2p)
- desenvolvido: 
  - a comunicação p2p de mais de um usuário pela câmera.

---

### Créditos

- Layout da home foi baseada no codepen do [Nelson Adonis Hernandez
](https://codepen.io/nelsonher019/pen/eYZBqOm)
- Layout da room foi adaptado a partir do repo do canal [CleverProgrammers](https://github.com/CleverProgrammers/nodejs-zoom-clone/blob/master/views/room.ejs)