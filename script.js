// Get main navbar and hero elements
const siteHeader = document.getElementById("siteHeader");
const menuBtn = document.getElementById("menuBtn");
const siteNav = document.getElementById("siteNav");
const heroVideo = document.getElementById("heroVideo");
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
  // Reset media state when page loads
  heroVideo.classList.remove("is-hidden");
  if (heroInterludeImage) {
    heroInterludeImage.classList.remove("is-visible");
  }

  // After video ends, show static image
  heroVideo.addEventListener("ended", () => {
    heroVideo.classList.add("is-hidden");
    if (heroInterludeImage) {
      heroInterludeImage.classList.add("is-visible");
    }
  });
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
    "Book Orlando Luxury Fleet Services Today",
    "Travel In Luxury, Safety & Comfort",
    "Premium Orlando Rides, On Time Every Time"
  ];
  let lineIndex = 0;

  setInterval(() => {
    heroDynamicText.classList.add("text-swap-out");
    setTimeout(() => {
      lineIndex = (lineIndex + 1) % heroLines.length;
      heroDynamicText.textContent = heroLines[lineIndex];
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

        <form class="quote-modal-form" action="#" method="post">
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
              </select>
            </div>
          </div>

          <h3>Vehicle Selection</h3>
          <div class="quote-modal-grid two">
            <div>
              <label for="qm-car">Select Car</label>
              <select id="qm-car" name="select_car">
                <option>Cadillac Escalade</option>
                <option>Chevrolet Suburban</option>
                <option>Lincoln MKT</option>
                <option>Chrysler 300 Limo</option>
                <option>Hummer Limo</option>
                <option>Ford Transit</option>
                <option>Mercedes GLE</option>
              </select>
            </div>
            <div>
              <label for="qm-car-type">Car Type</label>
              <select id="qm-car-type" name="car_type">
                <option>Sedan</option>
                <option>SUV</option>
                <option>Limo</option>
                <option>Van</option>
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
