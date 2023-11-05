let images = document.getElementsByTagName('img');
for (let i = 0; i < images.length; i++) {
    if(images[i].src != chrome.runtime.getURL('ketu.gif')){
        images[i].src = chrome.runtime.getURL('ketujin.png');
    }
    
}

// 拡張機能内の画像を使ったimgタグを作成する
// let img = "<img src='" + chrome.runtime.getURL("'../image/ketu.jpg'") + "'>;"