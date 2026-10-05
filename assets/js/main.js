const root = document.documentElement;
root.classList.add("js");

const dictionary = {
  pl: {
    greeting: "Dzień dobry, chcę umówić wizytę w warsztacie.",
    area: "Usługa",
    car: "Samochód",
    issue: "Opis",
    copied: "Tekst skopiowany. Wklej go do wiadomości na Instagramie.",
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

const diagram = document.querySelector("[data-diagram]");

if (diagram) {
  const buttons = Array.from(diagram.querySelectorAll("[data-zone-button]"));
  const shapes = Array.from(diagram.querySelectorAll("[data-zone]"));
  const canHover = window.matchMedia("(hover: hover)").matches;

  const selectZone = (zone) => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.zoneButton === zone));
    });
    const selected = buttons.find((button) => button.dataset.zoneButton === zone);
    const link = diagram.querySelector("[data-service-link]");
    const label = diagram.querySelector("[data-service-label]");
    if (selected && link && label) {
      link.setAttribute("href", `#${selected.dataset.serviceId}`);
      label.textContent = `${root.lang === "ru" ? "Подробнее" : "Szczegóły"}: ${selected.querySelector(".legend__title").textContent}`;
    }
    shapes.forEach((shape) => {
      shape.classList.toggle("is-active", shape.dataset.zone === zone);
    });
  };

  buttons.forEach((button) => {
    const zone = button.dataset.zoneButton || "1";
    button.addEventListener("click", () => selectZone(zone));
    if (canHover) {
      button.addEventListener("mouseenter", () => selectZone(zone));
    }
  });

  shapes.forEach((shape) => {
    shape.addEventListener("click", () => selectZone(shape.dataset.zone || "1"));
  });

  selectZone("1");
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
    const message = compose();
    if (preview) {
      preview.textContent = message;
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

if (map) {
  const loadButton = map.querySelector("[data-map-load]");
  const placeholder = map.querySelector("[data-map-placeholder]");

  if (loadButton) {
    loadButton.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.className = "map__frame";
      frame.src = map.dataset.mapSrc || "";
      frame.title = text.mapTitle;
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.allowFullscreen = true;
      map.append(frame);
      map.classList.add("is-loaded");
      if (placeholder) {
        placeholder.hidden = true;
      }
    });
  }
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
