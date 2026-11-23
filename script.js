/* ============================================================
   Elites Lounge — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- CONFIG: change this to the salon's real WhatsApp number ----
     International format, digits only, no "+" and no spaces.
     e.g. Nigeria 0806 837 7631  ->  "2348068377631"                  */
  var WHATSAPP_NUMBER = "2348000000000";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------
     1. Mobile nav
     ------------------------------------------------------------ */
  var toggle = $("#navToggle");
  var links  = $("#navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // close after tapping a link
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------
     2. Sticky nav shadow
     ------------------------------------------------------------ */
  var nav = $("#nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------
     3. Reveal on scroll
     ------------------------------------------------------------ */
  var targets = $$(
    ".section__head, .svc, .why__copy, .why__list li, .member, .shot, .book__panel, .book__aside"
  );

  if ("IntersectionObserver" in window) {
    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 6) * 55 + "ms";
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------
     4. Footer year
     ------------------------------------------------------------ */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     5. Booking form -> WhatsApp
     ------------------------------------------------------------ */
  var form = $("#bookForm");
  var hint = $("#formHint");

  var say = function (msg, isError) {
    if (!hint) return;
    hint.textContent = msg;
    hint.classList.toggle("is-error", !!isError);
  };

  var prettyDate = function (value) {
    if (!value) return "";
    var parts = value.split("-");
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    if (isNaN(d)) return value;
    return d.toLocaleDateString(undefined, {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  };

  var prettyTime = function (value) {
    if (!value) return "";
    var hm = value.split(":");
    var h = +hm[0];
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 || 12;
    return h12 + ":" + hm[1] + " " + suffix;
  };

  if (form) {
    // don't allow booking in the past
    var dateInput = $("#date", form);
    if (dateInput) {
      var today = new Date();
      var iso = today.getFullYear() + "-" +
                String(today.getMonth() + 1).padStart(2, "0") + "-" +
                String(today.getDate()).padStart(2, "0");
      dateInput.min = iso;
      if (!dateInput.value) dateInput.value = iso;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = {
        name:    ($("#name",    form).value || "").trim(),
        service:  $("#service", form).value,
        date:     $("#date",    form).value,
        time:     $("#time",    form).value,
        barber:   $("#barber",  form).value,
        notes:   ($("#notes",   form).value || "").trim()
      };

      if (!data.name)  { say("Please add your name so we know who to expect.", true); $("#name", form).focus(); return; }
      if (!data.date)  { say("Pick a date for your appointment.", true); $("#date", form).focus(); return; }
      if (!data.time)  { say("Pick a time for your appointment.", true); $("#time", form).focus(); return; }

      var lines = [
        "Hello Elites Lounge, I'd like to book a chair.",
        "",
        "Name: "    + data.name,
        "Service: " + data.service,
        "Date: "    + prettyDate(data.date),
        "Time: "    + prettyTime(data.time),
        "Barber: "  + (data.barber || "No preference")
      ];
      if (data.notes) lines.push("Notes: " + data.notes);

      var url = "https://wa.me/" + WHATSAPP_NUMBER +
                "?text=" + encodeURIComponent(lines.join("\n"));

      say("Opening WhatsApp with your booking…");

      // window.open can be blocked (popup blockers, sandboxed frames) -> fall back
      var win = window.open(url, "_blank", "noopener");
      if (!win) {
        try { window.location.href = url; }
        catch (err) { say("Couldn't open WhatsApp automatically — please call us instead.", true); }
      }
    });
  }
})();
