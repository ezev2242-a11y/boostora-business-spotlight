
"use strict";

// BOOSTORA Business Spotlight configuration
const CONFIG = {
  whatsappNumber: "2348033034396"
};

// Package prices in Nigerian naira.
// Custom enquiries do not have a fixed price.
const PACKAGE_PRICES = {
  "Basic Spotlight": 2000,
  "Standard Spotlight": 4000,
  "Premium Spotlight": 8000,
  "Status + Channel": 6000,
  "Full Reach": 15000,
  "Custom Enquiry": null
};

// Select page elements
const orderForm = document.getElementById("orderForm");
const packageSelect = document.getElementById("selectedPackage");
const formError = document.getElementById("formError");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

// Automatically display the current year
document.getElementById("year").textContent = new Date().getFullYear();

// Select a package from the pricing cards
document.querySelectorAll("[data-package]").forEach((button) => {
  button.addEventListener("click", () => {
    packageSelect.value = button.dataset.package;

    // Clear any previous form error
    formError.textContent = "";

    // Move the customer to the order form
    document.getElementById("order").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    // Focus the package selector after scrolling begins
    window.setTimeout(() => {
      packageSelect.focus({ preventScroll: true });
    }, 400);
  });
});

// Mobile navigation menu
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close mobile navigation after choosing a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Format a package's price for the order message
function formatPrice(packageName) {
  const price = PACKAGE_PRICES[packageName];

  if (price === null || price === undefined) {
    return "To be discussed";
  }

  return "₦" + price.toLocaleString("en-NG");
}

// Read a form field safely
function getFieldValue(fieldId) {
  return document.getElementById(fieldId).value.trim();
}

// Prepare the order and open WhatsApp
orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";

  // Validate required fields
  if (!orderForm.checkValidity()) {
    orderForm.reportValidity();
    return;
  }

  const packageName = getFieldValue("selectedPackage");

  if (!Object.prototype.hasOwnProperty.call(PACKAGE_PRICES, packageName)) {
    formError.textContent = "Please select a valid promotion package.";
    packageSelect.focus();
    return;
  }

  const businessName = getFieldValue("businessName");
  const contactName = getFieldValue("contactName");
  const category = getFieldValue("category");
  const customerWhatsApp = getFieldValue("customerWhatsApp");
  const businessDescription = getFieldValue("businessDescription");
  const businessLink = getFieldValue("businessLink");
  const socialLink = getFieldValue("socialLink");
  const mediaDetails = getFieldValue("mediaDetails");

  // Build the order message
  const messageLines = [
    "Hello BOOSTORA Business Spotlight!",
    "",
    "I would like to enquire about placing a business promotion.",
    "",
    "ORDER DETAILS",
    "-------------------------",
    "Selected Package: " + packageName,
    "Package Price: " + formatPrice(packageName),
    "",
    "BUSINESS DETAILS",
    "-------------------------",
    "Business Name: " + businessName,
    "Contact Person: " + contactName,
    "Category: " + category,
    "My WhatsApp Number: " + customerWhatsApp,
    "",
    "What I Want to Promote:",
    businessDescription
  ];

  if (businessLink) {
    messageLines.push("", "Business / Product Link:", businessLink);
  }

  if (socialLink) {
    messageLines.push("", "Social Media Link:", socialLink);
  }

  if (mediaDetails) {
    messageLines.push("", "Photo / Video Details:", mediaDetails);
  }

  messageLines.push(
    "",
    "Please confirm the promotion details and explain the next steps.",
    "",
    "Thank you."
  );

  const message = messageLines.join("\n");

  // Encode the message for WhatsApp
  const whatsappURL =
    "https://wa.me/" +
    CONFIG.whatsappNumber +
    "?text=" +
    encodeURIComponent(message);

  // Open WhatsApp in a new tab; the customer must press Send
  const whatsappWindow = window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );

  // Show a fallback if the browser blocks the new tab
  if (!whatsappWindow) {
    formError.textContent =
      "WhatsApp could not open automatically. Use the button below to continue.";

    const fallbackLink = document.createElement("a");
    fallbackLink.href = whatsappURL;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = "Open WhatsApp to send your order";
    fallbackLink.className = "btn btn-primary";
    fallbackLink.style.marginTop = "12px";

    orderForm.appendChild(fallbackLink);
  }
});
