// Gallery Carousel Implementation (現在無効化されています)
/*
class GalleryCarousel {
  constructor(container, options = {}) {
    this.container = container;
    this.slidesContainer = container.querySelector(".carousel-slides");
    this.slides = container.querySelectorAll(".carousel-slide");
    this.prevBtn = container.querySelector(".prev-btn");
    this.nextBtn = container.querySelector(".next-btn");
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.options = {
      slidesToShow: options.slidesToShow || 3,
      autoPlay: options.autoPlay || false,
      autoPlayInterval: options.autoPlayInterval || 5000,
      ...options,
    };

    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    // Setup carousel structure for sliding effect
    this.setupCarousel();

    // Add event listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.previousSlide());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextSlide());
    }

    // Auto play
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }

    // Pause auto play on hover
    this.container.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.container.addEventListener("mouseleave", () => {
      if (this.options.autoPlay) {
        this.startAutoPlay();
      }
    });

    // Handle resize
    window.addEventListener("resize", () => {
      this.calculateSlideWidth();
      this.updateSlidePosition();
    });
  }

  setupCarousel() {
    this.calculateSlideWidth();
    this.updateSlidePosition();
  }

  calculateSlideWidth() {
    if (this.slidesContainer && this.slides.length > 0) {
      this.slideWidth = this.slidesContainer.offsetWidth / this.options.slidesToShow;
    }
  }

  updateSlidePosition() {
    if (this.slidesContainer) {
      const translateX = -this.currentIndex * this.slideWidth;
      this.slidesContainer.style.transform = `translateX(${translateX}px)`;
    }
  }

  nextSlide() {
    const maxIndex = Math.max(0, this.slides.length - this.options.slidesToShow);
    this.currentIndex = Math.min(this.currentIndex + 1, maxIndex);
    this.updateSlidePosition();
  }

  previousSlide() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
    this.updateSlidePosition();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
      // Reset to start when reaching the end
      if (this.currentIndex >= this.slides.length - this.options.slidesToShow) {
        setTimeout(() => {
          this.currentIndex = 0;
          this.updateSlidePosition();
        }, 2000);
      }
    }, this.options.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}
*/

// 安全な通知システム
class SafeNotification {
  constructor() {
    this.notificationContainer = null;
    this.init();
  }

  init() {
    this.createNotificationContainer();
  }

  createNotificationContainer() {
    this.notificationContainer = document.createElement("div");
    this.notificationContainer.id = "notification-container";
    this.notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    `;
    document.body.appendChild(this.notificationContainer);
  }

  show(message, type = "info", duration = 5000) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      background: ${type === "error" ? "#f44336" : type === "success" ? "#4caf50" : "#2196f3"};
      color: white;
      padding: 16px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      word-wrap: break-word;
    `;

    // 安全なテキストコンテンツの設定
    notification.textContent = message;

    this.notificationContainer.appendChild(notification);

    // アニメーション
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // 自動削除
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }
}

// グローバル通知インスタンス
const safeNotification = new SafeNotification();

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Button interactions
function initButtonInteractions() {
  const buttons = document.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-1px)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
    });
  });
}

// Header scroll effect with performance optimization
function initHeaderScrollEffect() {
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");

  if (!header || !main) return;

  // スクロール処理の安定化のため、throttleを使用
  let ticking = false;
  let lastScrollY = window.scrollY;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    // 初期ヘッダーの高さを計算（パディング含む）
    const isSmallMobile = window.innerWidth <= 400;
    const isMediumMobile = window.innerWidth <= 900;
    let initialHeaderHeight, scrolledHeaderHeight;

    if (isSmallMobile) {
      initialHeaderHeight = 68; // 16+36+16
      scrolledHeaderHeight = 52; // 8+36+8
    } else if (isMediumMobile) {
      initialHeaderHeight = 156; // 40+36+80（基本と同じ）
      scrolledHeaderHeight = 52; // 8+36+8
    } else {
      initialHeaderHeight = 156; // 40+36+80
      scrolledHeaderHeight = 52; // 8+36+8
    }

    // スクロール閾値を設定（初期ヘッダー高さの半分程度）
    const scrollThreshold = initialHeaderHeight * 0.6;

    if (currentScrollY > scrollThreshold) {
      // スクロールダウン：固定ヘッダー
      if (!header.classList.contains("scrolled")) {
        header.classList.add("scrolled");
        main.style.marginTop = `${scrolledHeaderHeight}px`;
      }
    } else {
      // スクロールアップまたは上部：初期ヘッダー
      if (header.classList.contains("scrolled")) {
        header.classList.remove("scrolled");
        main.style.marginTop = "0";
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  // パッシブリスナーでパフォーマンス向上
  window.addEventListener("scroll", requestTick, { passive: true });

  // リサイズ時も再計算
  window.addEventListener("resize", () => {
    if (header.classList.contains("scrolled")) {
      const isSmallMobile = window.innerWidth <= 400;
      let scrolledHeaderHeight;

      if (isSmallMobile) {
        scrolledHeaderHeight = 52;
      } else {
        scrolledHeaderHeight = 52;
      }

      main.style.marginTop = `${scrolledHeaderHeight}px`;
    }
  });
}

// Intersection Observer for animations with performance optimization
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        // 一度表示されたら監視を停止
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for fade-in animations
  const sections = document.querySelectorAll("section, .feature-card, .experience-card");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });
}

