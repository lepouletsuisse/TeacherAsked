var io = require("socket.io-client");

function RealtimeService(){
    var socketio;

    function setup(io){
        socketio = io;
        socketio.on("connection", function(socket){
            socket.emit("msg_welcome");
            socketio.emit("msg_newuser");
            console.log("New user");
        });
    }

    function notifyQuestion(question){
        socketio.emit("msg_message", question);
    }

    function notifyAnswer(answer){
        socketio.emit("msg_answer", answer)
    }

    return {
        setup: setup,
        notifyQuestion: notifyQuestion,
        notifyAnswer: notifyAnswer
    }
}

module.exports = new RealtimeService();