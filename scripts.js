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

    allFilter.addEventListener('change', function() {
        if (this.checked) {
            otherFilters.forEach(f => {
                f.checked = false;
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
        });
    });

    // 筛选逻辑
    const filterOptions = document.querySelectorAll('.filter-options input');
    const artItems = document.querySelectorAll('.art-item');

    filterOptions.forEach(option => {
        option.addEventListener('change', function() {
            const selectedOptions = Array.from(filterOptions)
                .filter(opt => opt.checked)
                .map(opt => opt.value);
            
            artItems.forEach(item => {
                const itemTags = item.getAttribute('data-tags').split(',');
                const shouldShow = selectedOptions.includes('all') || selectedOptions.some(tag => itemTags.includes(tag));
                item.style.display = shouldShow ? 'block' : 'none';
            });
        });
    });

    
    artItems.forEach(item => {
        item.addEventListener('click', function() {
            const link = item.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });
});

