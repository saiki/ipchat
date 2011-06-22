const COMMENT_PORT = 6667;
var sockets = new Object();

function onRecieveConnect(recieveEvent) {
  var socket = recieveEvent.socket;
  air.Introspector.Console.log("recieve connect");
  socket.addEventListener("socketData", function(e) {
    air.Introspector.Console.log("recieve socketData");
    var message = socket.readUTFBytes(socket.bytesAvailable);
    air.Introspector.Console.log("recieve read");
    message = message.replace(/\n/g, "<br/>");
    var user = clients[socket.remoteAddress];
    var node = "<div class=\"message\">"
                + "<p class=\"user\">"+user+"&gt;</p>"
                + "<p class=\"comment\">"+message+"</p>"
                + "</div>";
    $("#comments div.comments").prepend(node);
    air.Introspector.Console.log("recieve write");
    socket.writeUTFBytes("ok");
    socket.flush();
    air.Introspector.Console.log("recieve flush");
  });
}


function onComment() {
  for (address in clients) {
    sockets[address] = new air.Socket();
    sockets[address].addEventListener("socketData", function() {
      air.Introspector.Console.log("socketData");
      var okng = sockets[address].readUTFBytes(sockets[address].bytesAvailable);
      if (okng != "ok") {
        alert(okng);
      }
      sockets[address].close();
      sockets[address] = null;
    });
    sockets[address].connect(address, COMMENT_PORT);
    air.Introspector.Console.log("connect:" + address);
    sockets[address].writeUTFBytes($("textarea[name=comment]").val());
    air.Introspector.Console.log("write");
    sockets[address].flush();
    air.Introspector.Console.log("flush");
    $("textarea[name=comment]").val("");
  }
}
