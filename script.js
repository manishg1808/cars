// Get main navbar and hero elements
const siteHeader = document.getElementById("siteHeader");
const menuBtn = document.getElementById("menuBtn");
const siteNav = document.getElementById("siteNav");
const heroVideo = document.getElementById("heroVideo");
const heroVideoSecondary = document.getElementById("heroVideoSecondary");
const heroInterludeImage = document.getElementById("heroInterludeImage");

// Mobile menu toggle section
if (menuBtn && siteNav) {
  menuBtn.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

// Navbar scroll background section
if (siteHeader) {
  const updateHeader = () => {
    const threshold = window.innerHeight * 0.5;
    if (window.scrollY > 10) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }

    if (window.scrollY >= threshold) {
      siteHeader.classList.add("has-bg");
    } else {
      siteHeader.classList.remove("has-bg");
    }
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader);
}

// Home banner video + end image section
if (heroVideo) {
  const isMobileHero = window.matchMedia("(max-width: 1024px)").matches;

  // Reset media state when page loads
  heroVideo.classList.remove("is-hidden");
  if (heroVideoSecondary) {
    heroVideoSecondary.classList.remove("is-active");
  }
  if (heroInterludeImage) {
    heroInterludeImage.classList.remove("is-visible");
  }

  if (isMobileHero) {
    heroVideo.pause();
    if (heroVideoSecondary) {
      heroVideoSecondary.pause();
    }
  } else {
    // After first video ends, show and play second video
    heroVideo.addEventListener("ended", () => {
      heroVideo.classList.add("is-hidden");
      if (heroVideoSecondary) {
        heroVideoSecondary.classList.add("is-active");
        heroVideoSecondary.play().catch(() => {});
      }
    });
  }
}

const galleryItems = document.querySelectorAll(".gallery-item");
const galleryLightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const heroDynamicText = document.getElementById("heroDynamicText");
const serviceScrollItems = document.querySelectorAll(".service-scroll-item");
const servicePreviewImage = document.getElementById("servicePreviewImage");
const servicePreviewTitle = document.getElementById("servicePreviewTitle");
const serviceTextRight = document.querySelector(".service-text-right");
const countUpItems = document.querySelectorAll(".count-up");
const ratesTables = document.querySelectorAll(".rates-table");

const insertFeedbackBanner = (anchor, banner) => {
  if (!anchor || anchor === document.body) {
    document.body.prepend(banner);
    return;
  }

  if (anchor.parentNode) {
    anchor.parentNode.insertBefore(banner, anchor);
  }
};

const showFormFeedback = (message, tone = "success", anchor = document.querySelector(".page-main, .hero")) => {
  document.querySelectorAll(".form-feedback-banner[data-runtime-feedback='true']").forEach((banner) => {
    banner.remove();
  });

  const banner = document.createElement("div");
  banner.dataset.runtimeFeedback = "true";
  banner.className = `form-feedback-banner is-${tone}`;
  banner.textContent = message;

  insertFeedbackBanner(anchor, banner);
  return banner;
};

