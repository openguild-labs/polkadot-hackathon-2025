mergeInto(LibraryManager.library, {
	EngineIOWSCreateInstance: function (instanceName, targetAddress, binaryMsgCallback) {
		var iName = UTF8ToString(instanceName);
		
		if (typeof window.UnityEngineIOWebSockets === 'undefined') {
			console.log('Creating UnityEngineIOWebSockets object');
			window.UnityEngineIOWebSockets = [];
			window.UnityEngineIOBGHelpers = [];
		}
		
		document.addEventListener('visibilitychange', function () {
			if (document.visibilityState == "hidden") {
				window.UnityEngineIOBGHelpers[iName] = setInterval(function() {
					SendMessage(iName, "EngineIOBackgroundHelper");
				}, 500);
			} else {
				clearInterval(window.UnityEngineIOBGHelpers[iName]);
				delete window.UnityEngineIOBGHelpers[iName];
			}
		});
		
		try {
			if (typeof window.UnityEngineIOWebSockets[iName] !== 'undefined' && window.UnityEngineIOWebSockets[iName] != null) {
				console.log("Cleaning up websocket system (on create) for " + iName);
				window.UnityEngineIOWebSockets[iName].close();
				delete window.UnityEngineIOWebSockets[iName];
			}
		} catch(e) {
			console.warning('Exception while cleaning up EngineIOWS ' + iName + ': ' + e);
		}
		
		console.log('Connecting Engine.IO WebSocket: ' + UTF8ToString(targetAddress));
		window.UnityEngineIOWebSockets[iName] = new WebSocket(UTF8ToString(targetAddress));
		window.UnityEngineIOWebSockets[iName].binaryType = "arraybuffer";
		
		window.UnityEngineIOWebSockets[iName].onopen = function (e) {
			SendMessage(iName, 'EngineIOWebSocketState', 2); 
		};
		
		window.UnityEngineIOWebSockets[iName].onerror = function(e) {
			console.log(iName + " WebSocket Error: " , e);
			SendMessage(iName, 'EngineIOWebSocketError', 'WebSocket Error Code provided by browser: ' + e.code);
			SendMessage(iName, 'EngineIOWebSocketState', 6);
		};
		
		window.UnityEngineIOWebSockets[iName].onclose = function(e) {
			console.log(iName + " WebSocket Closed: " , e);
			if (e.wasClean) SendMessage(iName, 'EngineIOWebSocketState', 5); //EIO-State 5 = cloSED
			else {
				SendMessage(iName, 'EngineIOWebSocketError', e.reason);
				SendMessage(iName, 'EngineIOWebSocketUncleanState', 5); //EIO-State 5 = cloSED
			}
			
			//Cleanup
			console.log("Cleaning up websocket system (on close) for " + iName);
			if (typeof window.UnityEngineIOBGHelpers[iName] !== "undefined") {
				clearInterval(window.UnityEngineIOBGHelpers[iName]);
				delete window.UnityEngineIOBGHelpers[iName];
			}
			delete window.UnityEngineIOWebSockets[iName];
		};
		
		window.UnityEngineIOWebSockets[iName].onmessage  = function (e) {
			if (typeof e.data == "string") {
				SendMessage(iName, 'EngineIOWebSocketStringMessage', e.data);
			} else if (e.data instanceof ArrayBuffer) {
				//Form payload
				var dataBuffer = new Uint8Array(e.data);
				var buffer = _malloc(dataBuffer.length);
				HEAPU8.set(dataBuffer, buffer);
				
				//Form instanceName
				var iNameLength = lengthBytesUTF8(iName) + 1;
				var iNameBuf = _malloc(iNameLength);
				stringToUTF8(iName, iNameBuf, iNameLength);
				
				try {
					dynCall('viiii', binaryMsgCallback, [buffer, dataBuffer.length, iNameBuf, iNameLength]);
				} finally {
					_free(buffer);
					_free(iNameBuf);
				}
			} else {
				console.error("Unknown frame received: " + typeof e.data);
			}
		};
	},
	
	EngineIOWSSendString: function (instanceName, message) {
		var iName = UTF8ToString(instanceName);
		if (typeof window.UnityEngineIOWebSockets[iName] === "undefined") {
			SendMessage(iName, 'EngineIOWebSocketError', "Tried to send data to a non-existing connection");
			console.log("Tried to send data (" + UTF8ToString(message) + ") to a non-existing connection");
			return false;
		}
		
		try {
			window.UnityEngineIOWebSockets[iName].send(UTF8ToString(message));
		} catch (err) {
			SendMessage(iName, 'EngineIOWebSocketError', err);
			return false;
		}
		
		return true;
	},
	
	EngineIOWSSendBinary: function (instanceName, message, msgLength) {
		var iName = UTF8ToString(instanceName);
		if (typeof window.UnityEngineIOWebSockets[iName] === "undefined") {
			SendMessage(iName, 'EngineIOWebSocketError', "Tried to send data to a non-existing connection");
			console.log("Tried to send binary data to a non-existing connection");
			return false;
		}
		var arrBuffer = new ArrayBuffer(msgLength);
		var bytes = new Uint8Array(arrBuffer);
		for (var i = 0; i < msgLength; i++)
		{
			bytes[i] = HEAPU8[message + i];
		}
		
		try {
			window.UnityEngineIOWebSockets[iName].send(bytes);
		} catch (err) {
			SendMessage(iName, 'EngineIOWebSocketError', err);
			return false;
		}
		
		return true;
	},
	
	EngineIOWSClose: function (instanceName) {
		var iName = UTF8ToString(instanceName);
		
		if (typeof window.UnityEngineIOWebSockets[iName] !== 'undefined' && window.UnityEngineIOWebSockets[iName] != null && window.UnityEngineIOWebSockets[iName].readyState != 3) { //WS state 3 = closed
				window.UnityEngineIOWebSockets[iName].close();
				SendMessage(iName, 'EngineIOWebSocketState', 3); //Make sure we inform the game in any case - EIO-State 3 = cloSING
		}
	}
});
