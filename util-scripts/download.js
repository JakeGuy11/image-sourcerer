console.log("===========================");
console.log("Starting Download Script...");
console.log("===========================");

browser.runtime.onMessage.addListener(saveImage);

function saveImage(message){
	browser.downloads.download({
		url: message.url,
		filename: message.saveName + message.ext
	});
}