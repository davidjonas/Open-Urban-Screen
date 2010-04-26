JSBeam = {};
JSBeam.key = 'OpenScreenBeam';
JSBeam.chatRoom = 'OpenScreenChat';

JSBeam.updateChat = function()
{
	var messages = JSBroadcast.get(JSBeam.chatRoom);
	if (messages !== null)
	{
		for(var msg in messages)
		{	
			if($('#chatWindow').html() == "")
			{
				JSBeam.writeChat(messages[msg].msg, false);
			}
			else
			{
				JSBeam.writeChat(messages[msg].msg, true);
			}
		}
	}
};

JSBeam.writeChat = function (msg, newline)
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

JSBeam.updateBeam = function()
{
	var messages = JSBroadcast.get(JSBeam.key);
	if (messages !== null)
	{
		for(var msg in messages)
		{	
			JSBeam.processMessage(messages[msg].msg);
		}
	}
};

JSBeam.beamText = function (msg)
{
	msgText = document.createElement('div');
	jqMsgObj = $(msgText);
	jqMsgObj.text(msg);
	jqMsgObj.addClass('message'); 
	$(document.getElementById('beamWindow')).append(jqMsgObj);
}

JSBeam.beamImage = function (msg)
{
	$(document.getElementById('beamWindow')).append("<div class=\"message\"> <img src=\"" + msg + "\" /></div>");
}

JSBeam.beamYoutube = function (msg)
{
	$(document.getElementById('beamWindow')).append("<div class=\"message\">" + "YouTube Video" + "</div>");
}

JSBeam.processMessage = function (msg)
{
    if(JSBeam.isURL(msg))
	{
		if(JSBeam.isYouTube(msg))
		{
			JSBeam.beamYoutube(msg)
			return true;
		}
		else 
		{
			if(JSBeam.isImage(msg))
			{
				JSBeam.beamImage(msg)
				return true;
			}
			else
			{
				JSBeam.beamText(msg)
				return true;
			}
		}
	}
	else
	{
		JSBeam.beamText(msg)
		return true;
	}
}

JSBeam.isURL = function (msg)
{
	var v = new RegExp();
    v.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
    if (v.test(msg)) 
	{
        return true;
    }
	else
	{
		return false;
	}
}

JSBeam.isYouTube = function (msg)
{
	if(msg.indexOf("http://www.youtube.com/watch?") == 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}

JSBeam.isImage = function (msg)
{
	var ext = msg.substring(msg.length-4, msg.length);
	var jpg = msg.indexOf(".jpg");
	var png = msg.indexOf(".png");
	var gif = msg.indexOf(".gif");

	if(jpg > -1 || png > -1 || gif > -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

JSBroadcast.configure({'domain': 'openscreen'});
JSBroadcast.registerReceiver(JSBeam.key);
//JSBroadcast.registerReceiver(JSBeam.chatRoom);
JSBroadcast.registerFunction("updateBeam", JSBeam.updateBeam);
//JSBroadcast.registerFunction("updateChat", JSBeam.updateChat);
JSBroadcast.run(300);
