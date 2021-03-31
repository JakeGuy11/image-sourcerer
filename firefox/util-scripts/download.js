console.log("===========================");
console.log("Starting Download Script...");
console.log("===========================");

browser.runtime.onMessage.addListener(saveImage);

function saveImage(message){
	if(message.intent == "download") {
		browser.downloads.download({
			url: message.target_url,
			filename: message.save_name + message.ext
		});
	}
}