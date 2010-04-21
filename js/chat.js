JSChat = {};
JSChat.chatRoom = 'OpenScreenChat';
JSChat.scrollDown = function()
{
	var objDiv = document.getElementById("chatWindow");
	objDiv.scrollTop = objDiv.scrollHeight;
}

JSChat.updateChat = function()
{
	var messages = JSBroadcast.get(JSChat.chatRoom);
	if (messages !== null)
	{
		for(var msg in messages)
		{	
			$(document.getElementById('chatWindow')).append("<br />" + messages[msg].msg);
			JSChat.scrollDown();
		}
	}
};

JSBroadcast.configure({'domain': 'chat'});
JSBroadcast.registerReceiver(JSChat.chatRoom);
JSBroadcast.registerFunction("updateChat", JSChat.updateChat);

function sendMessage()
{	
	var chatMsg = document.getElementById('chatMsg');
	var msg = chatMsg.value;
	JSBroadcast.sendMessage(JSChat.chatRoom, msg);
	chatMsg.value = "";
	chatMsg.focus();
	$(document.getElementById('chatWindow')).append("<BR />" + msg);
	JSChat.scrollDown();
}

function runChat()
{
	JSBroadcast.run(100);
}