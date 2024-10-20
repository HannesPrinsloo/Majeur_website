document.addEventListener('DOMContentLoaded', () => {
    const analogStick = document.getElementById('analog-stick');
    const container = document.getElementById('analog-stick-container');
    let isDragging = false;
    let stickCenterX, stickCenterY;
    let scrollInterval;
    const deadZone = 0.1; // 10% of max distance as dead zone

    function startDrag(e) {
        isDragging = true;
        const stickRect = analogStick.getBoundingClientRect();
        
        stickCenterX = stickRect.left + stickRect.width / 2;
        stickCenterY = stickRect.top + stickRect.height / 2;
        
        const initialDeltaX = e.clientX - stickCenterX;
        const initialDeltaY = e.clientY - stickCenterY;
        
        updateStickPosition(initialDeltaX, initialDeltaY);
        
        // Add 'active' class for initial click feedback
        analogStick.classList.add('active');
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - stickCenterX;
        const deltaY = e.clientY - stickCenterY;
        updateStickPosition(deltaX, deltaY);
    }

    function updateStickPosition(deltaX, deltaY) {
        const containerRect = container.getBoundingClientRect();
        const maxDistance = (containerRect.width / 2) - (analogStick.offsetWidth / 2);

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const normalizedDistance = distance / maxDistance;

        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }

        analogStick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

        // Visual feedback for maximum extension
        if (normalizedDistance >= 0.9) {
            analogStick.style.boxShadow = '0 0 10px 5px rgba(255, 0, 0, 0.5)';
        } else {
            analogStick.style.boxShadow = 'none';
        }

        // Scroll logic with dead zone
        if (normalizedDistance > deadZone) {
            const scrollSpeed = Math.pow((normalizedDistance - deadZone) / (1 - deadZone), 2) * 50;
            const scrollX = (deltaX / maxDistance) * scrollSpeed;
            const scrollY = (deltaY / maxDistance) * scrollSpeed;

            clearInterval(scrollInterval);
            scrollInterval = setInterval(() => {
                window.scrollBy(scrollX, scrollY);
            }, 16); // ~60fps
        } else {
            clearInterval(scrollInterval);
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        clearInterval(scrollInterval);

        // Remove all state classes
        analogStick.classList.remove('active', 'max-extension');

        // Smooth return-to-center animation
        analogStick.style.transition = 'transform 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out';
        analogStick.style.transform = 'translate(-50%, -50%)';
        analogStick.style.backgroundColor = ''; // Reset to initial color
        analogStick.style.boxShadow = ''; // Reset box shadow

        // Reset transition after animation
        setTimeout(() => {
            analogStick.style.transition = '';
        }, 300);
    }

    // Mouse events
    analogStick.addEventListener('mousedown', startDrag);

    // Touch events
    // analogStick.addEventListener('touchstart', handleTouchStart);
    // document.addEventListener('touchmove', handleTouchMove);
    // document.addEventListener('touchend', stopDrag);

    function handleTouchStart(e) {
        e.preventDefault();
        startDrag(e.touches[0]);
    }

    function handleTouchMove(e) {
        if (isDragging) {
            e.preventDefault();
            drag(e.touches[0]);
        }
    }
});
