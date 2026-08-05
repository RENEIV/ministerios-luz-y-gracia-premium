# Arquitectura Eclesiástica Premium

## Ministerios Luz y Gracia

Este documento establece el sistema visual, editorial y técnico que debe gobernar todas las próximas actualizaciones del sitio.

## 1. Propósito

La experiencia digital debe comunicar con claridad:

- Centralidad de Jesucristo y fidelidad bíblica.
- Identidad bautista evangélica.
- Cuidado pastoral y hospitalidad.
- Formación de discípulos y familias.
- Plantación de iglesias y misión global.
- Excelencia institucional sin apariencia comercial.

## 2. Principios visuales

### Presencia eclesiástica

El sitio debe sentirse como una iglesia viva, reverente y accesible. La estética debe apoyar el mensaje pastoral y nunca competir con él.

### Jerarquía

Cada página debe guiar la mirada en este orden:

1. Mensaje bíblico o pastoral principal.
2. Acción concreta del visitante.
3. Información ministerial.
4. Identidad institucional.

### Paleta oficial

- Azul marino principal: `#0D2A42`
- Azul profundo: `#071A2A`
- Azul secundario: `#173F61`
- Dorado institucional: `#C9A24D`
- Dorado claro: `#E3C77E`
- Crema: `#F6F0E4`
- Papel: `#FFFDF8`
- Blanco: `#FFFFFF`
- Texto principal: `#17202A`
- Texto secundario: `#66717D`

El dorado debe reservarse para acentos, referencias, botones principales, líneas y símbolos discretos. No debe usarse en párrafos largos.

### Tipografía

- Títulos institucionales y bíblicos: `Libre Baskerville`.
- Navegación, formularios y textos funcionales: `Inter`.
- Máximo de dos familias tipográficas.

## 3. Arquitectura técnica propuesta

```text
/
├── index.html
├── en/
│   └── index.html
├── privacidad/
│   └── index.html
├── gracias/
│   └── index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── pages/
│   │       └── home.css
│   ├── js/
│   │   └── app.js
│   ├── data/
│   │   └── site-content.json
│   └── images/
├── netlify.toml
├── _headers
├── _redirects
├── robots.txt
└── sitemap.xml
```

## 4. Fuente única de contenido

La información editable debe vivir en:

```text
/assets/data/site-content.json
```

No deben existir teléfonos, horarios, direcciones o anuncios contradictorios entre HTML y JSON.

Campos principales:

- `site`
- `serviceTimes`
- `updates`
- `ministries`
- `pastoralCare`
- `missions`
- `contact`
- `socialLinks`

## 5. Sistema de Actualizaciones

Las actualizaciones deben presentarse como una sección editorial, no como anuncios improvisados.

Cada actualización debe contener:

```json
{
  "id": "actualizacion-001",
  "status": "active",
  "category": "Vida de la iglesia",
  "date": "2026-08-05",
  "title": "Título claro y pastoral",
  "summary": "Descripción breve, humana y útil.",
  "ctaLabel": "Conocer más",
  "ctaUrl": "#contacto",
  "featured": true
}
```

### Jerarquía visual de una actualización

1. Categoría.
2. Fecha.
3. Título.
4. Resumen.
5. Acción.

### Categorías sugeridas

- Vida de la iglesia
- Cuidado pastoral
- Formación bíblica
- Familias
- Evangelismo
- Misiones
- Plantación de iglesias
- Servicio comunitario

### Reglas editoriales

- Títulos de 4 a 9 palabras.
- Resúmenes de 20 a 45 palabras.
- Una sola acción principal.
- Sin exceso de mayúsculas.
- Sin lenguaje comercial.
- Sin imágenes genéricas que desplacen el mensaje.
- Las actualizaciones vencidas deben archivarse, no borrarse sin revisión.

## 6. Componentes oficiales

Todas las páginas deben reutilizar:

- Encabezado institucional.
- Navegación accesible.
- Hero pastoral.
- Tarjeta de actualización.
- Tarjeta de ministerio.
- Bloque bíblico.
- Llamado pastoral.
- Formulario de oración.
- Formulario de contacto.
- Pie de página institucional.

## 7. Accesibilidad y experiencia móvil

- Contraste AA como mínimo.
- Navegación completa por teclado.
- Estados `hover`, `focus`, `active` y `disabled` visibles.
- Botones de al menos 44 × 44 px.
- Texto principal legible sin ampliar.
- Formularios con etiquetas explícitas y mensajes de error claros.
- Menú móvil que cierre correctamente después de seleccionar una sección.

## 8. Control de calidad obligatorio

Antes de fusionar una actualización:

- Revisar escritorio y teléfono.
- Verificar español e inglés.
- Confirmar enlaces internos y externos.
- Probar formularios Netlify.
- Validar ortografía y fidelidad bíblica.
- Confirmar teléfono, correo, dirección y horarios.
- Verificar que no existan placeholders públicos.
- Confirmar SEO, canonical, Open Graph y datos estructurados.
- Revisar que ninguna capa invisible bloquee controles.
- Probar una recarga completa y una ventana privada.

## 9. Flujo de trabajo en GitHub

1. Crear rama `agent/...` desde `main`.
2. Aplicar cambios modulares.
3. Abrir pull request como borrador.
4. Generar Deploy Preview en Netlify.
5. Realizar control de calidad.
6. Marcar el PR listo para revisión.
7. Fusionar únicamente después de aprobación.
8. Confirmar deploy de producción.

## 10. Prioridades de implementación

### Fase 1 — Limpieza

- Separar CSS y JavaScript de `index.html`.
- Corregir la ubicación de `site-content.json`.
- Eliminar código duplicado o desconectado.
- Unificar teléfono, correo, dirección y horarios.

### Fase 2 — Actualizaciones editoriales

- Crear componente profesional de actualizaciones.
- Cargar actualizaciones desde JSON.
- Añadir estado destacado, archivo y categorías.

### Fase 3 — Presencia eclesiástica

- Incorporar fotografías oficiales optimizadas.
- Refinar portada, bloques bíblicos y llamados pastorales.
- Mejorar la versión inglesa sin traducciones literales incómodas.

### Fase 4 — Producción

- Validar Netlify Forms.
- Configurar seguridad, redirecciones y caché.
- Completar sitemap, robots y metadatos sociales.
- Ejecutar control de calidad final.

---

**Principio rector:** El sitio debe sentirse pastoral antes que promocional, bíblico antes que decorativo y profesional sin perder la calidez de una iglesia local.
