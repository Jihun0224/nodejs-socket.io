const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//Express가 HTML을 templete으로 렌더링하기 위한 설정
var engine = require('consolidate');
app.engine('html', engine.mustache);
app.set('view engine', 'html');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
var userList = [];
var nowNickName = '';

// 클라이언트가 최초 접속 시 보여지는 화면
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.on("join", (data) => {
        nowNickName = data
        userList.push(nowNickName)
        socket.broadcast.emit('join', {
            nickName: nowNickName,
            userList: userList
        })

        socket.emit('welcome', {
            nickName: nowNickName,
            userList: userList
        })
    })
    //메시지 전달
    socket.on('chat message', (data) => {
        console.log(data.nickName + ": " + data.msg);
        io.emit('chat message', {
            nickName: data.nickName,
            msg: data.msg
        });
    });

    //접속종료
    socket.on('disconnect', () => {
        var idx = userList.indexOf(nowNickName)
        userList.splice(idx, 1)
        socket.broadcast.emit('exit', {
            nickName: nowNickName,
            userList: userList
        })
    })
    //채팅 나가기
    socket.on('exit', (data) => {
        var idx = userList.indexOf(data)
        userList.splice(idx, 1)
        socket.broadcast.emit('exit', {
            nickName: data,
            userList: userList
        })
    })
});

//서버실행
server.listen(3000, () => {
    console.log('server listening on port : 3000');
});