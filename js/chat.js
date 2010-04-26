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
			if($('#chatWindow').html() == "")
			{
				JSChat.write(messages[msg].msg, false);
			}
			else
			{
				JSChat.write(messages[msg].msg, true);
			}
			JSChat.scrollDown();
		}
	}
};

JSChat.write = function (msg, newline)
{
	var msgText = document.createElement('span');
	var jqMsgObj = $(msgText);
	jqMsgObj.text(msg); 
	
	if(newline)
	{
		var newline = document.createElement('br');
		jqMsgObj.prepend(newline);
	}
	
	$(document.getElementById('chatWindow')).append(jqMsgObj);
}

JSBroadcast.configure({'domain': 'openscreen'});
JSBroadcast.registerReceiver(JSChat.chatRoom);
JSBroadcast.registerFunction("updateChat", JSChat.updateChat);

JSChat.sendMessage = function ()
{	
	var chatMsg = document.getElementById('chatMsg');
	var msg = chatMsg.value;
	if(msg != "")
	{
		JSBroadcast.sendMessage(JSChat.chatRoom, msg);
		//chatMsg.value = "";
		chatMsg.focus();
		if($('#chatWindow').html() == "")
		{
			JSChat.write(msg, false);
		}
		else
		{
			JSChat.write(msg, true);
		}
		
		JSChat.scrollDown();
	}
}

JSBeam = {};
JSBeam.key = 'OpenScreenBeam';

JSBeam.write = function (msg, newline)
{
	var beamingSpan = document.createElement('span');
	var beamObj = $(beamingSpan);
	beamObj.addClass('beamed');
	beamObj.text('[Beaming in 5 secs]:');
	var msgText = document.createElement('span');
	var jqMsgObj = $(msgText);
	jqMsgObj.text(msg); 
	jqMsgObj.prepend(beamObj);
	
	if(newline)
	{
		var newline = document.createElement('br');
		jqMsgObj.prepend(newline);
	}
	
	$(document.getElementById('chatWindow')).append(jqMsgObj);
}

JSBeam.sendMessage = function ()
{	
	var chatMsg = document.getElementById('chatMsg');
	var msg = chatMsg.value;
	if(msg != "")
	{
		JSBroadcast.sendMessage(JSBeam.key, msg);
		chatMsg.value = ""; //TODO TIMER
		chatMsg.focus();

		//if($('#chatWindow').html() == "")
		//{
		//	JSBeam.write(msg, false);
		//}
		//else
		//{
		//	JSBeam.write(msg, true);
		//}
		
		//JSChat.scrollDown();
	}
}


function runChat()
{
	document.getElementById('chatMsg').setAttribute('autocomplete', 'off');
	JSBroadcast.run(300);
}