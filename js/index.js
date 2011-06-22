var loginServer = null;
var recieveServer = null;
var clients = new Object();

$(function() {
  loginServer = new air.ServerSocket();
  loginServer.addEventListener("connect", onLoginConnect);
  loginServer.bind(LOGIN_PORT);
  loginServer.listen();
  recieveServer = new air.ServerSocket();
  recieveServer.addEventListener("connect", onRecieveConnect);
  recieveServer.bind(COMMENT_PORT);
  recieveServer.listen();
  clients["127.0.0.1"] = "127.0.0.1";

  $("#send").click(onComment);
  $("textarea[name=comment]").focus(function(){
    $(this).animate({height: "60px"});
  });
  $("input.connect[type=button]").click(onConnectClick);
  $("#to_user").val("127.0.0.1");
  $("#to_user").focusout(function() {
    clients["127.0.0.1"] = $(this).val();
  });
  $(window).unload(function() {
    loginServer.close();
    recieveServer.close();
  });
});

