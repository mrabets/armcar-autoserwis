const root = document.documentElement;
root.classList.add("js");

const dictionary = {
  pl: {
    mapTitle: "Mapa Google: ARMCAR Autoserwis, Wał Zawadowski 135, Warszawa",
    zoom: "Powiększ zdjęcie",
    copied: "Tekst skopiowany. Otwórz Instagram i wklej go w wiadomości do @armcarpl.",
    copyFailed: "Nie udało się skopiować automatycznie. Zaznacz tekst i skopiuj go ręcznie."
  },
  ru: {
    mapTitle: "Карта Google: ARMCAR Autoserwis, Wał Zawadowski 135, Варшава",
    zoom: "Увеличить фото",
    copied: "Текст скопирован. Откройте Instagram и вставьте его в сообщение для @armcarpl.",
    copyFailed: "Не получилось скопировать автоматически. Выделите текст и скопируйте его вручную."
  }
};

const text = root.lang === "ru" ? dictionary.ru : dictionary.pl;
const supportsDialog = typeof HTMLDialogElement === "function" && "showModal" in HTMLDialogElement.prototype;

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

if (header && menuToggle && menu) {
  const desktop = window.matchMedia("(min-width: 1000px)");
  const isOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

  const setMenu = (open, returnFocus) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    header.classList.toggle("is-menu-open", open);
    if (open) {
      const first = menu.querySelector("a");
      if (first) {
        first.focus();
      }
    } else if (returnFocus) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener("click", () => setMenu(!isOpen(), false));

  menu.addEventListener("click", (event) => {
    if (isOpen() && event.target.closest("a")) {
      setMenu(false, false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setMenu(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    if (isOpen() && !header.contains(event.target)) {
      setMenu(false, false);
    }
  });

  header.addEventListener("focusout", (event) => {
    if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
      setMenu(false, false);
    }
  });

  const closeOnDesktop = (event) => {
    if (event.matches && isOpen()) {
      setMenu(false, false);
    }
  };

  if (typeof desktop.addEventListener === "function") {
    desktop.addEventListener("change", closeOnDesktop);
  } else {
    desktop.addListener(closeOnDesktop);
  }
}

const map = document.querySelector("[data-map]");
const mapButton = document.querySelector("[data-map-load]");
const mapNote = document.querySelector("[data-map-note]");

if (map && mapButton) {
  mapButton.hidden = false;
  if (mapNote) {
    mapNote.hidden = false;
  }

  mapButton.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.className = "map__frame";
    frame.src = map.dataset.mapSrc || "";
    frame.title = text.mapTitle;
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allowFullscreen = true;
    const placeholder = map.querySelector(".map__placeholder");
    if (placeholder) {
      placeholder.hidden = true;
    }
    map.append(frame);
    map.focus({ preventScroll: true });
  }, { once: true });
}

const openers = new WeakMap();

const openDialog = (dialog, opener) => {
  openers.set(dialog, opener);
  dialog.showModal();
};

if (supportsDialog) {
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-dialog-close]")) {
        dialog.close();
      }
    });
    dialog.addEventListener("close", () => {
      const opener = openers.get(dialog);
      if (opener && document.contains(opener)) {
        opener.focus();
      }
    });
  });
}

const lightbox = document.querySelector("[data-lightbox]");

if (lightbox && supportsDialog) {
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");

  document.querySelectorAll("[data-zoom]").forEach((image) => {
    const figure = image.closest("figure");
    const caption = figure ? figure.querySelector("figcaption") : null;
    const label = caption ? caption.textContent.trim() : image.alt;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery__zoom";
    button.setAttribute("aria-label", `${text.zoom}: ${label}`);
    image.replaceWith(button);
    button.append(image);

    button.addEventListener("click", () => {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxImage.width = Number(image.getAttribute("width")) || 0;
      lightboxImage.height = Number(image.getAttribute("height")) || 0;
      lightboxCaption.textContent = label;
      openDialog(lightbox, button);
    });
  });
}

const messageDialog = document.querySelector("[data-message-dialog]");

if (messageDialog && supportsDialog) {
  const field = messageDialog.querySelector("[data-message-text]");
  const copyButton = messageDialog.querySelector("[data-message-copy]");
  const status = messageDialog.querySelector("[data-message-status]");

  document.querySelectorAll("[data-message-open]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      status.textContent = "";
      openDialog(messageDialog, button);
      field.focus();
    });
  });

  const fallbackCopy = () => {
    field.focus();
    field.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    }
  };

  copyButton.addEventListener("click", async () => {
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(field.value);
        copied = true;
      } catch {
        copied = fallbackCopy();
      }
    } else {
      copied = fallbackCopy();
    }
    status.textContent = copied ? text.copied : text.copyFailed;
  });

  field.addEventListener("input", () => {
    status.textContent = "";
  });
}
