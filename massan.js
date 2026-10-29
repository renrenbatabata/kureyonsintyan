(() => {
  const gifUrl = chrome.runtime.getURL('ketu.gif');
  const imageUrl = chrome.runtime.getURL('ketujin.png');
  function replaceImages() {
    for (const image of document.getElementsByTagName('img')) {
      if (image.src !== gifUrl && image.src !== imageUrl) image.src = imageUrl;
    }
  }
  replaceImages();
  const observer = new MutationObserver(replaceImages);
  observer.observe(document, { childList: true, subtree: true });
})();
