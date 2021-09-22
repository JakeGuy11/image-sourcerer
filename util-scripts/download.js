console.log("===========================");
console.log("Starting Download Script...");
console.log("===========================");

chrome.runtime.onMessage.addListener(saveImage);

function saveImage(message){
	if(message.intent == "download") {
	chrome.downloads.download({
			url: message.target_url,
			filename: message.save_name + message.ext,
            saveAs: false
		});
	}
}
