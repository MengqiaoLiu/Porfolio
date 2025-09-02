document.addEventListener("DOMContentLoaded", function() {
  /* ============== 主题色 ============== */
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  }

  const meElement = document.getElementById('me');
  const randomColor = getRandomColor();
  if (meElement) meElement.style.color = randomColor;

  // 覆盖层与 CSS 变量
  document.documentElement.style.setProperty('--me-color', randomColor);
  document.querySelectorAll('.overlay').forEach(overlay => {
    overlay.style.backgroundColor = `${randomColor}33`; // 透明度20%
  });

  /* ============== 过滤（存在才启用） ============== */
  const allFilter = document.querySelector('input[name="filter"][value="all"]');
  const otherFilters = document.querySelectorAll('input[name="filter"]:not([value="all"])');
  const filterOptions = document.querySelectorAll('.filter-options input');
  const artItems = document.querySelectorAll('.art-item');

  function filterArtItems() {
    // 没有过滤区直接返回
    if (!otherFilters || otherFilters.length === 0) return;

    const selectedFilters = Array.from(otherFilters)
      .filter(f => f.checked)
      .map(f => f.value);

    if (selectedFilters.length === 0) {
      if (allFilter) allFilter.checked = true;
      artItems.forEach(item => { item.style.display = 'block'; });
      return;
    }

    if (allFilter) allFilter.checked = false;

    artItems.forEach(item => {
      const tagsAttr = item.getAttribute('data-tags') || '';
      const itemTags = tagsAttr.split(',').map(s => s.trim()).filter(Boolean);
      const isMatch = selectedFilters.every(f => itemTags.includes(f));
      item.style.display = isMatch ? 'block' : 'none';
    });
  }

  if (allFilter) {
    allFilter.addEventListener('change', function() {
      if (this.checked) {
        otherFilters.forEach(f => { f.checked = false; });
        artItems.forEach(item => { item.style.display = 'block'; });
      }
    });
  }

  if (filterOptions && filterOptions.length) {
    filterOptions.forEach(option => {
      option.addEventListener('change', filterArtItems);
    });
    // 若有默认选中项，初次加载时应用一次
    if (Array.from(otherFilters).some(f => f.checked)) filterArtItems();
  }

  /* ============== 卡片跳转（无论是否有过滤/视频都能工作） ============== */
  // 支持两种写法：
  // 1) <a class="art-item" href="..."> 原生跳转（推荐）
  // 2) <div class="art-item" data-link="..."> JS 跳转
  artItems.forEach(item => {
    // 如果本身就是 <a>，交给浏览器默认行为
    if (item.tagName.toLowerCase() === 'a') return;

    // 让 div 卡片也可键盘访问
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
    if (!item.hasAttribute('role')) item.setAttribute('role', 'link');

    item.addEventListener('click', function() {
      const link = item.getAttribute('data-link');
      if (link) window.location.href = link;
    });

    item.addEventListener('keydown', function(e) {
      if (e.code === 'Enter' || e.code === 'Space') {
        const link = item.getAttribute('data-link');
        if (link) {
          e.preventDefault();
          window.location.href = link;
        }
      }
    });
  });

  /* ============== 悬停视频（存在才启用） ============== */
  const hoverVideoContainer = document.querySelector('.hover-video-container');
  if (hoverVideoContainer) {
    const hoverVideo = hoverVideoContainer.querySelector('.hover-video');
    const iframe = hoverVideo ? hoverVideo.querySelector('iframe') : null;

    if (hoverVideo && iframe) {
      const baseSrc = iframe.src; // 原始 src（不带 autoplay）

      hoverVideoContainer.addEventListener('mousemove', function(e) {
        hoverVideo.style.display = 'block';
        hoverVideo.style.left = `${e.clientX - hoverVideo.offsetWidth / 2}px`;
        hoverVideo.style.top  = `${e.clientY - hoverVideo.offsetHeight / 2}px`;
        if (!iframe.src.includes('autoplay=1')) {
          const join = baseSrc.includes('?') ? '&' : '?';
          iframe.src = baseSrc + join + 'autoplay=1';
        }
      });

      hoverVideoContainer.addEventListener('mouseleave', function() {
        hoverVideo.style.display = 'none';
        iframe.src = baseSrc; // 重置来停止播放
      });
    }
  }
});

