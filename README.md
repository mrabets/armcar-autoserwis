# ARMCAR Autoserwis website

Static Polish and Russian website for ARMCAR Autoserwis, Wał Zawadowski 135, 02-986 Warszawa. No build step, no dependencies, no analytics, no cookies set by the site itself.

## Structure

- `index.html`: Polish home page (primary language)
- `ru/index.html`: full Russian home page
- `prywatnosc.html`, `ru/privacy.html`: short privacy pages
- `assets/css/styles.css`: all styles
- `assets/css/fonts.css`, `assets/fonts/`: self-hosted IBM Plex WOFF2 files and `LICENSE.txt` (SIL Open Font License). IBM Plex Mono is declared but not used, so browsers do not download it.
- `assets/js/main.js`: mobile menu, map loading on request, photo dialog, optional message text helper
- `assets/img/`: real photos published by ARMCAR on Google Maps and the Instagram profile logo
- `robots.txt`: crawling allowed, no sitemap declared
- `sitemap.xml`: intentionally empty

All paths are relative, so the site works from a GitHub Pages project subfolder. Open `/` for Polish and `/ru/` for Russian when serving locally, for example with `python3 -m http.server 8080`.

## Page sections

Header (4 links, language switch, call button) / hero with photo, short address and hours / trust strip (Google rating with date, Orły Motoryzacji 2026 award, location) / services in 6 groups / walnut blasting intake cleaning / about, process and photos / review excerpts / FAQ / contacts with full hours and map / footer. On screens below 760px a bottom bar shows Call, Route and Instagram.

## Behaviour without JavaScript

Navigation is visible as a plain link row, FAQ uses native `details`, all phone, Instagram and Google Maps links work. The map button, photo enlargement and message helper appear only when JavaScript runs.

## Data sources (verified 6 October 2026)

- Address, phone, hours, coordinates and place ID: Google Maps listing `ChIJrZZSLTnTHkcRetHvms2TYNY`
- Services: owner post on Google Maps, 7 April 2026. Only services named in that post are listed
- Rating: 4.7/5 from 162 Google reviews, shown with the date it was checked
- Award: https://www.orlymotoryzacji.pl/profile-1550692-armcar-autoserwis (only the 2026 award is shown; the organiser's own score is not mixed with Google)
- Walnut blasting: Instagram highlight on @armcarpl and owner interview, 25 August 2025
- Review excerpts: three short 5-star Google reviews, originally in Russian; the Polish page marks them as translated

The JSON-LD `AutoRepair` block contains only real business data. It intentionally has no `url`, `aggregateRating`, `review` or `offers`: the GitHub Pages address is not the company's own website.

## Published URLs

- Polish: https://mrabets.github.io/armcar-autoserwis/
- Russian: https://mrabets.github.io/armcar-autoserwis/ru/

Canonical URLs, language alternates and Open Graph URLs use this root. Update all of them together when moving to a business domain.

## Indexing

Indexing is currently disabled. All four HTML pages carry `<meta name="robots" content="noindex, follow">`, `sitemap.xml` has no URLs and `robots.txt` does not declare it. Crawling stays allowed in `robots.txt`, otherwise search engines cannot read `noindex`.

To enable indexing:

1. Remove the `robots` meta tag from `index.html`, `ru/index.html`, `prywatnosc.html` and `ru/privacy.html`.
2. If the site moves to a business domain, update canonical, `hreflang` and Open Graph URLs first. The JSON-LD `url` may then point to that domain.
3. Add the four page URLs of the final root to `sitemap.xml`.
4. Add `Sitemap: <root>/sitemap.xml` to `robots.txt`.

## Maintenance

1. Update the Google rating, review count and verification date in both languages when they change.
2. Do not invent legal company identifiers. Confirm any new prices, warranties, contact channels, equipment or manufacturer partnerships before publishing them.
3. Keep translations equivalent, including labels and accessible names.
4. Images: workshop 773x580 (an Audi beside a lift), bodywork 609x812, repair 773x580, all published by ARMCAR in Google Maps.
5. Business photos, reviews and contacts belong to ARMCAR and must not be reused for another business. Reusable design notes are kept in the private working repository under `docs/patterns/`, not here.
