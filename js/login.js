const LOGIN_PORT = 6668; 

function onLoginConnect(loginEvent) {
  var socket = loginEvent.socket;
  socket.addEventListener("socketData", function(e) {
    var address = socket.remoteAddress;
    var userName = socket.readUTFBytes(socket.bytesAvailable);
    if (address == undefined) {
      address = socket.localAddress;
    }
    if (!connected(address)) {
      $("#users").append(createUserNode(address, userName));
    }
    clients[address] = userName;
    socket.writeUTFBytes($("#to_user").val());
    socket.flush();
    socket.close();
  });
}

function onConnectClick() {
  var address = $("#to_address").val();
  var socket = new air.Socket();
  socket.addEventListener("socketData", function() {
    var name = socket.readUTFBytes(socket.bytesAvailable);
    address = socket.remoteAddress;
    if (!connected(address)) {
      $("#users").append(createUserNode(address, name));
    }
    clients[address] = name;
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

function connected(address) {
  return clients[address] != undefined;
}
