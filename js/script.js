(function () {
  "use strict";

  var contactEmail = "antonioconti@officinadelmakeup.it";
  var vatNumber = "04308400136";
  var openingHours = [
    { day: "Lunedì", intervals: [[510, 750], [870, 1140]] },
    { day: "Martedì", intervals: [[510, 750], [900, 1140]] },
    { day: "Mercoledì", intervals: [[510, 750], [900, 1140]] },
    { day: "Giovedì", intervals: [[510, 750], [900, 1140]] },
    { day: "Venerdì", intervals: [[510, 750], [900, 1140]] },
    { day: "Sabato", intervals: [[540, 750]] },
    { day: "Domenica", intervals: [] }
  ];

  function isOpenNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Rome",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date()).reduce(function (values, part) {
      values[part.type] = part.value;
      return values;
    }, {});
    var day = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[parts.weekday];
    var minutes = Number(parts.hour) * 60 + Number(parts.minute);
    return openingHours[day].intervals.some(function (interval) {
      return minutes >= interval[0] && minutes < interval[1];
    });
  }

  function renderFooterDetails() {
    var isOpen = isOpenNow();
    var statusText = isOpen ? "Siamo aperti" : "Siamo chiusi";
    var statusClass = isOpen ? "is-open" : "is-closed";
    var year = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome",
      year: "numeric"
    }).format(new Date());

    document.querySelectorAll("[data-hours-status]").forEach(function (status) {
      status.className = "hours-status " + statusClass;
      status.innerHTML = '<span class="status-dot"></span><strong>' +
        (isOpen ? "Ora siamo aperti, vieni a trovarci!" : "Ora siamo chiusi") +
        '</strong>';
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      link.href = "mailto:" + contactEmail;
      link.textContent = contactEmail;
    });

    document.querySelectorAll('a[href="cookie.html"]').forEach(function (link) {
      link.remove();
    });

    var contactDetails = document.querySelector(".contact-details");
    if (contactDetails && !contactDetails.querySelector(".contact-social")) {
      contactDetails.insertAdjacentHTML("beforeend",
        '<div class="contact-item"><small>P. IVA</small><span>04308400136</span></div>' +
        '<div class="contact-item contact-social"><small>Seguici</small><a href="https://www.facebook.com/officinadelmakeup" target="_blank" rel="noopener">Facebook</a><span> · </span><a href="https://www.instagram.com/officinadelmakeup" target="_blank" rel="noopener">Instagram</a></div>');
    }

    document.querySelectorAll(".site-footer").forEach(function (footer) {
      var contactList = footer.querySelectorAll(".footer-links")[1];
      if (contactList && !contactList.querySelector(".footer-vat")) {
        contactList.insertAdjacentHTML("beforeend",
          '<li class="footer-vat">P. IVA: ' + vatNumber + '</li>' +
          '<li><a href="https://www.facebook.com/officinadelmakeup" target="_blank" rel="noopener">Facebook</a></li>' +
          '<li><a href="https://www.instagram.com/officinadelmakeup" target="_blank" rel="noopener">Instagram</a></li>');
      }

      if (!footer.querySelector(".footer-hours")) {
        var hours = document.createElement("div");
        hours.className = "footer-hours";
        hours.innerHTML =
          '<p class="footer-title">Orari</p>' +
          '<div class="footer-status ' + statusClass + '"><span class="status-dot"></span><span>' + statusText + '</span></div>' +
          '<div class="footer-hours-list">' +
          '<span>Lun 08:30 - 12:30 / 14:30 - 19:00</span>' +
          '<span>Mar - Ven 08:30 - 12:30 / 15:00 - 19:00</span>' +
          '<span>Sab 09:00 - 12:30</span>' +
          '<span>Dom Chiuso</span>' +
          '</div>';
        footer.querySelector(".footer-top").appendChild(hours);
      }

      var copyright = footer.querySelector(".footer-copyright");
      if (copyright) {
        copyright.textContent = "© " + year + " Officina del Make-Up di Antonio Conti";
      }
      var legalLinks = footer.querySelector(".footer-bottom > span:last-child");
      if (legalLinks) {
        legalLinks.innerHTML = '<a href="privacy.html">Privacy Policy</a>';
      }
    });
  }

  function initBrandCarousel() {
    var carousel = document.querySelector("[data-brand-carousel]");
    if (!carousel) return;

    var viewport = carousel.querySelector(".brand-viewport");
    var cards = Array.prototype.slice.call(carousel.querySelectorAll(".brand-card"));
    var previous = carousel.querySelector("[data-brand-prev]");
    var next = carousel.querySelector("[data-brand-next]");
    var timer;

    function cardStep() {
      if (!cards.length) return 0;
      var gap = parseFloat(window.getComputedStyle(viewport.querySelector(".brand-track")).columnGap) || 16;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function move(direction) {
      var step = cardStep();
      if (!step) return;
      var atStart = viewport.scrollLeft <= 4;
      var atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;
      if (direction > 0 && atEnd) {
        viewport.scrollTo({ left: 0, behavior: "smooth" });
      } else if (direction < 0 && atStart) {
        viewport.scrollTo({ left: viewport.scrollWidth, behavior: "smooth" });
      } else {
        viewport.scrollBy({ left: direction * step, behavior: "smooth" });
      }
    }

    function startAutoplay() {
      window.clearInterval(timer);
      timer = window.setInterval(function () { move(1); }, 3000);
    }

    if (previous) previous.addEventListener("click", function () { move(-1); startAutoplay(); });
    if (next) next.addEventListener("click", function () { move(1); startAutoplay(); });
    carousel.addEventListener("mouseenter", function () { window.clearInterval(timer); });
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", function () { window.clearInterval(timer); });
    carousel.addEventListener("focusout", startAutoplay);
    startAutoplay();
  }

  function initTicker() {
    var ticker = document.querySelector(".ticker-track");
    var sequence = ticker && ticker.querySelector(".ticker-sequence");
    if (!ticker || !sequence) return;

    function setDistance() {
      var sequenceWidth = sequence.getBoundingClientRect().width;
      var viewportWidth = ticker.parentElement ? ticker.parentElement.clientWidth : window.innerWidth;

      while (ticker.scrollWidth < viewportWidth + sequenceWidth) {
        var clone = sequence.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        ticker.appendChild(clone);
      }

      ticker.style.setProperty("--ticker-end", "-" + sequenceWidth + "px");
    }

    setDistance();
    window.addEventListener("resize", setDistance);
  }

  function initReviewCounter() {
    var counter = document.querySelector("[data-review-counter]");
    if (!counter) return;

    var reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      counter.textContent = "100%";
      return;
    }

    var started = false;

    function animate() {
      if (started) return;
      started = true;

      var startTime = null;
      var duration = 2000;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        counter.textContent = Math.round(progress * 100) + "%";
        if (progress < 1) window.requestAnimationFrame(step);
      }

      window.requestAnimationFrame(step);
    }

    counter.textContent = "0%";

    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      counterObserver.observe(counter);
    } else {
      animate();
    }
  }

  function getConfiguredNews(fallback) {
    var configured = window.NOTIZIE;
    if (Array.isArray(configured)) return configured;
    if (configured && Array.isArray(configured.notizie)) return configured.notizie;
    return fallback;
  }

  function getNewsFilePath(file) {
    var name = String(file || "").trim().replace(/\\/g, "/");
    name = name.replace(/^(\.\/)?uploads\//i, "").replace(/^\/+/, "");
    name = name.split("/").filter(function (part) {
      return part && part !== "." && part !== "..";
    }).map(encodeURIComponent).join("/");
    return "UPLOADS/" + name + "?v=" + Date.now();
  }

  function captureVideoPoster(video) {
    var captured = false;

    function capture() {
      if (captured || !video.videoWidth || !video.videoHeight) return;
      var canvas = document.createElement("canvas");
      var maxWidth = 1280;
      var scale = Math.min(1, maxWidth / video.videoWidth);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      try {
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        video.poster = canvas.toDataURL("image/jpeg", .82);
        captured = true;
      } catch (error) {
        return;
      }
    }

    video.addEventListener("loadeddata", capture);
    video.addEventListener("canplay", capture);
  }

  function addVideoIndicator(container, video) {
    var playIndicator = document.createElement("span");
    playIndicator.className = "news-video-play";
    playIndicator.setAttribute("aria-hidden", "true");
    video.addEventListener("play", function () {
      playIndicator.classList.add("is-hidden");
    });
    video.addEventListener("pause", function () {
      playIndicator.classList.remove("is-hidden");
    });
    container.appendChild(playIndicator);
  }

  function initNews() {
    var grid = document.querySelector("[data-news-grid]");
    var modal = document.querySelector("[data-news-modal]");
    if (!grid || !modal) return;

    var status = document.querySelector("[data-news-status]");
    var modalMedia = modal.querySelector("[data-news-modal-media]");
    var modalTitle = modal.querySelector("[data-news-modal-title]");
    var modalDescription = modal.querySelector("[data-news-modal-description]");
    var closeButtons = modal.querySelectorAll("[data-news-close]");
    var lastFocusedElement;
    var videoExtensions = /\.(mp4|webm|ogg|mov|m4v)$/i;
    var fallbackNews = [{
      nomeNotizia: "Nuovi arrivi beauty in negozio",
      descrizione: "È arrivata una selezione di nuovi prodotti professionali per capelli, make-up ed estetica. Passa a trovarci in negozio: saremo felici di aiutarti a trovare la soluzione più adatta alle tue esigenze.",
      file: "novita-test.svg",
      tipo: "immagine"
    }];

    function isVideo(news) {
      return String(news.tipo || "").toLowerCase() === "video" ||
        videoExtensions.test(String(news.file || ""));
    }

    function createMedia(news, forModal) {
      var media;
      var source = getNewsFilePath(news.file);
      if (isVideo(news)) {
        media = document.createElement("video");
        media.src = source;
        media.setAttribute("playsinline", "");
        media.preload = "auto";
        media.muted = !forModal;
        if (forModal) media.controls = true;
        captureVideoPoster(media);
        media.load();
      } else {
        media = document.createElement("img");
        media.src = source;
        media.alt = news.nomeNotizia || "Immagine della novità";
        if (!forModal) media.loading = "lazy";
      }
      media.addEventListener("error", function () {
        var replacement = document.createElement("div");
        replacement.className = "news-media-missing";
        replacement.textContent = "File multimediale non disponibile";
        media.replaceWith(replacement);
      }, { once: true });
      return media;
    }

    function addDescription(container, description) {
      var text = String(description || "").trim();
      var paragraphs = text.split(/\n{2,}/);
      paragraphs.forEach(function (paragraph) {
        if (!paragraph.trim()) return;
        var element = document.createElement("p");
        element.textContent = paragraph.trim();
        container.appendChild(element);
      });
    }

    function renderCard(news, index) {
      var card = document.createElement("article");
      card.className = "news-card reveal";

      var mediaContainer = document.createElement("div");
      mediaContainer.className = "news-card-media";
      var cardMedia = createMedia(news, false);
      mediaContainer.appendChild(cardMedia);
      if (isVideo(news)) {
        addVideoIndicator(mediaContainer, cardMedia);
      }

      var mediaLabel = document.createElement("span");
      mediaLabel.className = "news-media-label";
      mediaLabel.textContent = isVideo(news) ? "Video" : "Foto";
      mediaContainer.appendChild(mediaLabel);

      var content = document.createElement("div");
      content.className = "news-card-content";

      var number = document.createElement("span");
      number.className = "news-card-index";
      number.textContent = String(index + 1).padStart(2, "0");

      var title = document.createElement("h3");
      title.textContent = news.nomeNotizia || "Senza titolo";

      var excerpt = document.createElement("p");
      excerpt.className = "news-card-excerpt";
      excerpt.textContent = String(news.descrizione || "").trim();

      var button = document.createElement("button");
      button.className = "text-link";
      button.type = "button";
      button.textContent = "Leggi tutto...";
      button.addEventListener("click", function () {
        openModal(news, button);
      });

      card.addEventListener("click", function (event) {
        if (event.target.closest && event.target.closest("button")) return;
        openModal(news, button);
      });

      content.appendChild(number);
      content.appendChild(title);
      content.appendChild(excerpt);
      content.appendChild(button);
      card.appendChild(mediaContainer);
      card.appendChild(content);
      return card;
    }

    function render(newsItems) {
      grid.replaceChildren();
      newsItems.forEach(function (news, index) {
        grid.appendChild(renderCard(news, index));
      });
      grid.querySelectorAll(".reveal").forEach(function (item, itemIndex) {
        window.setTimeout(function () { item.classList.add("visible"); }, itemIndex * 35);
      });
      if (status) status.textContent = newsItems.length ? "" : "Nessuna novità disponibile al momento.";
    }

    function openModal(news, trigger) {
      lastFocusedElement = trigger || document.activeElement;
      var media = createMedia(news, true);
      modalMedia.replaceChildren(media);
      if (isVideo(news)) addVideoIndicator(modalMedia, media);
      modalTitle.textContent = news.nomeNotizia || "Senza titolo";
      modalDescription.replaceChildren();
      addDescription(modalDescription, news.descrizione);
      modal.hidden = false;
      document.body.classList.add("news-modal-open");
      var close = modal.querySelector(".news-modal-close");
      if (close) close.focus();
    }

    function closeModal() {
      var activeVideo = modalMedia.querySelector("video");
      if (activeVideo) {
        activeVideo.pause();
        activeVideo.currentTime = 0;
      }
      modal.hidden = true;
      document.body.classList.remove("news-modal-open");
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });

    render(getConfiguredNews(fallbackNews));
  }

  function initHomeNews() {
    var mediaContainer = document.querySelector("[data-home-news-media]");
    var title = document.querySelector("[data-home-news-title]");
    var description = document.querySelector("[data-home-news-description]");
    if (!mediaContainer || !title || !description) return;

    var videoExtensions = /\.(mp4|webm|ogg|mov|m4v)$/i;
    var fallbackNews = {
      nomeNotizia: "Nuovi arrivi beauty in negozio",
      descrizione: "È arrivata una selezione di nuovi prodotti professionali per capelli, make-up ed estetica.",
      file: "novita-test.svg",
      tipo: "immagine"
    };

    function render(news) {
      var file = String(news.file || "");
      var media;
      if (String(news.tipo || "").toLowerCase() === "video" || videoExtensions.test(file)) {
        media = document.createElement("video");
        media.src = getNewsFilePath(file);
        media.muted = true;
        media.loop = true;
        media.autoplay = true;
        media.setAttribute("playsinline", "");
        media.preload = "auto";
        captureVideoPoster(media);
        media.load();
      } else {
        media = document.createElement("img");
        media.src = getNewsFilePath(file);
        media.alt = news.nomeNotizia || "Immagine della novità";
        media.loading = "lazy";
      }
      mediaContainer.replaceChildren(media);
      if (String(news.tipo || "").toLowerCase() === "video" || videoExtensions.test(file)) {
        addVideoIndicator(mediaContainer, media);
      }
      title.textContent = news.nomeNotizia || "Senza titolo";
      description.textContent = String(news.descrizione || "").trim();
    }

    var newsItems = getConfiguredNews([fallbackNews]);
    render(newsItems.length ? newsItems[0] : fallbackNews);
  }

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("open", !isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
      });
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    var observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  }

  renderFooterDetails();
  initBrandCarousel();
  initTicker();
  initReviewCounter();
  initNews();
  initHomeNews();
  window.setInterval(renderFooterDetails, 60000);
}());