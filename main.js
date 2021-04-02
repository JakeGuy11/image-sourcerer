console.log("[main.js]: =======================");
console.log("[main.js]: Starting Main Script...");
console.log("[main.js]: =======================");

chrome.extension.onRequest.addListener(messageRecieved);

function messageRecieved(recMsg) {
	try{
		switch (recMsg.intent) {
			case "relay":
				console.log("[" + recMsg.sender + "]: " + recMsg.content);
				break;
			case "queue_download":
				console.log("[" + recMsg.sender + "]: Downloading \"" + recMsg.target_url + "\" as ~/Downloads/" + recMsg.save_name + recMsg.ext);
				notifySignal({ "intent": "download", "target_url": recMsg.target_url, "save_name": recMsg.save_name, "ext": recMsg.ext });
				break;
			case "download":
				break;
			case "undefined_intent":
				console.log("[" + recMsg.sender + "][Intent not specified]: " + recMsg.content);
				break;
			case "log":
				try {
					var userLog = "default";
					chrome.storage.local.get(['log'], (result) => {
						console.log("Inside handler, got: ");
						console.log(result.log);
						userLog = result.log;
					});
					sleep(5000);
					console.log("Pulled User Log: ");
					console.log(userLog);
					if(userLog == null){
						var elementToAdd = {
							'name': recMsg.save_name,
							'site': recMsg.pageLink
						};
						userLog = [ elementToAdd ];
					} else {
						var elementToAdd = {
							'name': recMsg.save_name,
							'site': recMsg.pageLink
						};
						console.log("Pushing: ");
						console.log(elementToAdd);
						userLog.push(elementToAdd);
					}
					console.log("Added Element. Total Log: ");
					console.log(userLog);
					chrome.storage.local.set({'log': userLog}, () => {
						console.log("done saving");
					});
					sleep(500);
				} catch (err) {
					console.log(err);
				}
				break;
			case "download_log": 
				try {
					chrome.storage.local.get(['log'], function(result) {
					  userLog = result.log;
					});
					console.log("Starting String: " + JSON.stringify(userLog));
					//var logBlob = new Blob([{ "log": JSON.stringify(userLog) }], {type: "text/plain"});
					var logBlob = new Blob([JSON.stringify(userLog)], {type: "text/plain"});
					var blobUrl = URL.createObjectURL(logBlob);
					notifySignal({ "intent": "download", "target_url": blobUrl, "save_name": "userLog", "ext": ".txt" });
				} catch (err) {
					console.log(err);
				}
				break;
			default:
				console.log("[main.js]: Untagged message recieved:");
				console.log(recMsg);
		}
	} catch (overallerr) {
		console.log(overallerr);
	}
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "reddit.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
