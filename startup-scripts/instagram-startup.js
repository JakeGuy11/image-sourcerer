console.log("====================================");
console.log("Starting Instagram Startup Script...");
console.log("====================================");

chrome.extension.onRequest.addListener(messageRecieved);

function messageRecieved(msg) {
    try {
        // Do nothing if they don't want us to
        if (!msg.hasOwnProperty('site_meta')) return;
        if (msg.sender != "instagram.js") return;
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
                    let server_update_time = Number(http_req_servertime.responseText.split("<instagram>")[1].split("</instagram>")[0]);
                    chrome.storage.local.get(function(storage_res) {
                        let local_update_time = storage_res.insta_update_time;
                        if (local_update_time == undefined) local_update_time = 0;
                        let new_message_available = (server_update_time >= local_update_time);

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
                                    if (acknowledged) chrome.storage.local.set({'insta_update_time': Math.floor((new Date).getTime()/1000)}, function() {  });
                                    else chrome.storage.local.set({'insta_update_time': 0}, function() { });
                                };
                                document.getElementById("modal_close").addEventListener("click", close_modal.bind(null, overall_div, false));
                                document.getElementById("modal_okay").addEventListener("click", close_modal.bind(null, overall_div, true));
                            };

                            // Load the url, send the request
                            http_req_modalcontent.open("GET", "https://raw.githubusercontent.com/JakeGuy11/image-sourcerer/main/startup-scripts/messages/instagram.html");
                            http_req_modalcontent.send();
                        }
					});
                };

                http_req_servertime.open("GET", "https://raw.githubusercontent.com/JakeGuy11/image-sourcerer/main/startup-scripts/latest_updates.info");
                http_req_servertime.send();
                
                break;
            case 'toggle_enabled':
                // Get the state of insta_enabled
                let insta_is_enabled = false;
                chrome.storage.local.get(function(result) {
			        // Check if it's enabled
			        insta_is_enabled = result.insta_enabled;
                	if (insta_is_enabled == undefined) insta_is_enabled = true;

                	// Toggle the state, write it
                	insta_is_enabled = !insta_is_enabled;
                	chrome.storage.local.set({'insta_enabled': insta_is_enabled}, function() { });
		        });
                break;
            default:
                // Do nothing
                break;
        }
    } catch (e) {
        console.log(e);
    }
}
