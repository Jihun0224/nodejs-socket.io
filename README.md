# Node.js Socket통신 Socket.IO 사용
## polling vs. long-polling vs. WebSocket
### polling 방식
- 클라이언트가 평범한 http request를 서버로 계속 날려서 이벤트 내용을 전달받는 방식
- 가장 쉬운방법이지만 클라이언트가 계속적으로 request를 날리기때문에 클라이언가 많아지면 서버의 부담이 급증하게 된다. http request connection을 맺고 끊는것 자체가 부담이 많은 방식이다. 그리고 클라이언트에서 실시간정도의 빠른 응답을 기대하기도 어렵다.

### long-polling 방식
- 서버 측에서 접속을 열어두는 시간을 길게하는 방식.
    - 클라이언트에서 서버로 http request를 날린다. 
    - 서버에 응답에 대한 사용 가능한 데이터가 없으면 계속 기다리다가 서버에서 해당 클라이언트로 전달할 이벤트가 있다면 그순간 response 메시지를 전달하면서 연결이 종료된다.
    - 클라이언트에서는 곧바로 다시 http request를 날려서 서버의 다음 이벤트를 기다리게 되는 방식이다.
 - 일반 polling 방식보다는 서버의 부담이 줄겠지만 클라이언트로 보내는 이벤트들의 시간간격이 좁다면 polling 과 별 차이가 없게 되며, 다수의 클라이언트에게 동시에 이벤트가 발생될 경우에는 곧바로 다수의 클라이언트가 서버로 접속을 시도하면서 서버의 부담이 급증하게 된다.
### websocket
- 양방향 채널을 이용해 채팅방 처럼 양방향 통신이 가능하다.
- 기존 http요청 응답 방식은 요청한 그 클라이언트에만 응답이 가능했는데, ws 프로토콜을 통해 웹소켓 포트에 접속해 있는 모든 클라이언트에게 이벤트 방식으로 응답한다
- websocket 프로토콜을 처리하기 위해 전이중 연결과 새로운 웹소켓 서버가 필요하다.
## Socket.IO란
`Socket.IO`란 node.js 기반으로 만들어진 기술로 자체 스팩으로 만들어진 socket.io 서버를 만들고 socket.io 클라이언트와 브라우저에 구애받지 않고 실시간 통신이 가능해진다.  
Socket.IO는 일반적으로 위 모델 중 long-polling 방식을 사용한다.
Web Socket과 달리 Socket.io는 표준 기술이 아니고 Node.js 모듈이다.
## socket.io 사용법
> emit을 통해 신호를 보내고, on을 통해 신호를 받는다.
### BackEnd
```javascript
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); // 해당 서버를 소켓 서버임을 설정

  
  // 클라이언트가 최초 접속 시 보여지는 화면
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });
  
  // 서버 실행
  http.listen(3000, function () {
    console.log('server listening on port : 3000');
  });
  
  // connection을 수립하고, callback 인자로 socket을 받음
  io.on('connection', function (socket) {
  	// 연결이 성공했을 경우 실행됨
  
  	socket.on('disconnect', function () {
      	// 클라이언트의 연결이 끊어졌을 경우 실행됨
     });
 )}
```

### FrontEnd
```javascript
 <script src="/socket.io/socket.io.js"></script>
  <script>
      const socket = io();
      socket.on("서버에서 받을 신호", (데이터) => {
  		// 특정 신호를 받으면 실행할 코드
  	})
      
      socket.emit("서버로 보낼 신호", 데이터);
  </script>
```

# 채팅방 구현
## 결과
<video src='https://user-images.githubusercontent.com/59672592/174079459-e04f044f-5db6-46da-b45e-a826561bc7a6.mp4
' width=450/>


# 참고 자료
- [Dev Scroll:티스토리](https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-Polling-Long-Polling-Server-Sent-Event-WebSocket-%EC%9A%94%EC%95%BD-%EC%A0%95%EB%A6%AC)
- [uoayop.log](https://velog.io/@uoayop/Node.js-Socket.io-%EC%B1%84%ED%8C%85%EB%B0%A9-%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0-1)