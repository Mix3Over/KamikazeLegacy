document.addEventListener("DOMContentLoaded", function () {
    const volumeButton = document.getElementById("volume-button");
    const volumeSlider = document.getElementById("volume-slider");

    document.querySelectorAll('.audio-player').forEach(player => {
        const audio = player.querySelector('.audio');
        const playButton = player.querySelector('.play-button');
        const playImage = playButton.querySelector('img');
        const progressBarContainer = player.querySelector('.progress-bar-container');
        const progressBar = player.querySelector('.progress-bar');
        
        // Create time display element
        const timeDisplay = document.createElement("div");
        timeDisplay.classList.add("time-display");
        timeDisplay.textContent = "0:00 / 0:00";
        progressBarContainer.after(timeDisplay);
        
        const playIcon = "Content/Play.png";
        const pauseIcon = "Content/Pause.png";

        // Play/Pause functionality
        playButton.addEventListener("click", function () {
            if (audio.paused) {
                audio.play();
                playImage.src = pauseIcon;
                playImage.style.width = "55px";  // Smaller pause button
                playImage.style.height = "55px";
            } else {
                audio.pause();
                playImage.src = playIcon;
                playImage.style.width = "80px";  // Normal play button size
                playImage.style.height = "80px";
            }
        });

        // Update progress bar and time display
        audio.addEventListener("timeupdate", function () {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + "%";
                timeDisplay.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
            }
        });

        // Click to seek
        progressBarContainer.addEventListener("click", function (event) {
            if (audio.duration) {
                const containerWidth = progressBarContainer.clientWidth;
                const clickPosition = event.offsetX;
                const newTime = (clickPosition / containerWidth) * audio.duration;
                audio.currentTime = newTime;
            }
        });

        // Reset button image when audio ends
        audio.addEventListener("ended", function () {
            playImage.src = playIcon;
            progressBar.style.width = "0%";
            timeDisplay.textContent = "0:00 / " + formatTime(audio.duration);
        });
    });

    volumeSlider.value = 0.5;
    document.querySelectorAll('.audio').forEach(audio => {
        audio.volume = volumeSlider.value / 3;
    });
    
    // Volume control
    volumeSlider.addEventListener("input", function () {
        const volume = volumeSlider.value;
        document.querySelectorAll('.audio').forEach(audio => {
            audio.volume = volume / 3;
        });
        volumeButton.innerText = volume == 0 ? "🔇" : "🔊";
    });

    volumeButton.addEventListener("click", function () {
        const isMuted = volumeSlider.value == 0;
        document.querySelectorAll('.audio').forEach(audio => {
            audio.muted = !isMuted;
        });
        volumeSlider.value = isMuted ? 1 : 0;
        volumeButton.innerText = isMuted ? "🔊" : "🔇";
    });

    // Format time function
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
});
