const titles = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

titles.forEach(title => {
  title.addEventListener("mouseover", (event) => {
    event.target.style.color = "orange";
    const music = chrome.runtime.getURL("title_call.mp3");
    let audio = new Audio(music);
    audio.autoplay = true;
    audio.play();
  });
  title.addEventListener("mouseout", (event) => {
    event.target.style.color = "";
  });
});
