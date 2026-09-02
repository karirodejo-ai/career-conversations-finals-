/* Career Conversations w/Dr. Faith — vanilla JS */

// ---------- Mobile navigation ----------
(function nav() {
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-mobile");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();

// ---------- Toasts ----------
function toast(title, description, isError) {
  var root = document.getElementById("toast-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "toast-root";
    document.body.appendChild(root);
  }
  var el = document.createElement("div");
  el.className = "toast" + (isError ? " error" : "");
  el.setAttribute("role", "status");
  el.innerHTML = "<strong></strong><span></span>";
  el.querySelector("strong").textContent = title;
  el.querySelector("span").textContent = description || "";
  root.appendChild(el);
  setTimeout(function () { el.remove(); }, 5000);
}

// ---------- Testimonial slider ----------
(function slider() {
  var root = document.querySelector("[data-slider]");
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".dot"));
  var i = 0;
  var timer;
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, idx) { s.classList.toggle("active", idx === i); });
    dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
  }
  function start() { timer = setInterval(function () { show(i + 1); }, 7000); }
  function restart() { clearInterval(timer); start(); }
  dots.forEach(function (d, idx) { d.addEventListener("click", function () { show(idx); restart(); }); });
  var prev = root.querySelector("[data-prev]");
  var next = root.querySelector("[data-next]");
  if (prev) prev.addEventListener("click", function () { show(i - 1); restart(); });
  if (next) next.addEventListener("click", function () { show(i + 1); restart(); });
  show(0);
  start();
})();

// ---------- Booking: session selection ----------
(function booking() {
  var select = document.getElementById("duration");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-session]"));
  if (!cards.length) return;
  function sync(value) {
    cards.forEach(function (c) {
      var on = c.getAttribute("data-session") === value;
      c.classList.toggle("selected", on);
      var btn = c.querySelector("[data-select]");
      if (btn) {
        btn.textContent = on ? "Selected" : "Select this session";
        btn.className = "btn btn-full " + (on ? "btn-hero" : "btn-outline");
      }
    });
    if (select) select.value = value;
  }
  cards.forEach(function (c) {
    var btn = c.querySelector("[data-select]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      sync(c.getAttribute("data-session"));
      var form = document.getElementById("booking-form");
      if (form) form.scrollIntoView({ behavior: "smooth" });
    });
  });
  if (select) select.addEventListener("change", function () { sync(select.value); });
  sync(select ? select.value : "60");
})();

// ---------- Forms ----------
/*
  This static build has no backend. Each form opens the visitor's email client
  with the details pre-filled so nothing is lost. To post to a real backend
  instead, replace mailtoSubmit() with a fetch() to your own endpoint.
*/
var CONTACT_EMAIL = "muriithifaith6@gmail.com";

function mailtoSubmit(subject, form, skipFields) {
  var lines = [];
  new FormData(form).forEach(function (value, key) {
    if (skipFields && skipFields.indexOf(key) !== -1) return;
    if (value instanceof File) { if (value.name) lines.push(key + ": " + value.name); return; }
    if (String(value).trim()) lines.push(key + ": " + value);
  });
  var href =
    "mailto:" + CONTACT_EMAIL +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(lines.join("\n"));
  window.location.href = href;
}

document.querySelectorAll("form[data-form]").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var kind = form.getAttribute("data-form");
    var subject =
      kind === "booking" ? "New session booking request" :
      kind === "card" ? "Card invoice request" :
      kind === "payment" ? "Payment confirmation" :
      "Website enquiry";
    mailtoSubmit(subject, form);
    if (kind === "booking") {
      toast("Appointment request ready to send", "Your email app opened with the session details — hit send and Dr. Faith will confirm within 24 hours.");
    } else if (kind === "card") {
      toast("Invoice request ready to send", "Send the opened email and you'll receive a secure invoice.");
    } else if (kind === "payment") {
      toast("Almost done", "Attach your payment screenshot to the opened email and send it.");
    } else {
      toast("Message ready to send", "Send the opened email and you'll hear back soon.");
    }
    form.reset();
  });
});

var dateInput = document.getElementById("date");
if (dateInput) {
  var today = new Date();
  var localDate = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");
  dateInput.min = localDate;
}

// ---------- Footer year ----------
document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = String(new Date().getFullYear());
});
