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
console.log("Fotografías eclesiásticas premium integradas en index.html.");
