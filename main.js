const videoPlayerContainer = document.querySelector(".video-player-container");
const videoPlayer = document.querySelector(".video-player");
const controls = document.querySelector(".controls");
const playPauseButton = document.querySelector(".play-pause-button");
const muteUnmuteButton = document.querySelector(".mute-unmute-button");
const progressSlider = document.querySelector(".progress-slider");
const progressBar = document.querySelector(".progress-bar");
const fullScreenButton = document.querySelector(".fullscreen-button");
const time = document.querySelector(".time");
const header = document.querySelector("header");
const playBackSpeedButton = document.querySelector(".playback-speed-button");
const playBackSpeedButtonOptions = document
  .querySelector(".playback-modal")
  .querySelectorAll("button");
const playbackModal = document.querySelector(".playback-modal");
let isClicked = false;

window.addEventListener("load",()=>{
  videoPlayer.src = "./video1.mp4"
})

const videoCheck = () => {
  let inter = setInterval(()=>{
    if(videoPlayer.readyState >= 3){
      if (!localStorage.getItem("volume")) {
        progressSlider.value = 50;
        progressSlider.style.backgroundSize = "50% 100%";
      } else {
        progressSlider.value = parseFloat(localStorage.getItem("volume")) * 100;
        progressSlider.style.backgroundSize =
          parseFloat(localStorage.getItem("volume")) * 100 + "% 100%";
      }
      videoPlayer.controls = false;
      videoPlayer.volume = progressSlider.value * 0.01;
      time.max = videoPlayer.duration;
      time.value = videoPlayer.currentTime;
      time.style.backgroundSize = 0 + "% 100%";
      console.log("Loading")
      clearInterval(inter)
    }
  },500)
}

const playPause = () => {
  videoPlayer.paused || videoPlayer.ended
    ? (videoPlayer.play(),
      playPauseButton.querySelector("i").classList.remove("fa-play"),
      playPauseButton.querySelector("i").classList.add("fa-pause"))
    : (videoPlayer.pause(),
      playPauseButton.querySelector("i").classList.remove("fa-pause"),
      playPauseButton.querySelector("i").classList.add("fa-play"));
};

const muteSound = () => {
  videoPlayer.muted = !videoPlayer.muted;
  videoPlayer.muted
    ? (muteUnmuteButton.querySelector("i").classList.remove("fa-volume-up"),
      muteUnmuteButton.querySelector("i").classList.add("fa-volume-mute"),
      (progressSlider.value = 0),
      (progressSlider.style.backgroundSize = 0 + "% 100%"))
    : (muteUnmuteButton.querySelector("i").classList.remove("fa-volume-mute"),
      muteUnmuteButton.querySelector("i").classList.add("fa-volume-up"),
      (progressSlider.value = parseFloat(localStorage.getItem("volume")) * 100),
      (progressSlider.style.backgroundSize =
        parseFloat(localStorage.getItem("volume")) * 100 + "% 100%"));
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    videoPlayer.classList.add("full-screen-player");
    document.querySelector("body").classList.add("black");
    fullScreenButton.querySelector("i").classList.add("fa-compress");
    fullScreenButton.querySelector("i").classList.remove("fa-expand");
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape");
    }
  } else {
    document.exitFullscreen();
    videoPlayer.classList.remove("full-screen-player");
    document.querySelector("body").classList.remove("black");
    fullScreenButton.querySelector("i").classList.add("fa-expand");
    fullScreenButton.querySelector("i").classList.remove("fa-compress");
  }
};

const toggleSound = (e) => {};

progressSlider.addEventListener("wheel", (e) => {
  if (e.wheelDeltaY < 0) {
    videoPlayer.volume -= 1 * 0.01;
    localStorage.setItem("volume", videoPlayer.volume);
    progressSlider.value = parseFloat(localStorage.getItem("volume")) * 100;
  } else {
    videoPlayer.volume += 1 * 0.01;
    localStorage.setItem("volume", videoPlayer.volume);
    progressSlider.value = parseFloat(localStorage.getItem("volume")) * 100;
  }
  progressSlider.style.backgroundSize = videoPlayer.volume * 100 + "% 100%";
  if (videoPlayer.volume === 0) {
    muteUnmuteButton.querySelector("i").classList.remove("fa-volume-up"),
      muteUnmuteButton.querySelector("i").classList.add("fa-volume-mute");
  } else {
    muteUnmuteButton.querySelector("i").classList.remove("fa-volume-mute"),
      muteUnmuteButton.querySelector("i").classList.add("fa-volume-up");
  }
  if (videoPlayer.muted) {
    muteSound();
  }
});

progressSlider.addEventListener("input", (e) => {
  videoPlayer.volume = e.target.value * 0.01;
  localStorage.setItem("volume", videoPlayer.volume);
  progressSlider.style.backgroundSize = e.target.value + "% 100%";
  if (videoPlayer.volume === 0) {
    muteUnmuteButton.querySelector("i").classList.remove("fa-volume-up"),
      muteUnmuteButton.querySelector("i").classList.add("fa-volume-mute");
  } else {
    muteUnmuteButton.querySelector("i").classList.remove("fa-volume-mute"),
      muteUnmuteButton.querySelector("i").classList.add("fa-volume-up");
  }
  if (videoPlayer.muted) {
    muteSound();
  }
});

videoPlayer.addEventListener("canplaythrough", (e) => {
  videoCheck()
});

videoPlayer.addEventListener("click", (e) => {
  e.preventDefault();
  playPause();
});

videoPlayer.addEventListener("timeupdate", (e) => {
  e.preventDefault();
  time.value = videoPlayer.currentTime;
  time.style.backgroundSize = (time.value / time.max) * 100 + "% 100%";
});

time.addEventListener("input", (e) => {
  e.preventDefault();
  time.value = e.target.value;
  videoPlayer.currentTime = time.value;
  time.style.backgroundSize = (time.value / time.max) * 100 + "% 100%";
});

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    playPause();
  } else if (e.code === "ArrowLeft") {
    time.value -= 1;
    videoPlayer.currentTime = time.value;
    time.style.backgroundSize = (time.value / time.max) * 100 + "% 100%";
  }
});

playPauseButton.addEventListener("click", (e) => {
  e.preventDefault();
  playPause();
});

muteUnmuteButton.addEventListener("click", (e) => {
  e.preventDefault();
  muteSound();
});

fullScreenButton.addEventListener("click", (e) => {
  e.preventDefault();
  toggleFullscreen();
});

playBackSpeedButton.addEventListener("click", (e) => {
  playbackModal.classList.toggle("playback-modal-visible");
});

playBackSpeedButtonOptions.forEach((option) =>
  option.addEventListener("click", (e) => {
    videoPlayer.playbackRate = option.innerText;
    playbackModal.classList.remove("playback-modal-visible");
  })
);
