const COMMENT_PORT = 6667;
var sockets = new Array();

function onRecieveConnect(recieveEvent) {
  recieveEvent.socket.addEventListener("socketData", function(e) {
    var socket = e.target;
    var message = socket.readUTFBytes(socket.bytesAvailable);
    message = message.replace(/\n/g, "<br/>");
    var user = clients[socket.remoteAddress];
    var node = "<div class=\"message\">"
                + "<p class=\"user\">"+user+"&gt;</p>"
                + "<p class=\"comment\">"+message+"</p>"
                + "</div>";
    $("#comments div.comments").prepend(node);
    socket.writeUTFBytes("ok");
    socket.flush();
    socket.close();
  });
}

function onComment() {
  for (address in clients) {
    var socket = new air.Socket();
    socket.addEventListener("socketData", function() {
      var okng = socket.readUTFBytes(socket.bytesAvailable);
      socket.close();
    });
    socket.connect(address, COMMENT_PORT);
    socket.writeUTFBytes($("textarea[name=comment]").val());
    socket.flush();
  }
  $("textarea[name=comment]").val("");
}
