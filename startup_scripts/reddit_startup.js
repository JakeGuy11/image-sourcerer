console.log("=================================");
console.log("Starting Reddit Startup Script...");
console.log("=================================");

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
                http_req_servertime = new XMLHttpRequest();

                // Add the function of what to do after the server update time is aquired
                http_req_servertime.onload = function () {
                    if (http_req_servertime.readyState != 4 || http_req_servertime.status != 200) {} // Eventually, show error modal and return
                    // Check if it's newer than the local update time
                    let server_update_time = Number(http_req_servertime.responseText.split("<reddit>")[1].split("</reddit>")[0]);
                    let local_update_time = 0;
                    chrome.storage.local.get(function(result) { local_update_time = result.reddit_update_time; });
					if (local_update_time == undefined) local_update_time = 0;
                    let new_message_available = (server_update_time > local_update_time);

                    // if we're behind, show the new message
					if (new_message_available) {
						// Get the modal innerHTML, inject it
						http_req_modalcontent = new XMLHttpRequest();
						http_req_modalcontent.onload = function() {
                            // Create the modal, inject it
                            var overall_div = document.createElement("div");
                            overall_div.id = "welcome_modal";
                            overall_div.style.position = "fixed";
                            overall_div.style.backgroundColor = "#000000AA";
                            overall_div.style.width = overall_div.style.height = "100%";
                            overall_div.style.left = overall_div.style.top = "0";
                            overall_div.style.zIndex = "99";
                            overall_div.innerHTML = http_req_modalcontent.responseText;
                            document.body.appendChild(overall_div);

                            // Add all the listeners
                            let close_modal = function (div, acknowledged) {
								div.parentNode.removeChild(div);
								if (acknowledged) chrome.storage.local.set({'reddit_update_time': server_update_time}, function() { });
                                else chrome.storage.local.set({'reddit_update_time': 0}, function() { });
							};
                            document.getElementById("modal_close").addEventListener("click", close_modal.bind(null, overall_div, false));
                            document.getElementById("modal_okay").addEventListener("click", close_modal.bind(null, overall_div, true));
                        };
					}
                };
                
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
