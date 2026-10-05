const root = document.documentElement;
root.classList.add("js");

const dictionary = {
  pl: {
    greeting: "Dzień dobry, chcę umówić wizytę w warsztacie.",
    area: "Usługa",
    car: "Samochód",
    issue: "Opis",
    copied: "Tekst skopiowany. Wklej go w wiadomości na Instagramie.",
    copyFailed: "Nie udało się skopiować automatycznie. Zaznacz tekst i skopiuj go ręcznie.",
    mapTitle: "Mapa Google: ARMCAR Autoserwis, Wał Zawadowski 135, Warszawa"
  },
  ru: {
    greeting: "Здравствуйте! Хочу записаться в сервис.",
    area: "Услуга",
    car: "Автомобиль",
    issue: "Описание",
    copied: "Текст скопирован. Вставьте его в сообщение в Instagram.",
    copyFailed: "Не получилось скопировать автоматически. Выделите текст и скопируйте его вручную.",
    mapTitle: "Карта Google: ARMCAR Autoserwis, Wał Zawadowski 135, Warszawa"
  }
};

const text = root.lang === "ru" ? dictionary.ru : dictionary.pl;

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (header && menuToggle && menu) {
  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("is-menu-open", open);
  };

  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.matchMedia("(min-width: 900px)").addEventListener("change", (event) => {
    if (event.matches) {
      setMenu(false);
    }
  });
}

const services = document.querySelector("[data-services]");

if (services) {
  const items = Array.from(services.querySelectorAll("[data-service]"));
  const parts = Array.from(services.querySelectorAll("[data-zone]"));
  const canHover = window.matchMedia("(hover: hover)").matches;

  const highlight = (zone) => {
    parts.forEach((part) => {
      part.classList.toggle("is-active", part.dataset.zone === zone);
    });
  };

  const showOpen = () => {
    const open = items.find((item) => item.open);
    highlight(open ? open.dataset.service : "");
  };

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) {
            other.open = false;
          }
        });
      }
      showOpen();
    });
    if (canHover) {
      item.addEventListener("mouseenter", () => highlight(item.dataset.service));
      item.addEventListener("mouseleave", showOpen);
    }
  });

  parts.forEach((part) => {
    part.addEventListener("click", () => {
      const item = items.find((entry) => entry.dataset.service === part.dataset.zone);
      if (item) {
        item.open = true;
        item.scrollIntoView({ block: "nearest" });
      }
    });
    if (canHover) {
      part.addEventListener("mouseenter", () => highlight(part.dataset.zone));
      part.addEventListener("mouseleave", showOpen);
    }
  });

  const openFromHash = () => {
    let id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const item = items.find((entry) => entry.id === id);
    if (item) {
      item.open = true;
    }
  };

  window.addEventListener("hashchange", openFromHash);
  openFromHash();
  showOpen();
}

const builder = document.querySelector("[data-builder]");

if (builder) {
  const preview = builder.querySelector("[data-preview]");
  const copyButton = builder.querySelector("[data-copy]");
  const status = builder.querySelector("[data-status]");

  const compose = () => {
    const data = new FormData(builder);
    const read = (key) => String(data.get(key) || "").trim();
    const entries = [
      [text.area, read("area")],
      [text.car, read("car")],
      [text.issue, read("issue")]
    ];
    const lines = [text.greeting];
    entries.forEach(([label, value]) => {
      if (value) {
        lines.push(`${label}: ${value}`);
      }
    });
    return lines.join("\n");
  };

  const update = () => {
    if (preview) {
      preview.textContent = compose();
    }
    if (status) {
      status.textContent = "";
    }
  };

  const fallbackCopy = (value) => {
    const buffer = document.createElement("textarea");
    buffer.value = value;
    buffer.setAttribute("readonly", "");
    buffer.className = "copy-buffer";
    document.body.append(buffer);
    buffer.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    buffer.remove();
    return copied;
  };

  const copyMessage = async () => {
    const message = compose();
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(message);
        copied = true;
      } catch {
        copied = fallbackCopy(message);
      }
    } else {
      copied = fallbackCopy(message);
    }
    if (status) {
      status.textContent = copied ? text.copied : text.copyFailed;
    }
  };

  builder.addEventListener("input", update);
  builder.addEventListener("change", update);
  builder.addEventListener("submit", (event) => event.preventDefault());

  if (copyButton) {
    copyButton.addEventListener("click", copyMessage);
  }

  update();
}

const map = document.querySelector("[data-map]");
const mapButton = document.querySelector("[data-map-load]");

if (map && mapButton) {
  mapButton.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.className = "map__frame";
    frame.src = map.dataset.mapSrc || "";
    frame.title = text.mapTitle;
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allowFullscreen = true;
    map.append(frame);
    map.hidden = false;
    mapButton.hidden = true;
    map.focus({ preventScroll: true });
  }, { once: true });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
