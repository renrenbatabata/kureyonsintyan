let audio = null; // Audio要素を外部に持つ

const titles = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

titles.forEach(title => {
  title.addEventListener("mouseover", (event) => {
    if (!audio || audio.paused) {
      const music = chrome.runtime.getURL("title_call.mp3");
      audio = new Audio(music);
      audio.autoplay = true;
      audio.play();
    }

    event.target.style.color = "orange";
  });

  title.addEventListener("mouseout", (event) => {
    event.target.style.color = "";
  });
});
