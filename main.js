console.log("=======================");
console.log("Starting Main Script...");
console.log("=======================");

browser.runtime.onMessage.addListener(saveImage);

function saveImage() {
	console.log("Yo");
}

console.log("Finished adding [main.js] listener");