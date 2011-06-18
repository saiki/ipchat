var loginServer = null;
var recieveServer = null;
var clients = new Object();

$(function() {
  loginServer = new air.ServerSocket();
  loginServer.addEventListener("connect", onLoginConnect);
  loginServer.bind(6666);
  loginServer.listen();
  recieveServer = new air.ServerSocket();
  recieveServer.addEventListener("connect", onRecieveConnect);
  recieveServer.bind(6667);
  recieveServer.listen();
  clients["127.0.0.1"] = true;

  $("#send").click(onComment);
});

$(window).unload(function() {
  loginServer.close();
  recieveServer.close();
});

function onLoginConnect(loginEvent) {
  var socket = loginEvent.socket;
  loginEvent.socket.addEventListener("socketData", function(e) {
    var address = socket.removeAddress;
    var userName = socket.readUTFBytes(socket.bytesAvailable);
    if (address == undefined) {
      address = socket.localAddress;
    }
    if (clients[address] == undefined) {
      clients[address] = userName;
    }
    socket.close();
  });
}

function onRecieveConnect(recieveEvent) {
  var socket = recieveEvent.socket;
  socket.addEventListener("socketData", function(e) {
    var message = socket.readUTFBytes(socket.bytesAvailable);
    if (message != "") {
      $("#comments").append("<p>"+message+"</p>");
    }
    socket.close();
  });
}

function onComment() {
  for (address in clients) {
    var socket = new air.Socket();
    socket.connect(address, 6667);
    socket.writeUTFBytes($("input[name=comment]").val());
    socket.flush();
  }
}
