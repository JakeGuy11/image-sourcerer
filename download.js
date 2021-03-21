console.log("Starting plugin!");

browser.runtime.onMessage.addListener(saveImage);

function saveImage(message){
	browser.downloads.download({
		url: message.url,
		filename: message.saveName + message.ext
	});
}