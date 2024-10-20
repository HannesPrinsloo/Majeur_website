document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('scroll-video');
    const videoDuration = 64; // Video duration in seconds
    const pixelsPerSecond = 1000; // Pixels of scrolling per second of video
    const scrollHeight = videoDuration * pixelsPerSecond;
    let lastScrollTop = 0;
    let accumulatedScroll = 0;

    function setVideoTime() {
        const currentScrollTop = window.scrollY;
        const scrollDelta = currentScrollTop - lastScrollTop;
        
        // Accumulate small scroll changes
        accumulatedScroll += scrollDelta;
        
        // Update video time based on accumulated scroll
        if (Math.abs(accumulatedScroll) >= 1) {
            const timeChange = accumulatedScroll / pixelsPerSecond;
            const newTime = Math.max(0, Math.min(video.currentTime + timeChange, videoDuration - 0.01));
            
            video.currentTime = newTime;
            accumulatedScroll = 0; // Reset accumulated scroll
            
            console.log(`Scroll: ${currentScrollTop.toFixed(2)}, Video time: ${newTime.toFixed(4)}`);
        }
        
        lastScrollTop = currentScrollTop;
    }

    function smoothScroll() {
        requestAnimationFrame(setVideoTime);
    }

    window.addEventListener('scroll', smoothScroll);

    // Initial setup
    video.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded. Duration:', video.duration);
        video.currentTime = 0;
    });

    // Update body height to match scroll height
    document.body.style.height = `${scrollHeight}px`;
    console.log('Total scroll height:', scrollHeight);
});
