var server = null;
var clients = new Object();

$(function() {
  server = new air.ServerSocket();
  server.addEventListener("connect", onConnect);
  server.bind(8081);
  server.listen();
  clients["127.0.0.1"] = true;

  $("#send").click(onComment);
});

$(window).unload(function() {
  server.close();
});

function onConnect(e) {
  var socket = e.socket;
  var address = socket.removeAddress;
  if (address == undefined) {
    address = socket.localAddress;
  }
  if (clients[address] == undefined) {
    air.trace("undefined="+address);
    clients[address] = true;
  }

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
    socket.connect(address, 8081);
    socket.writeUTFBytes($("input[name=comment]").val());
    socket.flush();
  }
}