// SVGアイコンの挿入関数（現在無効化されています）
/*
function createArrowSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
 
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M18 15l-6-6-6 6");
 
  svg.appendChild(path);
  return svg;
}
*/

function createHamburgerSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "15");
  svg.setAttribute("viewBox", "0 0 20 15");
  svg.setAttribute("fill", "none");

  // 3つの線を作成
  for (let i = 0; i < 3; i++) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "20");
    rect.setAttribute("height", "2");
    rect.setAttribute("y", i * 6.5);
    rect.setAttribute("fill", "currentColor");
    svg.appendChild(rect);
  }

  return svg;
}

// SVGアイコンを挿入する関数
function insertSVGIcons() {
  // ハンバーガーメニューのアイコン
  const hamburgerBtn = document.querySelector(".hamburger-menu");
  if (hamburgerBtn && !hamburgerBtn.querySelector("svg")) {
    hamburgerBtn.appendChild(createHamburgerSVG());
  }

  // ナビゲーションボタンのアイコン（現在コメントアウト中）
  /*
  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach((btn) => {
    if (!btn.querySelector("svg")) {
      btn.appendChild(createArrowSVG());
    }
  });
  */
}

// ページ読み込み時のフェードインアニメーション
function initFadeInAnimation() {
  // ページが完全に読み込まれた後にアニメーションを開始
  window.addEventListener("load", function () {
    // 少し遅延させてからアニメーション開始
    setTimeout(() => {
      const fadeElements = document.querySelectorAll(".fade-in");

      // Intersection Observerを使用して要素が画面に入ったときにアニメーション
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        {
          threshold: 0.1, // 要素の10%が見えたら発火
          rootMargin: "0px 0px -50px 0px", // 少し早めに発火
        }
      );

      // 各要素を監視
      fadeElements.forEach((element) => {
        observer.observe(element);
      });

      // 最初の要素は即座に表示（ヘッダーなど）
      const firstElements = document.querySelectorAll(".fade-in-delay-1, .fade-in-delay-2");
      firstElements.forEach((element) => {
        setTimeout(() => {
          element.classList.add("visible");
        }, 50); // 50msに短縮
      });
    }, 150); // 150msに短縮
  });
}

// ページ読み込み時のアニメーション初期化
initFadeInAnimation();

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // SVGアイコンを挿入
  insertSVGIcons();

  // カルーセル機能は現在無効化されています
  /*
  // Initialize gallery carousels
  const galleryContainers = document.querySelectorAll(".gallery-carousel");
  galleryContainers.forEach((container, index) => {
    // レスポンシブに応じてスライド数を調整
    const updateSlidesToShow = () => {
      if (window.innerWidth <= 400) return 2;
      if (window.innerWidth <= 900) return 2;
      return 3;
    };

    new GalleryCarousel(container, {
      slidesToShow: updateSlidesToShow(),
      autoPlay: false,
      autoPlayInterval: 4000,
    });

    // ウィンドウリサイズ時に再初期化
    window.addEventListener("resize", () => {
      const newSlidesToShow = updateSlidesToShow();
      // カルーセルインスタンスの設定を更新
      if (container.carousel && container.carousel.updateSlidesToShow) {
        container.carousel.updateSlidesToShow(newSlidesToShow);
      }
    });
  });
  */

  // Initialize other features
  initSmoothScrolling();
  initButtonInteractions();
  initHeaderScrollEffect();
  initScrollAnimations();

  // Add click handlers for CTA buttons with safe notifications
  const ctaButtons = document.querySelectorAll(".cta-button, .cta-button-large");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      safeNotification.show("予約機能は現在開発中です。お問い合わせください。", "info");
    });
  });

  // Add click handlers for gallery buttons with safe notifications
  const galleryButtons = document.querySelectorAll(".view-gallery-btn, .experience-btn");
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent.trim();
      if (buttonText.includes("Gallery")) {
        safeNotification.show("ギャラリーページは現在開発中です。", "info");
      } else {
        safeNotification.show("詳細ページは現在開発中です。", "info");
      }
    });
  });

  // Mobile Fixed CTA Button Event with safe notifications
  const mobileCTAButton = document.querySelector(".mobile-cta-button");
  if (mobileCTAButton) {
    mobileCTAButton.addEventListener("click", () => {
      safeNotification.show("予約ページは現在開発中です。", "info");
    });
  }
});
