var loginServer = null;
var recieveServer = null;
var clients = new Object();
const LOGIN_PORT = 6668; 
const COMMENT_PORT = 6667;

$(function() {
  loginServer = new air.ServerSocket();
  loginServer.addEventListener("connect", onLoginConnect);
  loginServer.bind(LOGIN_PORT);
  loginServer.listen();
  recieveServer = new air.ServerSocket();
  recieveServer.addEventListener("connect", onRecieveConnect);
  recieveServer.bind(COMMENT_PORT);
  recieveServer.listen();
  clients["127.0.0.1"] = true;

  $("#send").click(onComment);
  $("textarea[name=comment]").focus(function(){
    $(this).animate({height: "60px"});
  });
  $("input.connect[type=button]").click(onConnectClick);
});

$(window).unload(function() {
  loginServer.close();
  recieveServer.close();
});

function onLoginConnect(loginEvent) {
  var socket = loginEvent.socket;
  loginEvent.socket.addEventListener("socketData", function(e) {
    var address = socket.remoteAddress;
    var userName = socket.readUTFBytes(socket.bytesAvailable);
    if (address == undefined) {
      address = socket.localAddress;
    }
    if (!clientsConnected(address)) {
      clients[address] = userName;
      $("#users").append(createUserNode(address, userName));
    } else {
      clients[address] = userName;
    }
    socket.writeUTFBytes($("#to_user").val());
    socket.flush();
    socket.close();
  });
}

function onRecieveConnect(recieveEvent) {
  var socket = recieveEvent.socket;
  socket.addEventListener("socketData", function(e) {
    var message = socket.readUTFBytes(socket.bytesAvailable);
    var user = clients[socket.remoteAddress];
    var node = "<div class=\"message\">"
                + "<p class=\"user\">"+user+"</p>"
                + "<p class=\"comment\">"+message+"</p>"
                + "</div>";
    $("#comments").append(node);
    socket.close();
  });
}

function onComment() {
  for (address in clients) {
    var socket = new air.Socket();
    socket.connect(address, COMMENT_PORT);
    socket.writeUTFBytes($("textarea[name=comment]").val());
    $("textarea[name=comment]").val("");
    socket.flush();
  }
}

function onConnectClick() {
  var address = $("#to_address").val();
  var socket = new air.Socket();
  socket.addEventListener("socketData", function() {
    var name = socket.readUTFBytes(socket.bytesAvailable);
    address = socket.remoteAddress;
    if (!clientsConnected(address)) {
      $("#users").append(createUserNode(address, name));
    }
    socket.close();
  });
  socket.connect(address, LOGIN_PORT);
  socket.writeUTFBytes($("#to_user").val());
  socket.flush();
}

function createUserNode(address, name) {
  var node = "<div class=\"user\">"
           + "<span class=\"name\">"+name+"</span>:"
           + "<span class=\"address\">"+address+"</span>"
           + "</div>";
  return node;
}

function clientsConnected(address) {
  return clients[address] != undefined;
}