// Shared form submit feedback
(() => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("form_status");

  if (!status) {
    return;
  }

  showFormFeedback(
    status === "success"
      ? "Your request was sent successfully. We will contact you shortly."
      : "We could not send your request right now. Please try again or call us directly.",
    status === "success" ? "success" : "error",
    document.querySelector(".page-main, .hero")
  );

  params.delete("form_status");
  const cleanQuery = params.toString();
  const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}${window.location.hash}`;
  window.history.replaceState({}, document.title, cleanUrl);
})();

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.dataset.demoForm !== "true") {
    return;
  }

  event.preventDefault();
  showFormFeedback(
    "Frontend demo only. Backend form handling is not included in this repository.",
    "info",
    form
  );
  form.reset();
});

// Gallery image popup (lightbox) section
if (galleryItems.length && galleryLightbox && lightboxImage && lightboxCaption && lightboxClose) {
  const closeLightbox = () => {
    galleryLightbox.classList.remove("open");
    galleryLightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxCaption.textContent = "";
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.querySelector(".gallery-caption");
      if (!img) {
        return;
      }

      lightboxImage.src = img.getAttribute("src");
      lightboxImage.alt = img.getAttribute("alt") || "Gallery preview";
      lightboxCaption.textContent = caption ? caption.textContent : "";
      galleryLightbox.classList.add("open");
      galleryLightbox.setAttribute("aria-hidden", "false");
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  galleryLightbox.addEventListener("click", (event) => {
    if (event.target === galleryLightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && galleryLightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

// Home hero changing text section
if (heroDynamicText) {
  const heroLines = [
    {
      html: "Book Orlando Luxury Fleet Services Today",
      compact: false,
    },
    {
      html: "Travel In Luxury, Safety & Comfort",
      compact: false,
    },
    {
      html: "Premium Orlando Rides,<br>On Time Every Time",
      compact: true,
    }
  ];
  let lineIndex = 0;

  setInterval(() => {
    heroDynamicText.classList.add("text-swap-out");
    setTimeout(() => {
      lineIndex = (lineIndex + 1) % heroLines.length;
      const activeLine = heroLines[lineIndex];
      heroDynamicText.innerHTML = activeLine.html;
      heroDynamicText.classList.toggle("is-compact", activeLine.compact);
      heroDynamicText.classList.remove("text-swap-out");
      heroDynamicText.classList.add("text-swap-in");
      setTimeout(() => {
        heroDynamicText.classList.remove("text-swap-in");
      }, 380);
    }, 380);
  }, 3200);
}

// Home service section scroll preview section
if (serviceScrollItems.length && servicePreviewImage && servicePreviewTitle) {
  const setServicePreview = (item) => {
    serviceScrollItems.forEach((entry) => entry.classList.remove("active"));
    item.classList.add("active");

    const nextImage = item.getAttribute("data-image");
    const nextAlt = item.getAttribute("data-alt") || "Service preview";
    const heading = item.querySelector("h3");

    if (nextImage) {
      if (servicePreviewImage.src.indexOf(nextImage) === -1) {
        servicePreviewImage.classList.add("is-swapping");
        setTimeout(() => {
          servicePreviewImage.src = nextImage;
          servicePreviewImage.classList.remove("is-swapping");
        }, 140);
      }
      servicePreviewImage.alt = nextAlt;
    }
    servicePreviewTitle.textContent = heading ? heading.textContent : "Service";
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setServicePreview(entry.target);
        }
      });
    },
    {
      root: serviceTextRight || null,
      threshold: 0.55,
      rootMargin: "0px"
    }
  );

  serviceScrollItems.forEach((item) => {
    observer.observe(item);
    item.addEventListener("mouseenter", () => setServicePreview(item));
  });
}

// Rates table responsive labels section
if (ratesTables.length) {
  ratesTables.forEach((table) => {
    const headers = Array.from(table.querySelectorAll("thead th")).map((cell) =>
      cell.textContent.replace(/\s+/g, " ").trim()
    );

    table.querySelectorAll("tbody tr").forEach((row) => {
      Array.from(row.children).forEach((cell, index) => {
        if (headers[index]) {
          cell.setAttribute("data-label", headers[index]);
        }
      });
    });
  });
}

// Services vehicle rate filters
(() => {
  const section = document.querySelector(".services-suv-rates");
  if (!section) {
    return;
  }

  const grid = section.querySelector("[data-rate-grid]");
  const count = section.querySelector("[data-rate-count]");
  const filterGroup = section.querySelector("[data-rate-filters]");
  const vehicleTabs = Array.from(section.querySelectorAll("[data-vehicle-tab]"));
  const vehiclePanels = Array.from(section.querySelectorAll("[data-vehicle-panel]"));
  const routeButtons = filterGroup ? Array.from(filterGroup.querySelectorAll("button")) : [];

  if (!grid || !filterGroup || !vehicleTabs.length) {
    return;
  }

  const rateRows = [
    ["towncar", "airport disney popular", ["Airport", "Disney"], "Orlando International Airport &harr; All WDW Disney Property Resorts", "$105.00", "$195.00"],
    ["towncar", "airport disney popular", ["Airport", "Disney"], "Orlando International Airport &harr; Disney Springs Hotels", "$105.00", "$195.00"],
    ["towncar", "airport disney", ["Airport", "Disney Area"], "Orlando International Airport &harr; Flamingo Crossings", "$110.00", "$205.00"],
    ["towncar", "airport popular", ["Airport", "Hotels"], "Orlando International Airport &harr; International Drive Hotels", "$105.00", "$195.00"],
    ["towncar", "airport disney popular", ["Airport", "Disney Area"], "Orlando International Airport &harr; Kissimmee 192 Area Hotels", "$115.00", "$220.00"],
    ["towncar", "airport disney", ["Airport", "Disney Area"], "Orlando International Airport &harr; Omni Championsgate / Reunion", "$130.00", "$250.00"],
    ["towncar", "airport universal popular", ["Airport", "Universal"], "Orlando International Airport &harr; Universal Studios Area Hotels", "$105.00", "$195.00"],
    ["towncar", "disney port popular", ["Disney", "Port Canaveral"], "All WDW Disney Property Resorts &harr; Port Canaveral", "$185.00", "$360.00"],
    ["towncar", "disney universal popular", ["Disney", "Universal"], "All WDW Disney Property Resorts &harr; Universal Studios Area Hotels", "$85.00", "$170.00"],
    ["towncar", "airport port popular", ["Port Canaveral", "Airport"], "Port Canaveral &harr; Orlando International Airport", "$160.00", "$315.00"],
    ["towncar", "airport disney", ["Sanford", "Disney"], "Sanford Int'l Airport &harr; All WDW Disney Property Resorts", "$165.00", "$315.00"],
    ["towncar", "airport port", ["Sanford", "Port Canaveral"], "Sanford Int'l Airport &harr; Port Canaveral", "$235.00", "$460.00"],
    ["towncar", "airport universal", ["Sanford", "Universal"], "Sanford Int'l Airport &harr; Universal Studios Area Hotels", "$165.00", "$315.00"],
    ["towncar", "disney popular", ["Sea World", "Disney"], "Sea World &harr; All WDW Disney Property Resorts", "$75.00", "$140.00"],
    ["towncar", "universal disney popular", ["Universal", "Disney"], "Universal Studios Area Hotels &harr; All WDW Disney Property Resorts", "$85.00", "$170.00"],
    ["towncar", "universal disney", ["Universal", "Disney Area"], "Universal Studios Area Hotels &harr; Kissimmee 192 Area Hotels", "$95.00", "$190.00"],
    ["suv", "airport disney popular", ["Airport", "Disney"], "Orlando International Airport &harr; All WDW Disney Property Resorts", "$140.00", "$275.00"],
    ["suv", "airport disney popular", ["Airport", "Disney"], "Orlando International Airport &harr; Disney Springs Hotels", "$140.00", "$275.00"],
    ["suv", "airport popular", ["Airport", "Hotels"], "Orlando International Airport &harr; International Drive Hotels", "$140.00", "$275.00"],
    ["suv", "airport disney popular", ["Airport", "Disney Area"], "Orlando International Airport &harr; Kissimmee 192 Area Hotels", "$155.00", "$300.00"],
    ["suv", "airport disney", ["Airport", "Disney Area"], "Orlando International Airport &harr; Omni Championsgate / Reunion", "$165.00", "$320.00"],
    ["suv", "airport universal popular", ["Airport", "Universal"], "Orlando International Airport &harr; Universal Studios Area Hotels", "$140.00", "$275.00"],
    ["suv", "airport disney", ["Airport", "Resorts"], "Orlando International Airport &harr; Winter Garden Resorts", "$155.00", "$305.00"],
    ["suv", "disney port popular", ["Disney", "Port Canaveral"], "All WDW Disney Property Resorts &harr; Port Canaveral", "$235.00", "$455.00"],
    ["suv", "disney universal popular", ["Disney", "Universal"], "All WDW Disney Property Resorts &harr; Universal Studios Area Hotels", "$120.00", "$230.00"],
    ["suv", "disney", ["Disney", "Resorts"], "All WDW Disney Property Resorts &harr; Winter Garden Resorts", "$130.00", "$255.00"],
    ["suv", "airport port popular", ["Port Canaveral", "Airport"], "Port Canaveral &harr; Orlando International Airport", "$200.00", "$395.00"],
    ["suv", "airport disney", ["Sanford", "Disney"], "Sanford Int'l Airport &harr; All WDW Disney Property Resorts", "$195.00", "$380.00"],
    ["suv", "airport port", ["Sanford", "Port Canaveral"], "Sanford Int'l Airport &harr; Port Canaveral", "$285.00", "$560.00"],
    ["suv", "airport universal", ["Sanford", "Universal"], "Sanford Int'l Airport &harr; Universal Studios Area Hotels", "$195.00", "$380.00"],
    ["suv", "disney popular", ["Sea World", "Disney"], "Sea World &harr; All WDW Disney Property Resorts", "$95.00", "$180.00"],
    ["suv", "universal disney popular", ["Universal", "Disney"], "Universal Studios Area Hotels &harr; All WDW Disney Property Resorts", "$120.00", "$230.00"],
    ["suv", "universal disney", ["Universal", "Disney Area"], "Universal Studios Area Hotels &harr; Kissimmee 192 Area Hotels", "$110.00", "$215.00"],
    ["van", "airport disney popular", ["Airport", "Disney"], "Orlando International Airport &harr; All WDW Disney Property Resorts", "$225.00", "$440.00"],
    ["van", "airport disney popular", ["Airport", "Disney"], "Orlando International Airport &harr; Disney Springs Hotels", "$225.00", "$440.00"],
    ["van", "airport popular", ["Airport", "Hotels"], "Orlando International Airport &harr; International Drive Hotels", "$225.00", "$440.00"],
    ["van", "airport disney popular", ["Airport", "Disney Area"], "Orlando International Airport &harr; Kissimmee 192 Area Hotels", "$245.00", "$475.00"],
    ["van", "airport disney", ["Airport", "Disney Area"], "Orlando International Airport &harr; Omni Championsgate / Reunion", "$260.00", "$505.00"],
    ["van", "airport universal popular", ["Airport", "Universal"], "Orlando International Airport &harr; Universal Studios Area Hotels", "$225.00", "$440.00"],
    ["van", "disney port popular", ["Disney", "Port Canaveral"], "All WDW Disney Property Resorts &harr; Port Canaveral", "$345.00", "$675.00"],
    ["van", "disney universal popular", ["Disney", "Universal"], "All WDW Disney Property Resorts &harr; Universal Studios Area Hotels", "$160.00", "$300.00"],
    ["van", "airport port popular", ["Port Canaveral", "Airport"], "Port Canaveral &harr; Orlando International Airport", "$295.00", "$575.00"],
    ["van", "airport disney", ["Sanford", "Disney"], "Sanford Int'l Airport &harr; All WDW Disney Property Resorts", "$310.00", "$595.00"],
    ["van", "airport port", ["Sanford", "Port Canaveral"], "Sanford Int'l Airport &harr; Port Canaveral", "$395.00", "$725.00"],
    ["van", "airport universal", ["Sanford", "Universal"], "Sanford Int'l Airport &harr; Universal Studios Area Hotels", "$310.00", "$595.00"],
    ["van", "disney popular", ["Sea World", "Disney"], "Sea World &harr; All WDW Disney Property Resorts", "$150.00", "$290.00"],
    ["van", "universal disney popular", ["Universal", "Disney"], "Universal Studios Area Hotels &harr; All WDW Disney Property Resorts", "$155.00", "$300.00"],
    ["van", "universal disney", ["Universal", "Disney Area"], "Universal Studios Area Hotels &harr; Kissimmee 192 Area Hotels", "$170.00", "$340.00"]
  ];

  let activeVehicle =
    vehicleTabs.find((button) => button.classList.contains("active"))?.getAttribute("data-vehicle-tab") ||
    vehicleTabs[0].getAttribute("data-vehicle-tab");
  let activeFilter = "all";
  const vehicleLabels = {
    towncar: "Town Car",
    suv: "SUV",
    van: "Van"
  };

  const renderRows = (rows) =>
    rows
      .map(([, , badges, route, oneWay, roundTrip]) => {
        const badgeMarkup = badges
          .map((badge) => `<span class="services-rate-badge">${badge}</span>`)
          .join("");

        return `
          <article class="services-rate-row">
            <div class="services-rate-route">
              <div class="services-rate-row-badges">${badgeMarkup}</div>
              <h3>${route}</h3>
            </div>
            <div class="services-rate-fare">
              <span>One Way</span>
              <strong>${oneWay}</strong>
              <a href="contact.html" class="services-rate-btn secondary">Book One-way</a>
            </div>
            <div class="services-rate-fare">
              <span>Round Trip</span>
              <strong>${roundTrip}</strong>
              <a href="contact.html" class="services-rate-btn primary">Book Roundtrip</a>
            </div>
          </article>
        `;
      })
      .join("");

  const updateTabs = () => {
    vehicleTabs.forEach((button) => {
      const isActive = button.getAttribute("data-vehicle-tab") === activeVehicle;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    vehiclePanels.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-vehicle-panel") !== activeVehicle;
    });
  };

  const updateFilters = () => {
    routeButtons.forEach((button) => {
      const filter = button.getAttribute("data-filter");
      const isActive = filter === activeFilter;

      if (filter === "clear") {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
        return;
      }

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const updateRates = () => {
    const visibleRows = rateRows.filter(([vehicle, tags]) => {
      if (vehicle !== activeVehicle) {
        return false;
      }

      if (activeFilter === "all") {
        return true;
      }

      const tagList = tags.split(/\s+/).filter(Boolean);
      return tagList.includes(activeFilter);
    });

    grid.innerHTML = visibleRows.length
      ? renderRows(visibleRows)
      : '<p class="services-rate-empty">No routes match this filter.</p>';

    if (count) {
      count.textContent = `${vehicleLabels[activeVehicle] || "Vehicle"}: ${visibleRows.length} routes shown`;
    }

    updateTabs();
    updateFilters();
  };

  vehicleTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const vehicle = button.getAttribute("data-vehicle-tab");
      if (!vehicle || vehicle === activeVehicle) {
        return;
      }

      activeVehicle = vehicle;
      activeFilter = "all";
      updateRates();
    });
  });

  routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      if (!filter || filter === "all" || filter === "clear") {
        activeFilter = "all";
        updateRates();
        return;
      }

      activeFilter = filter;
      updateRates();
    });
  });

  updateRates();
})();

// Scroll to top button with progress ring section
(() => {
  if (!document.body) {
    return;
  }

  const scrollTopMarkup = `
    <button type="button" class="scroll-top-btn" id="scrollTopBtn" aria-label="Scroll to top">
      <span class="scroll-top-inner">
        <i class="ri-arrow-up-line" aria-hidden="true"></i>
      </span>
    </button>
  `;

  document.body.insertAdjacentHTML("beforeend", scrollTopMarkup);

  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (!scrollTopBtn) {
    return;
  }

  const updateScrollTopButton = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    const safeProgress = Math.max(0, Math.min(progress, 100));

    scrollTopBtn.style.background = `conic-gradient(#c89a22 ${safeProgress}%, rgba(200, 154, 34, 0.16) ${safeProgress}%)`;

    if (window.scrollY > 260) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  };

  updateScrollTopButton();
  window.addEventListener("scroll", updateScrollTopButton, { passive: true });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
})();

