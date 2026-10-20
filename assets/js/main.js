/* BioTechs Crime & Trauma Scene Cleaning — site behaviour
   Vanilla JS. Progressive enhancement only: every form works without this file. */
(function () {
  "use strict";

  var ENDPOINT = "https://vision.leadrai.com/api/forms/27e10beb5635736ba86fe5668b1bdff4";
  var THANKS = "Thanks, your message was sent. A BioTechs technician will contact you shortly — for immediate help call (817) 270-6363.";

  /* ---------------------------------------------------------- mobile nav */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 960) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------- sticky header */
  function initHeader() {
    var header = document.querySelector(".header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------- reveal on scroll */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    Array.prototype.forEach.call(items, function (el) {
      io.observe(el);
    });
  }

  /* ----------------------------------------------------------- form logic */
  function setPageFields() {
    var fields = document.querySelectorAll('input[name="_page"]');
    Array.prototype.forEach.call(fields, function (f) {
      f.value = window.location.href;
    });
  }

  function statusFor(form) {
    var id = form.getAttribute("data-status");
    return id ? document.getElementById(id) : null;
  }

  function showStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("form-status--error", !!isError);
    el.hidden = false;
    el.setAttribute("role", "status");
  }

  function initForms() {
    var forms = document.querySelectorAll("form[data-leadr]");

    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener("submit", function (e) {
        if (!window.fetch || !window.FormData) return; // plain POST fallback
        if (typeof form.checkValidity === "function" && !form.checkValidity()) return;

        e.preventDefault();

        var status = statusFor(form);
        var button = form.querySelector('button[type="submit"]');
        var originalLabel = button ? button.innerHTML : "";
        var pageField = form.querySelector('input[name="_page"]');
        if (pageField) pageField.value = window.location.href;

        if (button) {
          button.disabled = true;
          button.innerHTML = "Sending…";
        }

        var payload = {};
        new FormData(form).forEach(function (value, key) {
          if (payload[key] !== undefined) {
            payload[key] = payload[key] + ", " + value;
          } else {
            payload[key] = value;
          }
        });
        payload._page = window.location.href;

        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().catch(function () {
              return { ok: res.ok };
            });
          })
          .then(function (data) {
            if (data && data.ok) {
              form.reset();
              setPageFields();
              showStatus(status, THANKS, false);
              if (button) {
                button.disabled = false;
                button.innerHTML = originalLabel;
              }
              if (status && typeof status.scrollIntoView === "function") {
                status.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            } else {
              throw new Error("Submission rejected");
            }
          })
          .catch(function () {
            if (button) {
              button.disabled = false;
              button.innerHTML = originalLabel;
            }
            showStatus(
              status,
              "Sorry — that didn’t go through. Please call (817) 270-6363 or email jesse@biotechsdfw.com and we’ll respond right away.",
              true
            );
          });
      });
    });
  }

  /* ------------------------------------------------ ?submitted=1 handling */
  function initSubmittedNotice() {
    if (window.location.search.indexOf("submitted=1") === -1) return;
    var status = document.querySelector(".form-status");
    if (status) {
      showStatus(status, THANKS, false);
      if (typeof status.scrollIntoView === "function") {
        status.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  /* ----------------------------------------------- prefill service select */
  function initServicePrefill() {
    var hash = window.location.hash.replace("#", "");
    if (!hash) return;
    var select = document.querySelector('select[name="Service needed"]');
    if (!select) return;
    var wanted = decodeURIComponent(hash).replace(/-/g, " ").toLowerCase();
    Array.prototype.forEach.call(select.options, function (opt) {
      if (opt.value.toLowerCase() === wanted) select.value = opt.value;
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initNav();
    initHeader();
    initReveal();
    setPageFields();
    initForms();
    initSubmittedNotice();
    initServicePrefill();
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
