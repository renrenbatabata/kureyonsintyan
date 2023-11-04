const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

headings.forEach((heading) => {
  heading.textContent += 'だゾ';
});


// 画像を作成
const gifUrl = chrome.runtime.getURL("./ketu.gif");

// 各見出し要素の上にGIF画像を追加
headings.forEach((heading) => {
  // 画像要素を作成
  const img = document.createElement('img');
  img.src = gifUrl;
  img.alt = 'ケツだし星人';

  // 見出し要素をラップするコンテナを作成
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.appendChild(heading.cloneNode(true)); // オリジナルの見出しをコピーしてコンテナに追加
  container.appendChild(img); // GIF画像をコンテナに追加

  // オリジナルの見出しを置き換える
  heading.parentNode.replaceChild(container, heading);
});