// Hero stats count-up section
if (countUpItems.length) {
  const animateCount = (item) => {
    if (item.dataset.done === "true") {
      return;
    }

    const target = Number(item.dataset.target || 0);
    const suffix = item.dataset.suffix || "";
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      item.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        item.textContent = `${target}${suffix}`;
        item.dataset.done = "true";
      }
    };

    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  countUpItems.forEach((item) => countObserver.observe(item));
}

// Request quote popup form section
(() => {
  const quoteLinks = document.querySelectorAll('a[href="request-quote.html"]');
  if (!quoteLinks.length) {
    return;
  }

  const modalMarkup = `
    <div class="quote-modal-overlay" id="quoteModalOverlay" aria-hidden="true">
      <div class="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quoteModalTitle">
        <button type="button" class="quote-modal-close" id="quoteModalClose" aria-label="Close form">&times;</button>
        <h2 id="quoteModalTitle">Quick Quote Request</h2>
        <p>Share your trip details and our team will contact you shortly.</p>

        <form class="quote-modal-form" action="#" method="post" data-demo-form="true">
          <h3>Basic Contact Info</h3>
          <div class="quote-modal-grid two">
            <div>
              <label for="qm-full-name">Full Name *</label>
              <input id="qm-full-name" name="full_name" type="text" required>
            </div>
            <div>
              <label for="qm-mobile">Mobile Number *</label>
              <input id="qm-mobile" name="mobile_number" type="tel" required>
            </div>
            <div>
              <label for="qm-email">Email Address *</label>
              <input id="qm-email" name="email_address" type="email" required>
            </div>
          </div>

          <h3>Trip Details</h3>
          <div class="quote-modal-grid three">
            <div>
              <label for="qm-pickup-date">Pickup Date *</label>
              <input id="qm-pickup-date" name="pickup_date" type="date" required>
            </div>
            <div>
              <label for="qm-pickup-time">Pickup Time *</label>
              <input id="qm-pickup-time" name="pickup_time" type="time" required>
            </div>
            <div>
              <label for="qm-passengers">Number of Passengers *</label>
              <input id="qm-passengers" name="passengers" type="number" min="1" required>
            </div>
            <div>
              <label for="qm-pickup-location">Pickup Location *</label>
              <input id="qm-pickup-location" name="pickup_location" type="text" required>
            </div>
            <div>
              <label for="qm-drop-location">Drop Location *</label>
              <input id="qm-drop-location" name="drop_location" type="text" required>
            </div>
            <div>
              <label for="qm-trip-type">Trip Type</label>
              <select id="qm-trip-type" name="trip_type">
                <option>One Way</option>
                <option>Round Trip</option>
                <option>Hourly Rental</option>
                <option>Airport Transfer</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <h3>Vehicle Selection</h3>
          <div class="quote-modal-grid two">
              <div>
                <label for="qm-car">Select Car</label>
                <select id="qm-car" name="select_car">
                  <option>Executive Sedan</option>
                  <option>Executive SUV</option>
                  <option>Sprinter Van</option>
                  <option>Other</option>
                </select>
              </div>
            <div>
              <label for="qm-car-type">Car Type</label>
              <select id="qm-car-type" name="car_type">
                <option>Sedan</option>
                <option>SUV</option>
                <option>Limo</option>
                <option>Van</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <h3>Rental Purpose</h3>
          <div class="quote-modal-grid two">
            <div>
              <label for="qm-purpose">Purpose</label>
              <select id="qm-purpose" name="rental_purpose">
                <option>Airport Transfer</option>
                <option>Outstation Trip</option>
                <option>Wedding</option>
                <option>Event</option>
                <option>Corporate Travel</option>
                <option>Local City Ride</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label for="qm-message">Tell us your travel plan</label>
              <textarea id="qm-message" name="message" rows="4" placeholder="Tell us your travel plan"></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-gradient">Submit Request</button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalMarkup);
  const modal = document.getElementById("quoteModalOverlay");
  const closeBtn = document.getElementById("quoteModalClose");

  if (!modal || !closeBtn) {
    return;
  }

  const openModal = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  quoteLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
})();
