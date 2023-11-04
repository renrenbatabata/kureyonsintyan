const dazos = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

dazos.forEach((dazo) => {
  dazo.textContent += 'だゾ';
});



const headings = document.querySelectorAll('h1, h2, h3');
// 画像を作成
const gifUrl = chrome.runtime.getURL("./ketu.gif");

// 各見出し要素の上にGIF画像を追加
// JavaScript
headings.forEach((heading) => {
  // 画像要素を作成
  const img = document.createElement('img');
  img.src = gifUrl;
  img.alt = 'ケツだし星人';
  img.classList.add("ketu");
  // 見出し要素の直後に画像を追加
  heading.parentNode.insertBefore(img, heading.nextSibling);
});

