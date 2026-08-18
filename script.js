(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const data = window.STUDIO_DATA;
  if (!data || !Array.isArray(data.projects)) {
    return;
  }

  const page = document.body.dataset.page || "";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const filterLabels = {
    "horse-ranch-editorial-shoot": "At Çiftliği",
    "cici-barber-editorial-shoot": "Cici Berber",
    "shoemaker-ayakkabici-muharrem-editorial-shoot": "Ayakkabıcı",
    "football-match-shoot": "Futbol",
    "product-shoots": "Ürün",
    "view-shoots": "Sokak",
    "youve-been-living-in-a-dream-world-neo": "Neo",
    "absolute-cinema": "Absolute Cinema"
  };
  const altDescriptions = {
    "horse-ranch-editorial-shoot": "Horse Ranch çiftlik editoryal portre serisi",
    "cici-barber-editorial-shoot": "Cici Barber berber dükkânı editoryal serisi",
    "shoemaker-ayakkabici-muharrem-editorial-shoot": "Ayakkabıcı Muharrem zanaat editoryal serisi",
    "football-match-shoot": "Futbol maçı fotoğraf serisi",
    "product-shoots": "Ürün ve takı çekimi serisi",
    "view-shoots": "Bursa sokak ve yaşam fotoğraf serisi",
    "youve-been-living-in-a-dream-world-neo": "You've been living in a dream world, Neo gece moda portresi serisi",
    "absolute-cinema": "Absolute Cinema siyah-beyaz editoryal portre serisi"
  };
  const galleryPreviews = {
    "assets/Horse Ranch Editorial Shoot/akay1.JPG": {
      path: "previews/horse-ranch/akay1.jpg",
      width: 1137,
      height: 1600
    },
    "assets/Horse Ranch Editorial Shoot/akay2.JPG": {
      path: "previews/horse-ranch/akay2.jpg",
      width: 1086,
      height: 1600
    },
    "assets/Horse Ranch Editorial Shoot/IMG_4414.jpeg": {
      path: "previews/horse-ranch/img-4414.jpg",
      width: 1600,
      height: 1067
    },
    "assets/Horse Ranch Editorial Shoot/IMG_4448.jpg": {
      path: "previews/horse-ranch/img-4448.jpg",
      width: 1162,
      height: 1600
    },
    "assets/Horse Ranch Editorial Shoot/IMG_4449.jpg": {
      path: "previews/horse-ranch/img-4449.jpg",
      width: 1162,
      height: 1600
    },
    "assets/Horse Ranch Editorial Shoot/IMG_67571.JPG": {
      path: "previews/horse-ranch/img-67571.jpg",
      width: 1280,
      height: 1600
    },
    "assets/Horse Ranch Editorial Shoot/WhatsApp Image 2026-07-06 at 13.53.49.jpeg": {
      path: "previews/horse-ranch/whatsapp-2026-07-06-135349.jpg",
      width: 1067,
      height: 1600
    }
  };

  function assetUrl(path) {
    return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  }

  function projectUrl(slug) {
    return `project.html?project=${encodeURIComponent(slug)}`;
  }

  function padNumber(number) {
    return String(number).padStart(2, "0");
  }

  function imageByPath(project, path) {
    return project.images.find((image) => image.path === path) || project.images[0];
  }

  function setImageAttributes(imageElement, image, options) {
    const settings = options || {};
    const preview = galleryPreviews[image.path];
    const displayImage = preview || image;
    imageElement.src = assetUrl(displayImage.path);
    imageElement.width = displayImage.width;
    imageElement.height = displayImage.height;
    imageElement.alt = settings.alt || "";
    imageElement.decoding = "async";
    imageElement.loading = settings.eager ? "eager" : "lazy";

    if (settings.eager) {
      imageElement.setAttribute("fetchpriority", "high");
    }

    if (settings.position) {
      imageElement.style.objectPosition = settings.position;
    }
  }

  function setupHeader() {
    const header = document.querySelector("[data-header]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-nav]");
    const brand = header ? header.querySelector(".brand") : null;
    const pageRegions = [
      document.querySelector("main"),
      document.querySelector(".site-footer"),
      document.querySelector(".floating-contacts")
    ].filter(Boolean);

    if (header && header.classList.contains("site-header--overlay")) {
      const updateHeader = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 36);
      };
      updateHeader();
      window.addEventListener("scroll", updateHeader, { passive: true });
    }

    if (!toggle || !nav) {
      return;
    }

    const toggleLabel = toggle.querySelector(".sr-only");
    const navLinks = [...nav.querySelectorAll("a")];
    let focusBeforeMenu = null;

    const setPageInert = (inert) => {
      pageRegions.forEach((region) => {
        region.inert = inert;
      });
    };

    const closeMenu = (restoreFocus) => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      setPageInert(false);
      if (toggleLabel) {
        toggleLabel.textContent = "Menüyü aç";
      }
      if (restoreFocus && focusBeforeMenu instanceof HTMLElement) {
        focusBeforeMenu.focus();
      }
    };

    const openMenu = () => {
      document.dispatchEvent(new CustomEvent("site:close-contacts"));
      focusBeforeMenu = document.activeElement;
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      setPageInert(true);
      if (toggleLabel) {
        toggleLabel.textContent = "Menüyü kapat";
      }
      if (navLinks[0]) {
        navLinks[0].focus();
      }
    };

    const desktopViewport = window.matchMedia("(min-width: 761px)");
    const handleViewportChange = (event) => {
      if (event.matches && document.body.classList.contains("nav-open")) {
        closeMenu(false);
      }
    };
    if (typeof desktopViewport.addEventListener === "function") {
      desktopViewport.addEventListener("change", handleViewportChange);
    } else {
      desktopViewport.addListener(handleViewportChange);
    }

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      if (willOpen) {
        openMenu();
      } else {
        closeMenu(true);
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => closeMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (!document.body.classList.contains("nav-open")) {
        return;
      }

      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }

      if (event.key === "Tab") {
        const menuFocusables = [brand, toggle, ...navLinks].filter(Boolean);
        const first = menuFocusables[0];
        const last = menuFocusables[menuFocusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  let revealObserver;

  function revealElements(scope) {
    const root = scope || document;
    const targets = root.querySelectorAll(".reveal:not([data-reveal-ready]), .featured-card:not([data-reveal-ready]), .project-card:not([data-reveal-ready]), .gallery-item:not([data-reveal-ready])");

    if (!targets.length) {
      return;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => {
        target.dataset.revealReady = "true";
        target.classList.add("is-visible");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.06
      });
    }

    targets.forEach((target, index) => {
      target.dataset.revealReady = "true";
      target.style.transitionDelay = `${Math.min(index % 6, 4) * 55}ms`;
      revealObserver.observe(target);
    });
  }

  function createFeaturedCard(project, index) {
    const article = document.createElement("article");
    article.className = "featured-card";

    const link = document.createElement("a");
    link.href = projectUrl(project.slug);
    link.setAttribute("aria-label", `${project.name} projesini aç`);

    const imageWrap = document.createElement("div");
    imageWrap.className = "featured-card__image";

    const image = document.createElement("img");
    const cover = imageByPath(project, project.cover);
    setImageAttributes(image, cover, {
      alt: "",
      eager: index === 0,
      position: project.position
    });
    imageWrap.appendChild(image);

    const meta = document.createElement("div");
    meta.className = "featured-card__meta";

    const number = document.createElement("span");
    number.textContent = padNumber(index + 1);

    const title = document.createElement("h3");
    title.textContent = project.name;

    const count = document.createElement("small");
    count.textContent = `${padNumber(project.images.length)} kare ↗`;

    meta.append(number, title, count);
    link.append(imageWrap, meta);
    article.appendChild(link);
    return article;
  }

  function renderFeaturedProjects() {
    const container = document.querySelector("[data-featured-projects]");
    if (!container) {
      return;
    }

    [data.projects[0], data.projects[2], data.projects[5]].forEach((project, index) => {
      container.appendChild(createFeaturedCard(project, index));
    });
    revealElements(container);
  }

  function createProjectCard(project, index) {
    const article = document.createElement("article");
    article.className = "project-card";

    const link = document.createElement("a");
    link.className = "project-card__link";
    link.href = projectUrl(project.slug);
    link.setAttribute("aria-label", `${project.name} projesini keşfet`);

    const imageWrap = document.createElement("div");
    imageWrap.className = "project-card__image";

    const image = document.createElement("img");
    const cover = imageByPath(project, project.cover);
    setImageAttributes(image, cover, {
      alt: "",
      eager: index < 2,
      position: project.position
    });

    const shade = document.createElement("span");
    shade.className = "project-card__shade";
    shade.setAttribute("aria-hidden", "true");

    const number = document.createElement("span");
    number.className = "project-card__number";
    number.textContent = padNumber(index + 1);

    const discover = document.createElement("span");
    discover.className = "project-card__discover";
    discover.textContent = "KEŞFET";

    imageWrap.append(image, shade, number, discover);

    const meta = document.createElement("div");
    meta.className = "project-card__meta";

    const title = document.createElement("h2");
    title.textContent = project.name;

    const detail = document.createElement("p");
    detail.innerHTML = `${project.eyebrow}<br>${padNumber(project.images.length)} kare`;

    meta.append(title, detail);
    link.append(imageWrap, meta);
    article.appendChild(link);
    return article;
  }

  function renderProjectGrid() {
    const container = document.querySelector("[data-project-grid]");
    if (!container) {
      return;
    }

    data.projects.forEach((project, index) => {
      container.appendChild(createProjectCard(project, index));
    });
    revealElements(container);
  }

  const lightbox = {
    dialog: null,
    image: null,
    caption: null,
    entries: [],
    index: 0,
    returnFocus: null,

    ensure() {
      if (this.dialog) {
        return;
      }

      const dialog = document.createElement("dialog");
      dialog.className = "lightbox";
      dialog.setAttribute("aria-label", "Tam ekran fotoğraf görüntüleyici");

      const stage = document.createElement("div");
      stage.className = "lightbox__stage";

      const image = document.createElement("img");
      image.className = "lightbox__image";

      const close = document.createElement("button");
      close.className = "lightbox__close";
      close.type = "button";
      close.setAttribute("aria-label", "Görüntüleyiciyi kapat");
      close.textContent = "×";

      const previous = document.createElement("button");
      previous.className = "lightbox__nav lightbox__nav--prev";
      previous.type = "button";
      previous.setAttribute("aria-label", "Önceki fotoğraf");
      previous.textContent = "←";

      const next = document.createElement("button");
      next.className = "lightbox__nav lightbox__nav--next";
      next.type = "button";
      next.setAttribute("aria-label", "Sonraki fotoğraf");
      next.textContent = "→";

      const caption = document.createElement("p");
      caption.className = "lightbox__caption";
      caption.setAttribute("aria-live", "polite");

      stage.appendChild(image);
      dialog.append(stage, close, previous, next, caption);
      document.body.appendChild(dialog);

      close.addEventListener("click", () => dialog.close());
      previous.addEventListener("click", () => this.move(-1));
      next.addEventListener("click", () => this.move(1));
      stage.addEventListener("click", (event) => {
        if (event.target === stage) {
          dialog.close();
        }
      });
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          this.move(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          this.move(1);
        }
      });
      dialog.addEventListener("close", () => {
        document.body.classList.remove("lightbox-open");
        if (this.returnFocus) {
          this.returnFocus.focus();
        }
      });

      this.dialog = dialog;
      this.image = image;
      this.caption = caption;
      this.closeButton = close;
      this.previousButton = previous;
      this.nextButton = next;
    },

    open(entries, index, trigger) {
      this.ensure();
      document.dispatchEvent(new CustomEvent("site:close-contacts"));
      this.entries = entries;
      this.index = index;
      this.returnFocus = trigger;
      this.update();
      document.body.classList.add("lightbox-open");
      if (typeof this.dialog.showModal === "function") {
        this.dialog.showModal();
      } else {
        this.dialog.setAttribute("open", "");
      }
      this.closeButton.focus();
    },

    move(delta) {
      if (!this.entries.length) {
        return;
      }
      this.index = (this.index + delta + this.entries.length) % this.entries.length;
      this.update();
    },

    update() {
      const entry = this.entries[this.index];
      if (!entry) {
        return;
      }
      this.image.src = assetUrl(entry.image.path);
      this.image.width = entry.image.width;
      this.image.height = entry.image.height;
      this.image.alt = entry.alt;
      this.caption.textContent = `${entry.label} · ${padNumber(this.index + 1)} / ${padNumber(this.entries.length)}`;
      const multiple = this.entries.length > 1;
      this.previousButton.hidden = !multiple;
      this.nextButton.hidden = !multiple;
    }
  };

  function createGalleryItem(entry, eager) {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";
    figure.dataset.category = entry.slug;

    const button = document.createElement("button");
    button.className = "gallery-item__button";
    button.type = "button";
    button.setAttribute("aria-label", `${entry.alt} — tam ekran görüntüle`);

    const image = document.createElement("img");
    setImageAttributes(image, entry.image, {
      alt: entry.alt,
      eager: eager
    });
    image.addEventListener("error", () => {
      figure.classList.add("is-error");
    });

    const caption = document.createElement("span");
    caption.className = "gallery-item__caption";

    const label = document.createElement("span");
    label.textContent = entry.label;
    const count = document.createElement("span");
    count.textContent = padNumber(entry.frame);
    caption.append(label, count);

    button.append(image, caption);
    figure.appendChild(button);
    entry.element = figure;
    entry.button = button;
    return figure;
  }

  function buildGallery(container, entries, eagerCount) {
    const fragment = document.createDocumentFragment();

    entries.forEach((entry, index) => {
      fragment.appendChild(createGalleryItem(entry, index < eagerCount));
    });
    container.appendChild(fragment);

    entries.forEach((entry) => {
      entry.button.addEventListener("click", () => {
        const activeEntries = entries.filter((item) => !item.element.hidden);
        const activeIndex = activeEntries.indexOf(entry);
        lightbox.open(activeEntries, Math.max(activeIndex, 0), entry.button);
      });
    });

    revealElements(container);
  }

  function createPortfolioEntries() {
    const entries = [];
    const maxLength = Math.max(...data.projects.map((project) => project.images.length));

    for (let frameIndex = 0; frameIndex < maxLength; frameIndex += 1) {
      data.projects.forEach((project) => {
        const image = project.images[frameIndex];
        if (!image) {
          return;
        }
        entries.push({
          project,
          image,
          slug: project.slug,
          frame: frameIndex + 1,
          label: project.name,
          alt: `${altDescriptions[project.slug]}, ${frameIndex + 1}. kare`
        });
      });
    }

    return entries;
  }

  function renderPortfolio() {
    const container = document.querySelector("[data-portfolio-gallery]");
    const filterContainer = document.querySelector("[data-filters]");
    if (!container || !filterContainer) {
      return;
    }

    const entries = createPortfolioEntries();
    document.querySelectorAll("[data-total-count], [data-visible-count]").forEach((element) => {
      element.textContent = String(entries.length);
    });
    buildGallery(container, entries, 6);

    data.projects.forEach((project) => {
      const button = document.createElement("button");
      button.className = "filter-button";
      button.type = "button";
      button.dataset.filter = project.slug;
      button.setAttribute("aria-pressed", "false");
      button.textContent = filterLabels[project.slug] || project.name;
      filterContainer.appendChild(button);
    });

    const buttons = [...filterContainer.querySelectorAll("[data-filter]")];
    const visibleCount = document.querySelector("[data-visible-count]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });

        let count = 0;
        entries.forEach((entry) => {
          const visible = filter === "all" || entry.slug === filter;
          entry.element.hidden = !visible;
          if (visible) {
            count += 1;
          }
        });

        if (visibleCount) {
          visibleCount.textContent = String(count);
        }
      });
    });
  }

  function showProjectError() {
    const main = document.querySelector("main");
    const header = document.querySelector("[data-header]");
    if (!main) {
      return;
    }
    if (header) {
      header.classList.remove("site-header--overlay");
      header.querySelector(".brand")?.classList.remove("brand--light");
      header.querySelector("[data-menu-toggle]")?.classList.remove("menu-toggle--light");
    }

    main.innerHTML = "";
    const section = document.createElement("section");
    section.className = "project-error";
    const wrap = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Proje bulunamadı.";
    const text = document.createElement("p");
    text.textContent = "Aradığınız seri bulunamadı veya bağlantı eksik.";
    const link = document.createElement("a");
    link.className = "button";
    link.href = "projects.html";
    link.textContent = "PROJELERE DÖN";
    wrap.append(title, text, link);
    section.appendChild(wrap);
    main.appendChild(section);
  }

  function renderProjectDetail() {
    const slug = new URLSearchParams(window.location.search).get("project");
    const project = data.projects.find((candidate) => candidate.slug === slug);
    if (!project) {
      showProjectError();
      return;
    }

    document.title = `${project.name} — Yağız Aydın Studio`;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = `${project.name} fotoğraf serisi — Yağız Aydın Studio.`;
    }

    const coverElement = document.querySelector("[data-project-cover]");
    const cover = imageByPath(project, project.cover);
    if (coverElement) {
      setImageAttributes(coverElement, cover, {
        alt: `${project.name} kapak fotoğrafı`,
        eager: true,
        position: project.position
      });
    }

    document.querySelectorAll("[data-project-title]").forEach((element) => {
      element.textContent = project.name;
    });
    document.querySelectorAll("[data-project-breadcrumb]").forEach((element) => {
      element.textContent = project.name;
    });
    document.querySelectorAll("[data-project-eyebrow]").forEach((element) => {
      element.textContent = project.eyebrow;
    });
    document.querySelectorAll("[data-project-count]").forEach((element) => {
      element.textContent = padNumber(project.images.length);
    });

    const gallery = document.querySelector("[data-project-gallery]");
    if (gallery) {
      const entries = project.images.map((image, index) => ({
        project,
        image,
        slug: project.slug,
        frame: index + 1,
        label: project.name,
        alt: `${altDescriptions[project.slug]}, ${index + 1}. kare`
      }));
      buildGallery(gallery, entries, 4);
    }

    const nextContainer = document.querySelector("[data-next-project]");
    if (nextContainer) {
      const currentIndex = data.projects.indexOf(project);
      const nextProject = data.projects[(currentIndex + 1) % data.projects.length];
      const link = document.createElement("a");
      link.href = projectUrl(nextProject.slug);
      const label = document.createElement("small");
      label.textContent = "Sonraki proje";
      const title = document.createElement("strong");
      title.textContent = nextProject.name;
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      link.append(label, title, arrow);
      nextContainer.appendChild(link);
    }
  }

  function setupHeroSlideshow() {
    const host = document.querySelector("[data-hero-slideshow]");
    const hero = host ? host.closest(".hero") : null;
    const slides = data.projects.map((project) => ({
      project,
      image: imageByPath(project, project.cover)
    }));
    const imageElements = host ? [...host.querySelectorAll("[data-hero-slide]")] : [];
    const currentElement = document.querySelector("[data-hero-current]");
    const totalElement = document.querySelector("[data-hero-total]");
    const toggle = document.querySelector("[data-hero-toggle]");

    if (!host || !hero || imageElements.length < 2 || slides.length < 2) {
      return;
    }

    let currentIndex = 0;
    let activeImageIndex = 0;
    let timer = null;
    let preloadTimer = null;
    let pausedByUser = false;
    let transitionPending = false;

    if (totalElement) {
      totalElement.textContent = padNumber(slides.length);
    }

    const clearTimer = () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
      if (preloadTimer) {
        window.clearTimeout(preloadTimer);
        preloadTimer = null;
      }
    };

    const updateControl = () => {
      if (!toggle) {
        return;
      }
      if (prefersReducedMotion) {
        toggle.textContent = "SONRAKİ";
        toggle.setAttribute("aria-label", "Sonraki ana görsel fotoğrafı");
        toggle.setAttribute("aria-pressed", "false");
        return;
      }
      toggle.textContent = pausedByUser ? "OYNAT" : "DURAKLAT";
      toggle.setAttribute("aria-label", pausedByUser ? "Ana görsel slaytını oynat" : "Ana görsel slaytını duraklat");
      toggle.setAttribute("aria-pressed", String(pausedByUser));
    };

    const shouldRun = () => (
      !prefersReducedMotion &&
      !pausedByUser &&
      !document.hidden
    );

    const prepareNext = () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      const nextImageIndex = activeImageIndex === 0 ? 1 : 0;
      const nextElement = imageElements[nextImageIndex];
      const nextSlide = slides[nextIndex];

      if (nextElement.dataset.slideIndex === String(nextIndex)) {
        return;
      }

      nextElement.removeAttribute("fetchpriority");
      setImageAttributes(nextElement, nextSlide.image, {
        alt: "",
        position: nextSlide.project.position
      });
      nextElement.dataset.slideIndex = String(nextIndex);
    };

    const scheduleNext = () => {
      clearTimer();
      if (shouldRun()) {
        preloadTimer = window.setTimeout(prepareNext, 950);
        timer = window.setTimeout(() => {
          void showNext();
        }, 3000);
      }
    };

    const showNext = async () => {
      if (transitionPending) {
        return;
      }

      transitionPending = true;
      clearTimer();
      const nextIndex = (currentIndex + 1) % slides.length;
      const nextImageIndex = activeImageIndex === 0 ? 1 : 0;
      const nextElement = imageElements[nextImageIndex];
      if (nextElement.dataset.slideIndex !== String(nextIndex)) {
        prepareNext();
      }

      try {
        if (typeof nextElement.decode === "function") {
          await nextElement.decode();
        }
      } catch (error) {
        // The load event can still complete even when decode is unavailable.
      }

      imageElements[activeImageIndex].classList.remove("is-active");
      nextElement.classList.add("is-active");
      activeImageIndex = nextImageIndex;
      currentIndex = nextIndex;
      transitionPending = false;

      if (currentElement) {
        currentElement.textContent = padNumber(currentIndex + 1);
      }
      scheduleNext();
    };

    document.addEventListener("visibilitychange", scheduleNext);

    if (toggle) {
      toggle.addEventListener("click", () => {
        if (prefersReducedMotion) {
          void showNext();
          return;
        }
        pausedByUser = !pausedByUser;
        updateControl();
        scheduleNext();
      });
    }

    updateControl();
    imageElements[0].dataset.slideIndex = "0";
    if (!prefersReducedMotion) {
      prepareNext();
    }
    scheduleNext();
  }

  function setupFloatingContacts() {
    const container = document.createElement("aside");
    container.className = "floating-contacts";
    container.setAttribute("aria-label", "Hızlı iletişim");

    const panel = document.createElement("div");
    panel.className = "floating-contacts__panel";
    panel.id = "floating-contacts-panel";
    panel.setAttribute("aria-hidden", "true");
    panel.inert = true;

    const head = document.createElement("div");
    head.className = "floating-contacts__head";
    const headTitle = document.createElement("p");
    headTitle.textContent = "İletişime geçelim";
    const headMeta = document.createElement("span");
    headMeta.textContent = "BURSA / TÜRKİYE";
    head.append(headTitle, headMeta);

    const links = document.createElement("div");
    links.className = "floating-contacts__links";
    const contactItems = [
      {
        label: "Instagram",
        value: "@yagizaydinstudio",
        href: "https://www.instagram.com/yagizaydinstudio/",
        external: true
      },
      {
        label: "Telefon",
        value: "+90 530 979 45 50",
        href: "tel:+905309794550"
      },
      {
        label: "E-posta",
        value: "ismailyagizaydin@gmail.com",
        href: "mailto:ismailyagizaydin@gmail.com"
      }
    ];

    contactItems.forEach((item) => {
      const link = document.createElement("a");
      link.className = "floating-contacts__link";
      link.href = item.href;
      if (item.external) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      const label = document.createElement("small");
      label.textContent = item.label;
      const value = document.createElement("strong");
      value.textContent = item.value;
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      link.append(label, value, arrow);
      links.appendChild(link);
    });

    const pageLink = document.createElement("a");
    pageLink.className = "floating-contacts__page-link";
    pageLink.href = "contact.html";
    pageLink.innerHTML = "<span>İLETİŞİM SAYFASINI AÇ</span><span aria-hidden=\"true\">↗</span>";

    panel.append(head, links, pageLink);

    const toggle = document.createElement("button");
    toggle.className = "floating-contacts__toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", panel.id);
    toggle.setAttribute("aria-label", "İletişim seçeneklerini aç");
    toggle.innerHTML = "<strong>İLETİŞİM</strong><span aria-hidden=\"true\">+</span>";

    container.append(panel, toggle);
    document.body.appendChild(container);

    const firstLink = links.querySelector("a");
    const setOpen = (open, restoreFocus) => {
      container.classList.toggle("is-open", open);
      panel.inert = !open;
      panel.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "İletişim seçeneklerini kapat" : "İletişim seçeneklerini aç");
      if (open && firstLink) {
        firstLink.focus();
      } else if (restoreFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", () => {
      setOpen(!container.classList.contains("is-open"), false);
    });
    document.addEventListener("click", (event) => {
      if (container.classList.contains("is-open") && !container.contains(event.target)) {
        setOpen(false, false);
      }
    });
    container.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (container.classList.contains("is-open") && !container.contains(document.activeElement)) {
          setOpen(false, false);
        }
      }, 0);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && container.classList.contains("is-open")) {
        setOpen(false, true);
      }
    });
    document.addEventListener("site:close-contacts", () => {
      setOpen(false, false);
    });
  }

  function setCurrentYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll("[data-year]").forEach((element) => {
      element.textContent = String(year);
    });
  }

  setupFloatingContacts();
  setupHeader();
  setupHeroSlideshow();
  setCurrentYear();

  if (page === "home") {
    renderFeaturedProjects();
  } else if (page === "portfolio") {
    renderPortfolio();
  } else if (page === "projects") {
    renderProjectGrid();
  } else if (page === "project") {
    renderProjectDetail();
  }

  revealElements(document);
})();
