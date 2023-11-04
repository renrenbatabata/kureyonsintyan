const titles = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

titles.forEach(title => {
  title.addEventListener("mouseover", (event) => {
    event.target.style.color = "orange";
    setTimeout(() => {
      event.target.style.color = "";
    }, 1000);
    const music = chrome.runtime.getURL("title_call.mp3");
    let audio = new Audio(music);
    audio.controls = true;
    audio.autoplay = true;
    title.appendChild(audio);
    audio.play();
  });
});

