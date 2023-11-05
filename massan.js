let observer = new MutationObserver(mutations => {
    let images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        if(images[i].src != chrome.runtime.getURL('ketu.gif')){
            images[i].src = chrome.runtime.getURL('ketujin.png');
        }
    }
});

observer.observe(document, { childList: true, subtree: true });