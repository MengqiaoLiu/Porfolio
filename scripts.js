document.addEventListener("DOMContentLoaded", function() {
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const meElement = document.getElementById('me');
    const randomColor = getRandomColor();
    meElement.style.color = randomColor;

    // 设置覆盖层颜色与 "Me" 颜色一致
    const overlays = document.querySelectorAll('.overlay');
    overlays.forEach(overlay => {
        overlay.style.backgroundColor = `${randomColor}33`; // 透明度20%的颜色
    });

    // 设置全局 CSS 变量以供 :hover 伪类使用
    document.documentElement.style.setProperty('--me-color', randomColor);

    // 互斥选择逻辑
    const allFilter = document.querySelector('input[value="all"]');
    const otherFilters = document.querySelectorAll('input[name="filter"]:not([value="all"])');
    const filterOptions = document.querySelectorAll('.filter-options input');
    const artItems = document.querySelectorAll('.art-item');

    allFilter.addEventListener('change', function() {
        if (this.checked) {
            otherFilters.forEach(f => {
                f.checked = false;
            });
            artItems.forEach(item => {
                item.style.display = 'block';
            });
        }
    });

    otherFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.checked) {
                allFilter.checked = false;
            } else {
                const anyChecked = Array.from(otherFilters).some(f => f.checked);
                if (!anyChecked) {
                    allFilter.checked = true;
                }
            }
            filterArtItems();
        });
    });

    function filterArtItems() {
        const selectedFilters = Array.from(otherFilters)
            .filter(f => f.checked)
            .map(f => f.value);

        if (selectedFilters.length === 0) {
            allFilter.checked = true;
            artItems.forEach(item => {
                item.style.display = 'block';
            });
            return;
        }

        artItems.forEach(item => {
            const itemTags = item.getAttribute('data-tags').split(',');
            const isMatch = selectedFilters.every(filter => itemTags.includes(filter));
            item.style.display = isMatch ? 'block' : 'none';
        });
    }

    filterOptions.forEach(option => {
        option.addEventListener('change', filterArtItems);
    });

    // 点击 art-item 跳转并隐藏 .html
    artItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const link = item.getAttribute('data-link');
            if (link) {
                fetch(link)
                    .then(response => response.text())
                    .then(html => {
                        document.getElementById('main-content').innerHTML = html;
                        const newPath = link.replace('.html', '');
                        history.pushState(null, '', newPath);
                    })
                    .catch(err => console.warn('Something went wrong.', err));
            }
        });
    });

    window.addEventListener('popstate', function() {
        const path = location.pathname.split('/').pop() || 'index';
        fetch(path + '.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('main-content').innerHTML = html;
            })
            .catch(err => console.warn('Something went wrong.', err));
    });

    // 悬停显示和隐藏视频，并自动播放
    const hoverVideoContainer = document.querySelector('.hover-video-container');
    const hoverVideo = hoverVideoContainer.querySelector('.hover-video');
    const thumbnail = hoverVideoContainer.querySelector('.thumbnail');
    const iframe = hoverVideo.querySelector('iframe');
    const videoSrc = iframe.src;

    hoverVideoContainer.addEventListener('mousemove', function(e) {
        hoverVideo.style.display = 'block';
        hoverVideo.style.left = `${e.clientX - hoverVideo.offsetWidth / 2}px`;
        hoverVideo.style.top = `${e.clientY - hoverVideo.offsetHeight / 2}px`;
        if (!iframe.src.includes("autoplay=1")) {
            iframe.src = videoSrc + "&autoplay=1";
        }
    });

    hoverVideoContainer.addEventListener('mouseleave', function() {
        hoverVideo.style.display = 'none';
        iframe.src = videoSrc; // Reset the video source to stop the video
    });

});
