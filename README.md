# クレヨンしんちゃん Chrome拡張機能

## インストール・更新
1. ZIPを展開する。
2. Chromeで chrome://extensions を開き「デベロッパーモード」を有効にする。
3. 「パッケージ化されていない拡張機能を読み込む」で manifest.json のあるフォルダーを選ぶ。
4. 更新時は拡張機能の再読み込み後、対象のWebページも再読み込みする。

## 音声
h1〜h6へのマウスオーバーで title_call.mp3 を再生する。Chromeに拒否された場合はページ内の見出しをクリックして再試行する。クリックはページのリンク等の通常動作を妨げない。再生中と再生開始待ちの追加要求は無視する。再生終了後は次の操作で先頭から再生する。
Chromeのサイト設定・管理ポリシー・ページの制限により音声が再生できない場合がある。Chrome内部ページやChrome Web Store等ではコンテンツスクリプト自体が動作しない。ローカルファイルでは拡張機能の「ファイルのURLへのアクセスを許可する」設定が必要。

## 1.1.0の変更
- 既存のManifest V3と音声・画像の公開設定を維持。追加の権限なし。
- play()のPromise拒否と同期例外を処理。再生拒否を案内し、その他のエラー後は音声要素を再作成して再試行。
- 見出し内の子要素間移動で音声を再要求しない。元のインライン文字色とimportantを復元。
- 後から追加された見出しも音声・色変更の対象にする。
- 語尾「だゾ」の追加で見出し内リンクや要素・イベントを破壊しないように変更。
- 最初からある画像も置換し、拡張機能のGIFは維持する。
- 既存のGIFアニメーション、ポップアップを維持。

語尾とGIFの追加は従来どおりページ読み込み時の見出しが対象。Shadow DOMやiframe内は対象外。画像置換は従来どおりimg.srcが対象で、picture/srcsetやCSS背景は対象外。

## 自動検証
Node.jsとGoogle Chromeをインストールした環境で npm install、npm test を実行する。
- tests/regression.cjs: 実ChromeのDOM上で音声APIを模擬。成功、NotAllowedError、NotSupportedErrorからの回復、開始待ち中の重複防止、文字色復元、リンク保持、語尾、GIFと画像置換、動的追加、Manifest V3の参照資産を確認。
- tests/media.cjs: ローカルHTTPから同梱MP3を実Chromeで読み込み、クリック後に再生が進みエラーがないことを確認。
- 拡張機能としての読み込みとchrome-extension://経由の資産取得は自動テストの対象外。

## 手動での最終確認
上記手順で読み込み、拡張機能のエラー欄に問題がないことを確認する。通常のWebページで全見出しの語尾、h1〜h3後方のGIF、画像置換、ホバー時のオレンジ色と離脱時の復元、音声を確認する。新規サイトでホバー音声が拒否された場合は見出しをクリックして再試行する。リンクの動作とポップアップも確認する。

参考: https://developer.chrome.com/blog/autoplay/
参考: https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources
