(() => {
  const selector = 'h1, h2, h3, h4, h5, h6';
  const colors = new WeakMap();
  let audio;
  let pending = false;
  async function playTitle() {
    if (pending || (audio && !audio.paused)) return;
    pending = true;
    try {
      if (!audio) audio = new Audio(chrome.runtime.getURL('title_call.mp3'));
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        console.info('[kureyonsintyan] 音声を有効にするには見出しをクリックしてください。');
      } else {
        console.warn('[kureyonsintyan] 音声を再生できませんでした。', error);
        audio = undefined;
      }
    } finally {
      pending = false;
    }
  }
  function headingFor(target) {
    return target instanceof Element ? target.closest(selector) : null;
  }
  document.addEventListener('mouseover', (event) => {
    const heading = headingFor(event.target);
    if (!heading || (event.relatedTarget instanceof Node && heading.contains(event.relatedTarget))) return;
    if (!colors.has(heading)) colors.set(heading, [heading.style.getPropertyValue('color'), heading.style.getPropertyPriority('color')]);
    heading.style.setProperty('color', 'orange', 'important');
    void playTitle();
  });
  document.addEventListener('mouseout', (event) => {
    const heading = headingFor(event.target);
    if (!heading || (event.relatedTarget instanceof Node && heading.contains(event.relatedTarget))) return;
    const original = colors.get(heading);
    if (!original) return;
    if (original[0]) heading.style.setProperty('color', ...original);
    else heading.style.removeProperty('color');
    colors.delete(heading);
  });
  // A trusted click supplies user activation when Chrome blocks hover playback.
  document.addEventListener('click', (event) => {
    if (headingFor(event.target)) void playTitle();
  });
})();
