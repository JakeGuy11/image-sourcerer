sleep(1000);
notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Pixiv Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

// Handle the download
function startDownload(src, post_link, op) {

    var extention = "";

     if(src.includes(".jpg")){
        extention = ".jpg";
    } else if(src.includes(".png")) {
        extention = ".png";
    } else if(src.includes(".gif")) {
        extention = ".gif";
    } else {
        notifySignal({ "intent": "relay", "content": "Extention could not be found." });
        return;
    }

   var save_name = prompt("Enter the path (relative to ~/Downloads/Image-Sourcerer/) and filename you would like to save the image under","");

    if (save_name == null || save_name == "") return;
    if(save_name.includes("..")){
        alert("Your save location cannot include '..'");
        return;
    }

    notifySignal({
        "intent": "queue_download",
        "target_url": src,
        "post_src": post_link,
        "save_name": "Image-Sourcerer/" + save_name,
        "ext": extention,
        "op": op,
        "custom_header": true,
        "header_name": "referer",
        "header_content": "https://www.pixiv.net/"
    });
}

function startParse()
{
    // Find the link to the actual image
    var image_divs = Array.from(document.querySelectorAll("[role=\"presentation\"]"));
    // Remove the two elements we know we don't want
    image_divs.splice(0, 1);
    image_divs.splice(-1, 1);

    console.log(image_divs);

    //if(image_divs.length < 5)
    //{
        for(current_item of image_divs)
        {
            // Get all the info we'll need
            var source = document.URL;
            var img_src = current_item.childNodes[0].href;
            var op = document.getElementsByClassName("sc-10gpz4q-6 gOiTBS")[0].innerText;

            var button_element = '<idl_button style="position:absolute;float:left;top:10px;left:10px;z-index:99"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" width=32></a></idl_button>';
            current_item.style.position = "relative";
            current_item.innerHTML += button_element;

            let idl_downloader = current_item.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
            idl_downloader.addEventListener("click", startDownload.bind(null, img_src, source, op), false);
        }
    //}
    //else
    /*{
        var source = document.URL;
        var op = document.getElementsByClassName("sc-10gpz4q-6 gOiTBS")[0].innerText;

        var button_element = '<idl_button style="top:36px;margin:24px;position:fixed"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" width=32></a></idl_button>';
        document.getElementsByClassName("sc-4nj1pr-0 gRbSeX")[0].innerHTML = button_element + document.getElementsByClassName("sc-4nj1pr-0 gRbSeX")[0].innerHTML;

        document.getElementsByTagName("idl_button")[0].addEventListener("click", function() {
            console.log("clicked");
            let req_image = prompt("Enter the index of the image you would like to download:","");
            let req_index = parseInt(req_image);
            
            if (isNaN(req_index))
            {
                alert("That is not a valid image index!");
                return;
            }

            url = image_divs[req_index - 1].getElementsByTagName("img")[0].src;
            startDownload(url, source, op);
        }, false);
    }*/
}

window.addEventListener('load', function () {
    setTimeout(function() {
        startParse();
        let seeAllButton = document.getElementsByClassName("emr523-0 cwSjFV");
        if (seeAllButton.length > 0)
        {
            seeAllButton[0].addEventListener("click", () => { setTimeout(() => { startParse(); }, 2000); });
        }
    }, 500);
});

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "pixiv.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
