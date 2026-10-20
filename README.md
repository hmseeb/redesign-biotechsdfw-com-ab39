# BioTechs Crime & Trauma Scene Cleaning — website

Conversion-focused static website for **BioTechs Crime & Trauma Scene Cleaning**,
a crime, trauma, biohazard and hoarding cleanup company serving Fort Worth,
Dallas and the surrounding Dallas–Fort Worth metroplex, 24 hours a day,
7 days a week.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies. Deploy the
repository root as a static site.

## Structure

```
index.html                        Home — hero with above-the-fold quote form, services,
                                  process, trust, service areas, CTA
about/index.html                  About us + Who we serve (#who-we-serve)
biohazard-services/index.html     Biohazard & trauma services (anchor per service)
hoarding-cleanup-services/        Hoarding, clutter, encampment, odor, disinfection
areas-we-service/index.html       Fort Worth & Dallas offices, coverage
contact-us/index.html             Phone, email, addresses, contact form
terms-of-service/                 Legal
privacy-policy/                   Legal
accessibility-statement/          Legal
assets/css/styles.css             Design system and all page styles
assets/js/main.js                 Nav, scroll reveal, form submission handling
images/source/                    Images carried over from the previous site
favicon.svg  robots.txt  sitemap.xml
```

## Forms

Every form posts to LeadrVision:

```
POST https://vision.leadrai.com/api/forms/27e10beb5635736ba86fe5668b1bdff4
```

- Plain HTML `method="POST"` works with JavaScript disabled; the visitor returns
  with `?submitted=1` and sees the confirmation message.
- With JavaScript, `assets/js/main.js` posts the same fields as JSON to the same
  URL and shows the confirmation inline when the response is `{"ok": true}`.
- Each form includes `_form` (human-readable form name), `_page`
  (`window.location.href`, set on load and in the JSON body) and a hidden
  `_gotcha` honeypot. Contact fields use `name`, `email` and `phone`.

## Contact details used on the site

- Fort Worth: (817) 270-6363 — 9500 Ray White Road, Suite 200, Fort Worth, TX 76244
- Dallas: (469) 240-2020 — 13355 Noel Road, Suite 1100, Dallas, TX 75240
- Email: jesse@biotechsdfw.com
- Hours: 24 hours a day, 7 days a week
