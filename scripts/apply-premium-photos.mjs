import { readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../index.html", import.meta.url);
const communityImagePath = new URL("../assets/images/community-prayer.webp", import.meta.url);
const communityImageParts = [
  new URL("../assets/data/community-prayer/part-01.txt", import.meta.url),
  new URL("../assets/data/community-prayer/part-02.txt", import.meta.url),
  new URL("../assets/data/community-prayer/part-03.txt", import.meta.url),
  new URL("../assets/data/community-prayer/part-04.txt", import.meta.url)
];

const communityImageBase64 = (
  await Promise.all(communityImageParts.map((part) => readFile(part, "utf8")))
).join("").replace(/\s+/g, "");

await writeFile(
  communityImagePath,
  Buffer.from(communityImageBase64, "base64")
);

let html = await readFile(pagePath, "utf8");

const emblem = `<span class="brand-emblem" aria-hidden="true">
  <svg viewBox="0 0 120 120" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="116" rx="24" fill="#063B91"/>
    <path d="M12 35 Q29 18 44 12 Q31 30 17 46 Z" fill="#F3C85B"/>
    <path d="M108 35 Q91 18 76 12 Q89 30 103 46 Z" fill="#F3C85B"/>
    <path d="M12 85 Q29 102 44 108 Q31 90 17 74 Z" fill="#D9AA39"/>
    <path d="M108 85 Q91 102 76 108 Q89 90 103 74 Z" fill="#D9AA39"/>
    <path d="M60 15 L103 60 L60 105 L17 60 Z" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"/>
    <path d="M52 34 H68 V51 H84 V68 H68 V96 H52 V68 H36 V51 H52 Z" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="miter"/>
    <path d="M60 34 L63 56 L86 60 L63 64 L60 89 L57 64 L34 60 L57 56 Z" fill="#F3C85B"/>
  </svg>
</span>`;

const replacements = [
  {
    name: "fondo fotográfico de portada",
    before: `      background:\n        linear-gradient(115deg, rgba(7, 26, 42, .98), rgba(13, 42, 66, .84)),\n        radial-gradient(circle at 80% 20%, rgba(201, 162, 77, .22), transparent 34%);`,
    after: `      background:\n        linear-gradient(115deg, rgba(7, 26, 42, .96), rgba(13, 42, 66, .67)),\n        radial-gradient(circle at 80% 20%, rgba(201, 162, 77, .20), transparent 34%),\n        url("/assets/images/hero-worship.webp") center 42% / cover no-repeat;`
  },
  {
    name: "fotografía de comunidad",
    before: `      background:\n        linear-gradient(145deg, rgba(13, 42, 66, .45), rgba(201, 162, 77, .12)),\n        linear-gradient(135deg, #d8e0e8, #aab8c6);`,
    after: `      background:\n        linear-gradient(145deg, rgba(7, 26, 42, .12), rgba(201, 162, 77, .08)),\n        url("/assets/images/community-prayer.webp") center 55% / cover no-repeat;`
  },
  {
    name: "descripción accesible de comunidad",
    before: `<div class="image-panel reveal" role="img" aria-label="Espacio para fotografía oficial">\n          <div class="image-panel-content">\n            <span>Espacio para fotografía oficial</span>\n            <small>Más adelante puede sustituirse por una fotografía de la iglesia, la comunidad o el ministerio.</small>\n          </div>\n        </div>`,
    after: `<div class="image-panel reveal" role="img" aria-label="Familias, adultos y niños de la comunidad reunidos en oración">\n          <div class="image-panel-content">\n            <span>Una comunidad que ora y camina unida</span>\n            <small>Familias, niños, discípulos y líderes creciendo en la Palabra y sirviendo con gracia.</small>\n          </div>\n        </div>`
  }
];

for (const replacement of replacements) {
  if (html.includes(replacement.after)) continue;
  if (!html.includes(replacement.before)) {
    throw new Error(`No se encontró el bloque esperado: ${replacement.name}`);
  }
  html = html.replace(replacement.before, replacement.after);
}

html = html.replace(
  `<img class="brand-logo" src="/assets/images/logo-luz-y-gracia-garden-grove.webp" alt="Logotipo oficial de Luz y Gracia Garden Grove">`,
  emblem
);

html = html.replace(
  `<span class="brand-symbol">LG</span><span class="brand-text"><strong>Ministerios Luz y Gracia</strong><small>Light &amp; Grace Ministries</small></span>`,
  `${emblem}<span class="brand-text"><strong>Ministerios Luz y Gracia</strong><small>Light &amp; Grace Ministries</small></span>`
);

const emblemStyles = `
    .brand-emblem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 66px;
      height: 66px;
      flex: 0 0 66px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 22px rgba(13, 42, 66, .20);
    }
    .brand-emblem svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .footer-brand .brand-emblem {
      width: 72px;
      height: 72px;
      flex-basis: 72px;
    }
`;

if (!html.includes(".brand-emblem {")) {
  html = html.replace("</style>", `${emblemStyles}</style>`);
}

const preload = `  <link rel="preload" as="image" href="/assets/images/hero-worship.webp" type="image/webp" fetchpriority="high">\n`;
if (!html.includes("href=\"/assets/images/hero-worship.webp\"")) {
  html = html.replace("</head>", `${preload}</head>`);
}

await writeFile(pagePath, html, "utf8");
console.log("Fotografías, familia con niños y emblema oficial de Luz y Gracia integrados correctamente.");
