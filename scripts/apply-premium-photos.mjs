import { mkdir, readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../index.html", import.meta.url);
const englishDirectory = new URL("../en/", import.meta.url);
const englishPagePath = new URL("../en/index.html", import.meta.url);
const communityImagePath = new URL("../assets/images/community-prayer-family-v3.webp", import.meta.url);
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
    after: `      background:\n        linear-gradient(145deg, rgba(7, 26, 42, .12), rgba(201, 162, 77, .08)),\n        url("/assets/images/community-prayer-family-v3.webp") center 55% / cover no-repeat;`
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

let englishHtml = html;
const englishReplacements = [
  [`<html lang="es">`, `<html lang="en">`],
  [`<meta name="description" content="Ministerios Luz y Gracia proclama el evangelio de Jesucristo, forma discípulos, fortalece familias y colabora en la multiplicación de iglesias bíblicas.">`, `<meta name="description" content="Light & Grace Ministries proclaims the gospel of Jesus Christ, makes disciples, strengthens families, and partners in the multiplication of biblical churches.">`],
  [`<title>Ministerios Luz y Gracia | Una iglesia local con una misión global</title>`, `<title>Light & Grace Ministries | A local church with a global mission</title>`],
  [`<link rel="canonical" href="https://luzygraciagardengrove.org/">`, `<link rel="canonical" href="https://luzygraciagardengrove.org/en/">`],
  [`<meta property="og:locale" content="es_US">`, `<meta property="og:locale" content="en_US">`],
  [`<meta property="og:title" content="Ministerios Luz y Gracia | Garden Grove">`, `<meta property="og:title" content="Light & Grace Ministries | Garden Grove">`],
  [`<meta property="og:description" content="Una iglesia local con una misión global. Luz para el camino. Gracia para la vida.">`, `<meta property="og:description" content="A local church with a global mission. Light for the journey. Grace for life.">`],
  [`<meta property="og:url" content="https://luzygraciagardengrove.org/">`, `<meta property="og:url" content="https://luzygraciagardengrove.org/en/">`],
  [`Saltar al contenido`, `Skip to content`],
  [`aria-label="Ministerios Luz y Gracia, página principal"`, `aria-label="Light & Grace Ministries, home page"`],
  [`aria-label="Abrir menú"`, `aria-label="Open menu"`],
  [`aria-label="Navegación principal"`, `aria-label="Main navigation"`],
  [`>Nosotros<`, `>About<`],
  [`>Nuestra fe<`, `>Our Faith<`],
  [`>Ministerios<`, `>Ministries<`],
  [`>Oración<`, `>Prayer<`],
  [`>Donar<`, `>Give<`],
  [`>Contacto<`, `>Contact<`],
  [`<a class="language-link" href="/en/">English</a>`, `<a class="language-link" href="/">Español</a>`],
  [`Una iglesia local con una misión global`, `A local church with a global mission`],
  [`Luz para el camino.<span>Gracia para la vida.</span>`, `Light for the journey.<span>Grace for life.</span>`],
  [`Compartimos el evangelio de Jesucristo, fortalecemos familias, formamos discípulos y colaboramos en la multiplicación de iglesias bíblicas.`, `We share the gospel of Jesus Christ, strengthen families, make disciples, and partner in the multiplication of biblical churches.`],
  [`Enviar petición de oración`, `Send a prayer request`],
  [`Apoyar la misión`, `Support the mission`],
  [`¿Cómo podemos servirte?`, `How can we serve you?`],
  [`Necesito oración`, `I need prayer`],
  [`Deseo conocer a Cristo`, `I want to know Christ`],
  [`Quiero visitar la iglesia`, `I want to visit the church`],
  [`Deseo apoyar la misión`, `I want to support the mission`],
  [`Quiénes somos`, `Who we are`],
  [`Una comunidad guiada por la Palabra, la oración y la misión.`, `A community guided by the Word, prayer, and mission.`],
  [`Ministerios Luz y Gracia existe para glorificar a Dios proclamando el evangelio de Jesucristo, formando discípulos, fortaleciendo familias y colaborando con iglesias y líderes para alcanzar nuevas comunidades.`, `Light & Grace Ministries exists to glorify God by proclaiming the gospel of Jesus Christ, making disciples, strengthening families, and partnering with churches and leaders to reach new communities.`],
  [`“Porque Dios, que mandó que de las tinieblas resplandeciese la luz, es el que resplandeció en nuestros corazones…”`, `“Seeing it is God who said, ‘Light will shine out of darkness,’ who has shone in our hearts…”`],
  [`— 2 Corintios 4:6, RVR 1909`, `— 2 Corinthians 4:6, WEB`],
  [`aria-label="Familias, adultos y niños de la comunidad reunidos en oración"`, `aria-label="Families, adults, and children from the community gathered in prayer"`],
  [`Una comunidad que ora y camina unida`, `A community that prays and walks together`],
  [`Familias, niños, discípulos y líderes creciendo en la Palabra y sirviendo con gracia.`, `Families, children, disciples, and leaders growing in the Word and serving with grace.`],
  [`Áreas de servicio`, `Areas of service`],
  [`Ministerios con propósito claro`, `Ministries with a clear purpose`],
  [`Cada área conecta la enseñanza bíblica con una respuesta concreta de amor, formación y misión.`, `Each area connects biblical teaching with a practical response of love, formation, and mission.`],
  [`>Evangelismo<`, `>Evangelism<`],
  [`Presentamos el evangelio con claridad, compasión y fidelidad bíblica.`, `We present the gospel with clarity, compassion, and biblical faithfulness.`],
  [`>Discipulado<`, `>Discipleship<`],
  [`Acompañamos a las personas para crecer en la Palabra y obedecer a Cristo.`, `We walk with people as they grow in the Word and obey Christ.`],
  [`>Familias<`, `>Families<`],
  [`Fortalecemos matrimonios, padres, jóvenes y niños mediante recursos bíblicos.`, `We strengthen marriages, parents, youth, and children through biblical resources.`],
  [`>Plantación de iglesias<`, `>Church Planting<`],
  [`Cooperamos en la formación, acompañamiento y envío de nuevos plantadores.`, `We cooperate in training, mentoring, and sending new church planters.`],
  [`>Misiones<`, `>Missions<`],
  [`Servimos a comunidades locales y apoyamos la obra misionera entre las naciones.`, `We serve local communities and support missionary work among the nations.`],
  [`>Formación pastoral<`, `>Pastoral Formation<`],
  [`Equipamos líderes con herramientas bíblicas, teológicas y ministeriales.`, `We equip leaders with biblical, theological, and ministry tools.`],
  [`Convicciones bíblicas con una misión cooperativa.`, `Biblical convictions with a cooperative mission.`],
  [`Afirmamos las enseñanzas históricas del cristianismo bíblico y nos identificamos doctrinalmente con la Fe y Mensaje Bautistas 2000.`, `We affirm the historic teachings of biblical Christianity and doctrinally identify with the Baptist Faith and Message 2000.`],
  [`Leer la declaración doctrinal completa ↗`, `Read the full doctrinal statement ↗`],
  [`La Biblia es la Palabra de Dios y nuestra autoridad.`, `The Bible is the Word of God and our authority.`],
  [`Hay un solo Dios: Padre, Hijo y Espíritu Santo.`, `There is one God: Father, Son, and Holy Spirit.`],
  [`La salvación es por gracia mediante la fe en Jesucristo.`, `Salvation is by grace through faith in Jesus Christ.`],
  [`La iglesia proclama el evangelio, hace discípulos y sirve al prójimo.`, `The church proclaims the gospel, makes disciples, and serves its neighbors.`],
  [`Esperanza en Jesucristo`, `Hope in Jesus Christ`],
  [`La gracia de Dios ofrece perdón, una vida nueva y esperanza eterna.`, `God’s grace offers forgiveness, new life, and eternal hope.`],
  [`Deseamos escucharte, orar contigo y ayudarte a comprender el mensaje del evangelio.`, `We want to listen to you, pray with you, and help you understand the message of the gospel.`],
  [`Hablar con un líder`, `Talk with a leader`],
  [`Petición de oración`, `Prayer request`],
  [`No tienes que caminar solo.`, `You do not have to walk alone.`],
  [`Tu petición será recibida con respeto. Selecciona el nivel de privacidad que deseas. Las peticiones no se publican automáticamente.`, `Your request will be received with respect. Choose the privacy level you prefer. Requests are not published automatically.`],
  [`<strong>En una emergencia:</strong> este formulario no sustituye servicios médicos, policiales o de crisis. En Estados Unidos llama al 911; para crisis emocionales llama o envía un mensaje al 988.`, `<strong>In an emergency:</strong> this form does not replace medical, police, or crisis services. In the United States call 911; for emotional crisis support call or text 988.`],
  [`No llenar:`, `Do not fill this field:`],
  [`>Nombre<`, `>First name<`],
  [`Apellido (opcional)`, `Last name (optional)`],
  [`Correo electrónico`, `Email address`],
  [`Teléfono (opcional)`, `Phone (optional)`],
  [`>Ciudad<`, `>City<`],
  [`Estado o país`, `State or country`],
  [`>Categoría<`, `>Category<`],
  [`Nivel de privacidad`, `Privacy level`],
  [`<option value="">Seleccionar</option>`, `<option value="">Select</option>`],
  [`>Salud<`, `>Health<`],
  [`>Familia<`, `>Family<`],
  [`>Trabajo<`, `>Work<`],
  [`>Vida espiritual<`, `>Spiritual life<`],
  [`>Duelo<`, `>Grief<`],
  [`>Otra<`, `>Other<`],
  [`>Solo equipo pastoral<`, `>Pastoral team only<`],
  [`>Equipo de oración<`, `>Prayer team<`],
  [`>Petición de oración<`, `>Prayer request<`],
  [`Deseo que un líder se comunique conmigo.`, `I would like a leader to contact me.`],
  [`Acepto que mis datos se utilicen para responder a esta petición y he leído la <a href="/privacidad/">política de privacidad</a>.`, `I agree that my information may be used to respond to this request and I have read the <a href="/privacidad/">privacy policy</a>.`],
  [`Enviar petición`, `Send request`],
  [`Generosidad con propósito`, `Generosity with purpose`],
  [`Ayúdanos a compartir el evangelio y servir a nuevas comunidades.`, `Help us share the gospel and serve new communities.`],
  [`Tu apoyo puede contribuir al evangelismo, misiones, plantación de iglesias, formación pastoral y servicio comunitario.`, `Your support can contribute to evangelism, missions, church planting, pastoral formation, and community service.`],
  [`Antes de publicar esta sección, agregue el nombre legal de la organización, su estado 501(c)(3), EIN y la declaración tributaria correspondiente.`, `Before publishing this section, add the organization’s legal name, 501(c)(3) status, EIN, and the appropriate tax disclosure.`],
  [`Donar de forma segura`, `Give securely`],
  [`Aquí se insertará el botón oficial de PayPal de la organización.`, `The organization’s official PayPal button will be inserted here.`],
  [`ESPACIO PARA PAYPAL`, `PAYPAL PLACEHOLDER`],
  [`Reemplace este bloque con el código oficial de PayPal Donate.`, `Replace this block with the official PayPal Donate code.`],
  [`No coloque contraseñas, claves secretas ni datos bancarios directamente en este archivo.`, `Do not place passwords, secret keys, or banking information directly in this file.`],
  [`Conectemos.`, `Let’s connect.`],
  [`Utiliza este formulario para visitas, información ministerial, colaboración o seguimiento espiritual.`, `Use this form for visits, ministry information, collaboration, or spiritual follow-up.`],
  [`Nombre completo`, `Full name`],
  [`>Motivo<`, `>Reason<`],
  [`>Planificar una visita<`, `>Plan a visit<`],
  [`>Información ministerial<`, `>Ministry information<`],
  [`>Conocer el evangelio<`, `>Learn about the gospel<`],
  [`>Colaboración<`, `>Collaboration<`],
  [`>Otro<`, `>Other<`],
  [`>Mensaje<`, `>Message<`],
  [`Acepto la <a href="/privacidad/">política de privacidad</a>.`, `I accept the <a href="/privacidad/">privacy policy</a>.`],
  [`Enviar mensaje`, `Send message`],
  [`Luz para el camino. Gracia para la vida.`, `Light for the journey. Grace for life.`],
  [`>Enlaces<`, `>Links<`],
  [`>Privacidad<`, `>Privacy<`],
  [`>Idioma<`, `>Language<`],
  [`<nav class="footer-links"><a href="/">Español</a><a href="/en/">English</a></nav>`, `<nav class="footer-links"><a href="/">Español</a><a href="/en/" aria-current="page">English</a></nav>`],
  [`Todos los derechos reservados.`, `All rights reserved.`]
];

for (const [from, to] of englishReplacements) {
  englishHtml = englishHtml.replaceAll(from, to);
}

await mkdir(englishDirectory, { recursive: true });
await writeFile(englishPagePath, englishHtml, "utf8");

console.log("Fotografía familiar, emblema oficial y versión bilingüe ES/EN integrados correctamente.");
