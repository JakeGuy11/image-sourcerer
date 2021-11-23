console.log("========================");
console.log("Starting Relay Script...");
console.log("========================");

chrome.runtime.onMessage.addListener(messageRecived);

function messageRecieved(msg) {
    try {
    // Do nothing if they don't want us to
    if (!msg.hasOwnProperty('site_meta')) return;
    if (!msg.site_meta) return;

    // Check what they want
    switch (msg.intent) {
        case 'toggle_init':
            // toggle [site]_init, handle undefined
            break;
        case 'toggle_enabled':
            // toggle [site]_enabled, handle undefined
            break;
        default:
            // Do nothing
            break;
    }
    } catch (e) {
        console.log(e);
    }
}
