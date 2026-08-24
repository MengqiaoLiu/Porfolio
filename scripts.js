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
    overlay.style.backgroundColor = `${randomColor}1F`; // 透明度约12%
  });

  /* ============== 中英文切换（首页与 About） ============== */
  const translations = {
    'title-home': {
      en: 'Mengqiao Liu - Art Portfolio',
      zh: '刘梦乔 — 艺术作品集'
    },
    'title-about': {
      en: 'About - Mengqiao Liu',
      zh: '关于 — 刘梦乔'
    },
    'nav-about': { en: 'About', zh: '关于' },
    'action-close': { en: 'Close', zh: '关闭' },
    'about-greeting': {
      en: 'Hi 👋 I’m Mengqiao Liu.',
      zh: '你好 👋，我是刘梦乔。'
    },
    'about-summary': {
      en: 'A designer and developer exploring how technology can enrich human experience and emotion.',
      zh: '我是一名设计师和开发者，探索技术如何丰富人的体验与情感。'
    },
    'about-study': {
      en: 'I am currently pursuing a Master’s degree in New Media at Aalto University while interning at BMW. My portfolio reflects my explorations of the fusion between digital and physical, though some BMW projects remain confidential.',
      zh: '我目前在阿尔托大学攻读新媒体硕士学位，同时在宝马实习。我的作品集记录了我对数字与物理融合的探索，其中部分宝马项目因保密要求无法公开。'
    },
    'about-current': {
      en: '<strong>Currently:</strong> Creative Technologist Intern @ BMW, Munich.',
      zh: '<strong>目前：</strong> 宝马创意技术实习生，德国慕尼黑。'
    },
    'about-exhibitions': {
      en: '<strong>Exhibitions</strong>',
      zh: '<strong>展览</strong>'
    },
    'about-exhibition-2025': {
      en: '2025<br><strong>Waves of Digital Sculpture</strong> — Äänen Lumo, Helsinki, Finland',
      zh: '2025<br><strong>Waves of Digital Sculpture</strong> — Äänen Lumo，芬兰赫尔辛基'
    },
    'about-exhibition-2024': {
      en: '2024<br><strong>Ibero-American Design Biennial</strong> — Surface, Madrid, Spain',
      zh: '2024<br><strong>伊比利亚-美洲设计双年展</strong> — Surface，西班牙马德里'
    },
    'Research on motions': { en: 'Research on motions', zh: '动态设计研究' },
    '#Research': { en: '#Research', zh: '#研究' },
    '#Motions': { en: '#Motions', zh: '#动效' },
    '#Design&Development': { en: '#Design&Development', zh: '#设计与开发' },
    '#Interactive Art': { en: '#Interactive Art', zh: '#互动艺术' },
    '#Game & Spatial Perception': { en: '#Game & Spatial Perception', zh: '#游戏与空间感知' },
    'You might like...(猜你喜欢)': { en: 'You might like...(猜你喜欢)', zh: '猜你喜欢……' },
    '#Data Privacy & AI generate': { en: '#Data Privacy & AI generate', zh: '#数据隐私与AI生成' },
    '#Identity & data extraction': { en: '#Identity & data extraction', zh: '#身份与数据提取' },
    'Behind the Mirror': { en: 'Behind the Mirror', zh: '镜后' },
    '#Social Dilemma & Three-Way Handshake': { en: '#Social Dilemma & Three-Way Handshake', zh: '#社交困境与三次握手' },
    'Kwai recruitment business payment function': { en: 'Kwai recruitment business payment function', zh: '快手招聘业务支付功能' },
    '#App & Web & Software': { en: '#App & Web & Software', zh: '#App、网页与软件' },
    'Kwai Spring Festival blind date': { en: 'Kwai Spring Festival blind date', zh: '快手春节相亲' }
  };

  let currentLanguage = 'en';
  const languageSwitcher = document.querySelector('.language-switcher');

  function getNdaMessage(item) {
    if (!item) return '';
    return item.getAttribute(`data-nda-message-${currentLanguage}`)
      || item.getAttribute('data-nda-message-en')
      || '';
  }

  if (languageSwitcher) {
    const languageButtons = languageSwitcher.querySelectorAll('[data-language]');
    const translatableElements = Array.from(document.querySelectorAll('[data-i18n-key]'));

    document.querySelectorAll('.art-item h3 .left, .art-item > p').forEach(element => {
      const key = element.textContent.trim();
      if (translations[key] && !element.hasAttribute('data-i18n-key')) {
        element.setAttribute('data-i18n-key', key);
        translatableElements.push(element);
      }
    });

    function applyLanguage(language, persist = true) {
      currentLanguage = language === 'zh' ? 'zh' : 'en';
      document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';

      translatableElements.forEach(element => {
        const translation = translations[element.getAttribute('data-i18n-key')];
        if (!translation || !translation[currentLanguage]) return;

        if (element.hasAttribute('data-i18n-html')) {
          element.innerHTML = translation[currentLanguage];
        } else {
          element.textContent = translation[currentLanguage];
        }
      });

      languageButtons.forEach(button => {
        const isActive = button.getAttribute('data-language') === currentLanguage;
        button.setAttribute('aria-pressed', String(isActive));
        button.setAttribute(
          'aria-label',
          button.getAttribute('data-language') === 'zh' ? '切换为中文' : 'Switch to English'
        );
      });

      languageSwitcher.setAttribute(
        'aria-label',
        currentLanguage === 'zh' ? '语言选择' : 'Language selection'
      );

      const ndaProject = document.querySelector('[data-nda-message-en]');
      const ndaMessage = document.getElementById('nda-dialog-message');
      if (ndaProject && ndaMessage) ndaMessage.textContent = getNdaMessage(ndaProject);

      if (persist) {
        try {
          window.localStorage.setItem('portfolio-language', currentLanguage);
        } catch (error) {
          // 禁用本地存储时，当前页面的切换仍然可用。
        }
      }
    }

    languageButtons.forEach(button => {
      button.addEventListener('click', function() {
        applyLanguage(button.getAttribute('data-language'));
      });
    });

    let savedLanguage = 'en';
    try {
      savedLanguage = window.localStorage.getItem('portfolio-language') || 'en';
    } catch (error) {
      // 使用默认英文。
    }
    applyLanguage(savedLanguage, false);
  }

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
  const ndaDialog = document.getElementById('nda-dialog');
  const ndaDialogMessage = document.getElementById('nda-dialog-message');

  function showNdaDialog(item) {
    const message = getNdaMessage(item);
    if (!ndaDialog || typeof ndaDialog.showModal !== 'function') {
      window.alert(message);
      return;
    }

    if (ndaDialogMessage) ndaDialogMessage.textContent = message;
    if (!ndaDialog.open) ndaDialog.showModal();
  }

  artItems.forEach(item => {
    const hasNdaMessage = item.hasAttribute('data-nda-message-en');
    const link = item.getAttribute('data-link');

    if (hasNdaMessage) {
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-haspopup', 'dialog');
      item.setAttribute('aria-controls', 'nda-dialog');

      item.addEventListener('click', function() {
        showNdaDialog(item);
      });

      item.addEventListener('keydown', function(e) {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          showNdaDialog(item);
        }
      });
      return;
    }

    // 如果本身就是 <a>，交给浏览器默认行为
    if (item.tagName.toLowerCase() === 'a') return;

    // 无链接的普通卡片不需要交互语义
    if (!link) return;

    // 让 div 卡片也可键盘访问
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
    if (!item.hasAttribute('role')) item.setAttribute('role', 'link');

    item.addEventListener('click', function() {
      if (link) window.location.href = link;
    });

    item.addEventListener('keydown', function(e) {
      if (e.code === 'Enter' || e.code === 'Space') {
        if (link) {
          e.preventDefault();
          window.location.href = link;
        }
      }
    });
  });

  /* ============== 项目卡片动态封面 ============== */
  const prefersReducedMotion = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.querySelectorAll('.art-item img[data-hover-src]').forEach(image => {
      const card = image.closest('.art-item');
      const defaultSrc = image.getAttribute('src');
      const hoverSrc = image.getAttribute('data-hover-src');

      if (!card || !defaultSrc || !hoverSrc) return;

      // 提前缓存 GIF，避免首次 hover 时闪白。
      const preloadedCover = new Image();
      preloadedCover.src = hoverSrc;

      let isHovered = false;
      let isFocused = false;

      function updateCover() {
        image.setAttribute('src', isHovered || isFocused ? hoverSrc : defaultSrc);
      }

      card.addEventListener('mouseenter', function() {
        isHovered = true;
        updateCover();
      });

      card.addEventListener('mouseleave', function() {
        isHovered = false;
        updateCover();
      });

      card.addEventListener('focusin', function() {
        isFocused = true;
        updateCover();
      });

      card.addEventListener('focusout', function() {
        isFocused = false;
        updateCover();
      });
    });
  }

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
