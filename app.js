////// QUERY_SELECTORS
const audio = document.querySelector('#audio');
const musicContainer = document.querySelector(".music-container")
const imageContainer = document.querySelector('.image-container');
const musicTitle = document.querySelector(".info-title h2")
const musicProgress = document.querySelector('.info-progress')
const progreesM = document.querySelector(".info-progress__play")
const musicSpeed = document.querySelector('.info-speed')
const playBtn = document.querySelector('.play-btn');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');


// Song
let songs;
let songsIndex = 0

// speed
const speedNumber = document.querySelector(".info-speed h4")
const speedOptions = [1.0, 1.5, 2.0, 0.75]
let speedIndex = 0



////// FUNCTIONS

// Fucntion: Update UI with the CurrentSong
function loadSong(song) {
  musicTitle.innerText = song.title
  audio.src = `${song.audio}`
  imageContainer.style.backgroundImage = `url('${song.cover}')`
  const div = document.createElement("div")
  div.classList.add('backdrop')
  div.appendChild(musicContainer)
  document.body.appendChild(div)
  document.body.style.backgroundImage = `url('${song.cover}')`
}

// Fucntion: Load Songs From Server
async function loadSongsFromServer() {
  await fetch('data.json')
    .then((res) => {
      if(!res.ok) throw new Error('Network Error!')
      return res.json()
    })
    .then(data => {
      songs = data.songs;
      loadSong(songs[songsIndex])
    })
    .catch(err => console.log(err))
}

loadSongsFromServer()

// Function: check if song is playing
function isAudioPlaying() {
  return (musicContainer.classList.contains("playing"))
}

// Fucntion: Pause the audio
function pauseAudio() {
  audio.pause()
  musicContainer.classList.remove("playing")
  playBtn.innerHTML = `
  <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.25 12L5.75 5.75V18.25L18.25 12Z"></path>
</svg>
  `
}

// Function: Play the Audio
function playAudio() {
  musicContainer.classList.add("playing")
  playBtn.innerHTML = `
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <rect width="12.5" height="12.5" x="5.75" y="5.75" stroke="currentColor" stroke-linecap="round"             stroke-linejoin="round" stroke-width="1.5" rx="1"></rect>
    </svg>
  `
  audio.playbackRate = `${speedOptions[speedIndex]}`
  audio.play()
}

// Function next and prev buttons functions
function nextSong() {
  songsIndex += 1
  if(songsIndex > songs.length - 1) {
    songsIndex = 0
  }
  loadSong(songs[songsIndex])
  progreesM.style.width = '0%'
  isAudioPlaying() === true ? playAudio() : pauseAudio()
}

function prevSong() {
  songsIndex -= 1
  if(songsIndex < 0) {
    songsIndex = songs.length - 1
  }
  loadSong(songs[songsIndex])
  progreesM.style.width = '0%'
  isAudioPlaying() === true ? playAudio() : pauseAudio()
}

// Function: update Music Speed
function updateSpeedIndicator() {
  speedIndex += 1;
  if(speedIndex > speedOptions.length - 1) {
    speedIndex = 0
  }
  speedNumber.textContent = `${speedOptions[speedIndex]}X`
  playAudio()
}

// Function: update progress bar
function updateProgressBar(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercentage = (currentTime / duration) * 100
  progreesM.style.width = `${progressPercentage}%`
}

// function: update progress bar by click mouse on element
function updateProgressBarPlayPosition(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  audio.currentTime = (clickX / width) * duration
}



////// EVENTS

// Event: Play-btn
playBtn.addEventListener("click", () => {
  isAudioPlaying() ? 
    pauseAudio()   :
    playAudio()
})

// Event: next and prev buttons
nextBtn.addEventListener('click',nextSong)
prevBtn.addEventListener('click',prevSong)

// Event: speed
musicSpeed.addEventListener("click",updateSpeedIndicator)

// Event: ProgressBar Update
audio.addEventListener("timeupdate", updateProgressBar)
musicProgress.addEventListener("click", updateProgressBarPlayPosition)
