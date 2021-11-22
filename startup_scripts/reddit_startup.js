console.log("========================");
console.log("Starting Relay Script...");
console.log("========================");

chrome.runtime.onMessage.addListener(messageRecived);

function messageRecieved(msg) {
    try {
        // Do nothing if they don't want us to
        if (!msg.hasOwnProperty('site_meta')) return;
        if (msg.sender != "reddit.js") return;
        if (!msg.site_meta) return;

        // Check what they want
        switch (msg.intent) {
            case 'update_init':
                // Get the remote update time
                
                // Check if it's newer than the local update time

                // if we're behind, show the new message

                break;
            case 'toggle_enabled':
                // Get the state of reddit_enabled
                let reddit_is_enabled = false;
                chrome.storage.local.get(function(result) { reddit_is_enabled = result.reddit_enabled; });
                if (reddit_is_enabled == undefined) reddit_is_enabled = false;

                // Toggle the state, write it
                reddit_is_enabled = !reddit_is_enabled;
                chrome.storage.local.set({'reddit_init': reddit_is_enabled}, function() { });
                break;
            default:
                // Do nothing
                break;
        }
    } catch (e) {
        console.log(e);
    }
}
