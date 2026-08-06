import { readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../index.html", import.meta.url);
let html = await readFile(pagePath, "utf8");

const replacements = [
  {
    name: "fondo fotográfico de portada",
    before: `      background:\n        linear-gradient(115deg, rgba(7, 26, 42, .98), rgba(13, 42, 66, .84)),\n        radial-gradient(circle at 80% 20%, rgba(201, 162, 77, .22), transparent 34%);`,
    after: `      background:\n        linear-gradient(115deg, rgba(7, 26, 42, .96), rgba(13, 42, 66, .67)),\n        radial-gradient(circle at 80% 20%, rgba(201, 162, 77, .20), transparent 34%),\n        url("/assets/images/hero-worship.webp") center 42% / cover no-repeat;`
  },
  {
    name: "fotografía de comunidad",
    before: `      background:\n        linear-gradient(145deg, rgba(13, 42, 66, .45), rgba(201, 162, 77, .12)),\n        linear-gradient(135deg, #d8e0e8, #aab8c6);`,
    after: `      background:\n        linear-gradient(145deg, rgba(7, 26, 42, .18), rgba(201, 162, 77, .10)),\n        url("/assets/images/community-prayer.webp") center 38% / cover no-repeat;`
  },
  {
    name: "descripción accesible de comunidad",
    before: `<div class="image-panel reveal" role="img" aria-label="Espacio para fotografía oficial">\n          <div class="image-panel-content">\n            <span>Espacio para fotografía oficial</span>\n            <small>Más adelante puede sustituirse por una fotografía de la iglesia, la comunidad o el ministerio.</small>\n          </div>\n        </div>`,
    after: `<div class="image-panel reveal" role="img" aria-label="Familias y líderes de la comunidad orando juntos">\n          <div class="image-panel-content">\n            <span>Una comunidad que ora y camina unida</span>\n            <small>Familias, discípulos y líderes creciendo en la Palabra y sirviendo con gracia.</small>\n          </div>\n        </div>`
  },
  {
    name: "logotipo estable del encabezado",
    before: `<img class="brand-logo" src="/assets/images/logo-luz-y-gracia-garden-grove.webp" alt="Logotipo oficial de Luz y Gracia Garden Grove">`,
    after: `<span class="brand-symbol" aria-hidden="true">LG</span>`
  },
  {
    name: "estilos unificados del logotipo",
    before: `    .brand-logo {\n      width: 66px;\n      height: 66px;\n      flex: 0 0 66px;\n      object-fit: contain;\n      border-radius: 14px;\n      background: #073d9c;\n      box-shadow: 0 8px 22px rgba(13, 42, 66, .20);\n    }\n\n    .brand-symbol {\n      display: grid;\n      place-items: center;\n      width: 48px;\n      height: 48px;\n      border-radius: 50%;\n      color: var(--gold-light);\n      background: linear-gradient(145deg, var(--navy), var(--navy-light));\n      font-family: "Libre Baskerville", Georgia, serif;\n      font-weight: 700;\n      box-shadow: 0 8px 22px rgba(13, 42, 66, .2);\n    }`,
    after: `    .brand-symbol {\n      display: grid;\n      place-items: center;\n      width: 66px;\n      height: 66px;\n      flex: 0 0 66px;\n      border: 2px solid rgba(227, 199, 126, .28);\n      border-radius: 50%;\n      color: var(--gold-light);\n      background: linear-gradient(145deg, var(--navy), var(--navy-light));\n      font-family: "Libre Baskerville", Georgia, serif;\n      font-size: 1.25rem;\n      font-weight: 700;\n      line-height: 1;\n      letter-spacing: -.04em;\n      box-shadow: 0 8px 22px rgba(13, 42, 66, .20);\n    }\n\n    .footer-brand .brand-symbol {\n      width: 72px;\n      height: 72px;\n      flex-basis: 72px;\n      font-size: 1.35rem;\n    }`
  }
];

for (const replacement of replacements) {
  if (html.includes(replacement.after)) continue;
  if (!html.includes(replacement.before)) {
    throw new Error(`No se encontró el bloque esperado: ${replacement.name}`);
  }
  html = html.replace(replacement.before, replacement.after);
}

const preload = `  <link rel="preload" as="image" href="/assets/images/hero-worship.webp" type="image/webp" fetchpriority="high">\n`;
if (!html.includes("href=\"/assets/images/hero-worship.webp\"")) {
  html = html.replace("</head>", `${preload}</head>`);
}

await writeFile(pagePath, html, "utf8");
console.log("Fotografías y logotipo institucional integrados correctamente en index.html.");
