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
     1. Theme (light / dark)

     The theme is already applied by the inline script in <head>,
     so all this does is wire the button, remember the choice and
     keep following the OS until the visitor picks a side.
     ------------------------------------------------------------ */
  var STORAGE_KEY = "el-theme";
  var root  = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  var THEME_COLOR = { dark: "#0d0d0f", light: "#f6f3ec" };

  var readSaved = function () {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) { return null; }
  };

  var systemTheme = function () {
    return media && media.matches ? "light" : "dark";
  };

  var themeBtn = document.getElementById("themeToggle");
  var themeMeta = document.getElementById("themeColor");

  var applyTheme = function (theme) {
    root.setAttribute("data-theme", theme);

    if (themeMeta) themeMeta.setAttribute("content", THEME_COLOR[theme] || THEME_COLOR.dark);

    if (themeBtn) {
      var next = theme === "light" ? "dark" : "light";
      var label = "Switch to " + next + " mode";
      themeBtn.setAttribute("aria-label", label);
      themeBtn.setAttribute("title", label);
      // pressed = "light mode is on"
      themeBtn.setAttribute("aria-pressed", String(theme === "light"));
    }
  };

  applyTheme(readSaved() || systemTheme());

  // let colours animate only after the first paint
  requestAnimationFrame(function () { root.classList.add("theme-ready"); });

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  // follow the OS until the visitor has made a choice of their own
  if (media) {
    var onSystemChange = function () {
      if (!readSaved()) applyTheme(systemTheme());
    };
    if (media.addEventListener) media.addEventListener("change", onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  /* ------------------------------------------------------------
     2. Mobile nav
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
     3. Sticky nav shadow
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
     4. Reveal on scroll
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
     5. Footer year
     ------------------------------------------------------------ */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     6. Booking form -> WhatsApp
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
