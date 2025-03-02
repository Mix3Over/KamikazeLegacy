document.addEventListener("DOMContentLoaded", function () {
    const volumeButton = document.getElementById("volume-button");
    const volumeSlider = document.getElementById("volume-slider");

    // Preload images to fix the issue of play button not loading on first click
    const playIcon = new Image();
    playIcon.src = "Content/Play.png?t=" + new Date().getTime(); // Cache-busting

    const pauseIcon = new Image();
    pauseIcon.src = "Content/Pause.png?t=" + new Date().getTime(); // Cache-busting

    document.querySelectorAll('.audio-player').forEach(player => {
        const audio = player.querySelector('.audio');
        const playButton = player.querySelector('.play-button');
        const playImage = playButton.querySelector('img');
        const progressBarContainer = player.querySelector('.progress-bar-container');
        const progressBar = player.querySelector('.progress-bar');

        // Set initial play button image from localStorage if available
        playImage.src = localStorage.getItem('playImage') || playIcon.src;

        // Ensure play button images reload correctly on navigation
        // playImage.onload = function () {
        //     console.log("Play button image loaded successfully:", playImage.src);
        // };
        // playImage.onerror = function () {
        //     console.error("Error loading play button image:", playImage.src);
        // };
        
        const timeDisplay = document.createElement("div");
        timeDisplay.classList.add("time-display");
        timeDisplay.textContent = "0:00 / " + formatTime(audio.duration);
        progressBarContainer.after(timeDisplay);

        // Play/Pause functionality
        playButton.addEventListener("click", function () {
            if (audio.paused) {
                document.querySelectorAll('.audio-player').forEach(x => {
                    const newAudio = x.querySelector('.audio');
                    const newPlayImage = x.querySelector('img');
                    newAudio.pause();
                    newPlayImage.src = playIcon.src;
                    newPlayImage.style.width = "80px";
                    newPlayImage.style.height = "80px";
                });
                audio.play();
                playImage.src = pauseIcon.src;
                playImage.style.width = "55px";
                playImage.style.height = "55px";
            } else {
                audio.pause();
                playImage.src = playIcon.src;
                playImage.style.width = "80px";
                playImage.style.height = "80px";
            }
            localStorage.setItem('playImage', playImage.src);
        });

        // Update progress bar and time display
        audio.addEventListener("timeupdate", function () {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + "%";
                timeDisplay.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
            }else{
                
                timeDisplay.textContent = "0:00 / " + formatTime(audio.duration);
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
            playImage.src = playIcon.src;
            progressBar.style.width = "0%";
            timeDisplay.textContent = "0:00 / " + formatTime(audio.duration);
            playImage.style.width = "80px";
            playImage.style.height = "80px";
            localStorage.setItem('playImage', playImage.src);
        });

    });

    volumeSlider.value = 0.5;
    document.querySelectorAll('.audio').forEach(audio => {
        audio.volume = volumeSlider.value / 3;
    });

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

    window.addEventListener("pageshow", function () {
        document.querySelectorAll('.play-button img').forEach(img => {
            img.src = "Content/Play.png?t=" + new Date().getTime();
        });
    });

    window.addEventListener("beforeunload", function () {
        document.querySelectorAll('.play-button img').forEach(img => {
            localStorage.setItem('playImage', img.src);
        });
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
});
