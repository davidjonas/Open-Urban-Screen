import memcache
import time
from mod_python import Session


def _getMemAccess():
	return memcache.Client(["127.0.0.1:11211"])

def _getSessionId(req):
	sess = Session.Session(req)
	if sess.is_new():
		sess.save()
		return sess.id()
	else:
		return sess.id()
	

def index(req):
	req.content_type = "text/json"
	return "null"
	
def get(req, domain, key):
	req.content_type = "text/json"
	userId = _getSessionId(req)
	builtMetaKey = '%(domain)s_%(key)s_meta' % {'domain': domain, 'key':key}
	cur = 0
	mem = _getMemAccess()
	timestamp = mem.get("user_" + userId)
	if timestamp is None:
		timestamp = _now()
	stackSize = _getMessageStackSize(mem, domain)
	result = []
	newTime = 0

	msg=mem.get('%(key)s%(cur)d' % {'key': builtMetaKey, 'cur': cur})
	while(msg is not None):
		attr = msg.split('&')
		msgUsr = attr[0]
		msgTime = float(attr[1])
		if(msgTime > float(timestamp) and msgUsr != userId):
			msgKey = '%(domain)s_%(key)s_%(timestamp).4f' % {'domain': domain, 'key': key, 'timestamp': msgTime}
			result.append("{\"usr\":\"%s\", \"msg\":\"%s\", \"timestamp\":\"%.4f\"}" % (msgUsr, mem.get(msgKey), msgTime))
		newTime = msgTime
		cur = cur + 1
		msg=mem.get('%(key)s%(cur)d' % {'key': builtMetaKey, 'cur': cur})
	mem.set("user_" + userId, newTime)
	json = "["
	for item in result:
		if json == "[":
			json += item
		else:
			json += ", " + item
	json +=	"]"
	if json == "[]":
		json = "null"
	return json
	
	
def send(req, domain, key, msg):
	mem = _getMemAccess()
	timestamp = _now()
	
	userId = _getSessionId(req)
	newKey = '%(domain)s_%(key)s_%(timestamp).4f' % {'domain': domain, 'key': key, 'timestamp':timestamp}
	mem.set(newKey, msg)

	newMetaValue = '%(uid)s&%(timestamp).4f' %  {'uid': userId, 'timestamp':timestamp}
	id = _newMessageIndex(mem, domain)
	newMetaKey = '%(domain)s_%(key)s_meta%(id)d' % {'domain': domain, 'key': key, 'id':id}
	mem.set(newMetaKey, newMetaValue)
	
	req.content_type = "text/json"
	req.write("%.4f" % timestamp)
	
def store(req, key, value):
	req.content_type = "text/json"
	req.write("success")
	
def retrieve(key):
	req.content_type = "text/json"
	req.write("success")
	
def _now():
	return time.time()
	
def _newMessageIndex(mem, domain):
	messageStackSize = mem.get(domain + '_messageStackSize')
	if messageStackSize is None:
		mem.set(domain + '_messageStackSize', 0)
		return 0
	else:
		if (messageStackSize >= 100):
			mem.flush_all()
			return 0
		else:
			mem.set(domain + '_messageStackSize', messageStackSize+1)
			return messageStackSize+1
	
def _getMessageStackSize(mem, domain):
	return mem.get(domain + '_messageStackSize')
		
