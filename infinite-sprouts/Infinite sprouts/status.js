    // === Live Now Functionality ===
    seeMoreLive.addEventListener('click', () => {
        liveNow.classList.add('expanded');
    });

    closeSeeMore.addEventListener('click', () => {
        liveNow.classList.remove('expanded');
    });

    // === Status Updates Functionality ===
    // Status Updates Swipe Functionality
    let statusStartX;
    let statusScrollLeft;

    statusUpdatesSessions.addEventListener('mousedown', (e) => {
        statusStartX = e.pageX - statusUpdatesSessions.offsetLeft;
        statusScrollLeft = statusUpdatesSessions.scrollLeft;
        statusUpdatesSessions.classList.add('active');
    });

    statusUpdatesSessions.addEventListener('mouseleave', () => {
        statusUpdatesSessions.classList.remove('active');
    });

    statusUpdatesSessions.addEventListener('mouseup', () => {
        statusUpdatesSessions.classList.remove('active');
    });

    statusUpdatesSessions.addEventListener('mousemove', (e) => {
        if (!statusUpdatesSessions.classList.contains('active')) return;
        e.preventDefault();
        const x = e.pageX - statusUpdatesSessions.offsetLeft;
        const walk = (x - statusStartX) * 2; //scroll-fast
        statusUpdatesSessions.scrollLeft = statusScrollLeft - walk;
        updateStatusDots();
    });

    // Touch events for mobile
    statusUpdatesSessions.addEventListener('touchstart', (e) => {
        statusStartX = e.touches[0].pageX - statusUpdatesSessions.offsetLeft;
        statusScrollLeft = statusUpdatesSessions.scrollLeft;
    });

    statusUpdatesSessions.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - statusUpdatesSessions.offsetLeft;
        const walk = (x - statusStartX) * 2; //scroll-fast
        statusUpdatesSessions.scrollLeft = statusScrollLeft - walk;
        updateStatusDots();
    });

    function updateStatusDots() {
        const scrollLeft = statusUpdatesSessions.scrollLeft;
        const width = statusUpdatesSessions.scrollWidth - statusUpdatesSessions.clientWidth;
        const scrollPercentage = (scrollLeft / width) * 100;
        const dotIndex = Math.floor((scrollPercentage / 100) * statusDots.children.length);

        statusDots.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }

    // === Live Now Swipe Functionality ===
    let liveStartX;
    let liveScrollLeft;

    liveSessions.addEventListener('mousedown', (e) => {
        liveStartX = e.pageX - liveSessions.offsetLeft;
        liveScrollLeft = liveSessions.scrollLeft;
        liveSessions.classList.add('active');
    });

    liveSessions.addEventListener('mouseleave', () => {
        liveSessions.classList.remove('active');
    });

    liveSessions.addEventListener('mouseup', () => {
        liveSessions.classList.remove('active');
    });

    liveSessions.addEventListener('mousemove', (e) => {
        if (!liveSessions.classList.contains('active')) return;
        e.preventDefault();
        const x = e.pageX - liveSessions.offsetLeft;
        const walk = (x - liveStartX) * 2; //scroll-fast
        liveSessions.scrollLeft = liveScrollLeft - walk;
        updateLiveDots();
    });

    // Touch events for mobile
    liveSessions.addEventListener('touchstart', (e) => {
        liveStartX = e.touches[0].pageX - liveSessions.offsetLeft;
        liveScrollLeft = liveSessions.scrollLeft;
    });

    liveSessions.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - liveSessions.offsetLeft;
        const walk = (x - liveStartX) * 2; //scroll-fast
        liveSessions.scrollLeft = liveScrollLeft - walk;
        updateLiveDots();
    });

    function updateLiveDots() {
        const scrollLeft = liveSessions.scrollLeft;
        const width = liveSessions.scrollWidth - liveSessions.clientWidth;
        const scrollPercentage = (scrollLeft / width) * 100;
        const dotIndex = Math.floor((scrollPercentage / 100) * liveDots.children.length);

        liveDots.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }
