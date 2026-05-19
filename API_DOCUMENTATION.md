# 🔌 PDFINDI & Agent API — Endpoint Documentation

Welcome to the official API endpoint documentation for the **PDFINDI Backend**. This reference includes all **PDF conversion/editing endpoints** as well as the **Universal Agent Dynamic CMS API**.

---

## 🔑 Authentication
All administrative and Agent CMS routes are protected by Bearer Token authentication. Core conversion endpoints are rate-limited per IP, but do not require credentials.

| Endpoint Group | Auth Required? | Header | Value |
| :--- | :--- | :--- | :--- |
| **Conversion APIs** (`/api/pdf-to-word`, etc.) | **No** (Rate Limited) | None | N/A |
| **Dedicated SEO API** (`/api/seo/*`) | **Yes** | `Authorization` | `Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58` |
| **Agent CMS & Actions** (`/api/data/*`, `/api/action/*`) | **Yes** | `Authorization` | `Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58` |

---

## 📍 1. Core Conversion & PDF Editing APIs (Public)

These endpoints handle high-volume file processing tasks.

### Convert PDF to Word (DOCX)
* **URL:** `/api/pdf-to-word`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:** 
  * `file`: (Binary File) PDF format, max 50MB.
* **Response (JSON):**
  ```json
  {
    "success": true,
    "filename": "document.docx",
    "base64": "SGVsbG8gV29ybGQ...",
    "originalSize": 1048576,
    "convertedSize": 892312,
    "message": "PDF successfully converted to Word document"
  }
  ```

### Convert Word to PDF
* **URL:** `/api/word-to-pdf`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:** 
  * `file`: (Binary File) DOC or DOCX format.
* **Response (JSON):**
  ```json
  {
    "success": true,
    "filename": "document.pdf",
    "base64": "JVBERi0xLjQKJ..."
  }
  ```

### Compress PDF
* **URL:** `/api/compress-pdf`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:** 
  * `file`: (Binary File) PDF format.
  * `level`: (String) `low`, `medium` (default), or `high`.

### Image to PDF
* **URL:** `/api/image-to-pdf`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:**
  * `file`: (Binary File) JPEG, PNG, GIF, BMP, TIFF, WebP.

### OCR Image to Text
* **URL:** `/api/ocr-text`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:**
  * `file`: (Binary Image File).
* **Response:** Returns extracted plain text and confidence status.

### Extract PDF Text for Editing
* **URL:** `/api/extract-pdf-text`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:**
  * `file`: (Binary PDF File).
* **Response:** Returns character positions/bounding boxes and original base64 PDF.

### Rebuild PDF with Edits
* **URL:** `/api/rebuild-pdf`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:**
  * `file`: (Binary original PDF File).
  * `edits`: (Stringified JSON Object) of page coordinate overrides.

### Add Watermark to PDF
* **URL:** `/api/add-watermark`
* **Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Payload:**
  * `pdf`: (Binary PDF file) — **Required**
  * `type`: (String) `text` or `image`
  * `text`: (String) Text to write (e.g., `"CONFIDENTIAL"`)
  * `image`: (Binary image file) — **Required if type=image**
  * `fontSize`: (Number) default `36`
  * `fontColor`: (String) Hex color (default `#ff0000`)
  * `opacity`: (Number) `0.0` to `1.0` (default `0.5`)
  * `rotation`: (Number) angle degrees (default `0`)
  * `position`: (String) `center`, `topLeft`, `topRight`, `bottomLeft`, `bottomRight`
  * `pageRange`: (String) Page filter (default `""` for all pages, e.g., `"1-3,5"`)

---

## 🎯 2. Dedicated SEO Agent API (Protected)

This API is designed specifically for **SEO agents** to easily scan and update the search metadata (meta title, description, keywords) for all pages and tools on PDFINDI.

### Why use this instead of generic CMS routes?
* ❌ **No Random IDs:** Generic CRUD POST requests auto-generate a random UUID (like `lrf93jks`), which doesn't map to page slugs.
* ✔️ **Direct Slug/URL Mapping:** This API resolves human-readable slugs (like `tools-compress-pdf`) or real website URLs (like `/tools/compress-pdf`) directly to files.
* ✔️ **Dual-Layer Meta Visibility:** You can see the **original baseline HTML** meta tags *and* your **active dynamic overrides** in a single view!
* ✔️ **Zero Configuration:** Overrides are instantly picked up by `server.js`'s dynamic SEO middleware and injected into the HTML serving stream.

---

### A. List All Pages & SEO Status
Fetches a complete catalog of all pages and tools on the website, showing both their raw HTML tags and active overrides.
* **URL:** `/api/seo`
* **Method:** `GET`
* **Response (JSON):**
  ```json
  {
    "success": true,
    "data": {
      "totalPages": 45,
      "pages": [
        {
          "slug": "index",
          "url": "/",
          "file": "index.html",
          "isToolPage": false,
          "hasOverride": false,
          "original": {
            "title": "Free Online PDF Tools India | PDFIndi",
            "description": "India's #1 free PDF tool suite...",
            "keywords": "free PDF tools, merge PDF..."
          },
          "override": null,
          "active": {
            "title": "Free Online PDF Tools India | PDFIndi",
            "description": "India's #1 free PDF tool suite...",
            "keywords": "free PDF tools, merge PDF..."
          }
        },
        {
          "slug": "tools-compress-pdf",
          "url": "/tools/compress-pdf",
          "file": "tools/compress-pdf.html",
          "isToolPage": true,
          "hasOverride": true,
          "original": {
            "title": "Compress PDF - Reduce PDF Size",
            "description": "Reduce PDF size free online...",
            "keywords": "compress PDF, reduce size..."
          },
          "override": {
            "title": "Compress PDF Online Free (2026) - No Watermark",
            "description": "Super-fast PDF compressor to compress files up to 80% without losing quality.",
            "keywords": "best pdf compressor, compress pdf free, shrink pdf"
          },
          "active": {
            "title": "Compress PDF Online Free (2026) - No Watermark",
            "description": "Super-fast PDF compressor to compress files up to 80% without losing quality.",
            "keywords": "best pdf compressor, compress pdf free, shrink pdf"
          }
        }
      ]
    }
  }
  ```
* **Curl Command:**
  ```bash
  curl -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/seo
  ```

---

### B. Read SEO Status for a Single Page
Get metadata for a specific page using its slug OR its URL path.
* **URL:** `/api/seo/:slug` (e.g., `/api/seo/tools-compress-pdf`)
* **Query Parameter (Optional):** `?url=/tools/compress-pdf` (you can pass the URL path instead of a slug)
* **Method:** `GET`
* **Curl Command:**
  ```bash
  curl -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/seo/tools-compress-pdf
  ```

---

### C. Create or Update SEO Override
Set dynamic overrides for any page using either the `slug` or the website `url` path. You do not need to guess UUIDs!
* **URL:** `/api/seo`
* **Method:** `POST`
* **Payload (JSON):**
  ```json
  {
    "url": "/tools/compress-pdf",
    "title": "Compress PDF Online Free (2026) - No Watermark",
    "description": "Super-fast PDF compressor to compress files up to 80% without losing quality.",
    "keywords": "best pdf compressor, compress pdf free, shrink pdf"
  }
  ```
* **Alternative Payload (by slug):**
  ```json
  {
    "slug": "tools-compress-pdf",
    "title": "Compress PDF Online Free (2026) - No Watermark",
    "description": "Super-fast PDF compressor...",
    "keywords": "best pdf compressor..."
  }
  ```
* **Curl Command:**
  ```bash
  curl -X POST \
       -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       -H "Content-Type: application/json" \
       -d '{"url": "/tools/compress-pdf", "title": "Compress PDF Online Free (2026) - No Watermark", "description": "Compress up to 80%!"}' \
       http://localhost:3000/api/seo
  ```

---

### D. Revert to Raw HTML Metadata (Delete Override)
Delete the custom dynamic override for a page. The page will immediately revert to showing the default title, description, and keywords hardcoded in its original HTML file.
* **URL:** `/api/seo/:slug` (e.g., `/api/seo/tools-compress-pdf`)
* **Method:** `DELETE`
* **Curl Command:**
  ```bash
  curl -X DELETE \
       -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/seo/tools-compress-pdf
  ```

---

## 🤖 3. Universal Agent CMS CRUD APIs (Protected)
Manages dynamic JSON data stored under `/data/:type/`. You can use **any custom type** name (e.g. `blog`, `faq`, `seo`, `pages`, `tickets`). Folders are auto-created when you make a `POST`!

### List All Items of a Type
* **URL:** `/api/data/:type` (e.g. `/api/data/seo`, `/api/data/blog`)
* **Method:** `GET`
* **Response:** Array of objects, automatically sorted by `createdAt` descending.
* **Curl Command:**
  ```bash
  curl -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/data/seo
  ```

### Read a Single Item
* **URL:** `/api/data/:type/:id` (e.g. `/api/data/seo/homepage-seo`)
* **Method:** `GET`
* **Curl Command:**
  ```bash
  curl -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/data/seo/homepage-seo
  ```

### Create a New Item
* **URL:** `/api/data/:type`
* **Method:** `POST`
* **Payload (JSON):** Any JSON object. The system automatically assigns a base64-like unique ID, `type`, `createdAt`, and `updatedAt` timestamps.
* **Curl Command:**
  ```bash
  curl -X POST \
       -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       -H "Content-Type: application/json" \
       -d '{"title": "Awesome Page", "description": "This is page meta."}' \
       http://localhost:3000/api/data/pages
  ```

### Update an Item (Partial Merge)
* **URL:** `/api/data/:type/:id`
* **Method:** `PUT`
* **Payload (JSON):** Properties you want to change. It performs a smart merge, keeping original properties intact and automatically updating `updatedAt` (while locking `id`, `type`, and `createdAt`).
* **Curl Command:**
  ```bash
  curl -X PUT \
       -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       -H "Content-Type: application/json" \
       -d '{"description": "Updated this description!"}' \
       http://localhost:3000/api/data/seo/homepage-seo
  ```

### Delete an Item
* **URL:** `/api/data/:type/:id`
* **Method:** `DELETE`
* **Curl Command:**
  ```bash
  curl -X DELETE \
       -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/data/pages/some-id
  ```

---

## ⚡ 3. Automated Site Actions (Protected)

Run administrative tasks by hitting these action hooks. The system dynamically runs scripts under `/api/actions/:name.js`.

### Generate Sitemap
Compiles all public pages, tools, and dynamic routes, then rebuilds `/public_html/sitemap.xml` automatically.
* **URL:** `/api/action/generate-sitemap`
* **Method:** `POST`
* **Curl Command:**
  ```bash
  curl -X POST -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/action/generate-sitemap
  ```

### Clear Server Cache
* **URL:** `/api/action/clear-cache`
* **Method:** `POST`

### Import Blogs / FAQs
Reads dynamic posts or questions and synchronizes/saves them into the data directories.
* **URL:** `/api/action/import-blogs`
* **URL:** `/api/action/import-faqs`
* **Method:** `POST`

---

## 🔍 4. Site Inspection & Status (Protected & Public)

### Get Public Health Status (No Auth)
* **URL:** `/api/site/status`
* **Method:** `GET`
* **Curl Command:**
  ```bash
  curl http://localhost:3000/api/site/status
  ```

### Scan & Map All Website Pages (Protected)
Inspects `/public_html/` and scans recursively for all tools, utility pages, and registered client assets to give agents an accurate catalog of pages on the live site.
* **URL:** `/api/site/pages`
* **Method:** `GET`
* **Curl Command:**
  ```bash
  curl -H "Authorization: Bearer 86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58" \
       http://localhost:3000/api/site/pages
  ```

---

## 💡 SEO Agent Integration Example (JavaScript Fetch)
You can directly paste this snippet into your SEO scripts or agent configuration to fetch and update meta tags programmatically:

```javascript
const API_URL = 'http://localhost:3000/api/seo';
const AGENT_API_KEY = '86872984fbebc128e29c097cd6057ce2bc43f688f5e26fee8d00ad84702c4a58';

// Example: Fetch status and see if override exists
async function getPageSEO(urlPath) {
  try {
    const response = await fetch(`${API_URL}/by-slug?url=${encodeURIComponent(urlPath)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AGENT_API_KEY}`
      }
    });
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error('Error fetching SEO status:', err);
  }
}

// Example: Publish new SEO metadata directly by URL
async function updatePageSEO(urlPath, title, description, keywords) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AGENT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: urlPath, // e.g., "/tools/compress-pdf" or "/"
        title,
        description,
        keywords
      })
    });
    
    const result = await response.json();
    if (result.success) {
      console.log(`SEO for ${urlPath} updated successfully!`, result.data);
    } else {
      console.error('Error:', result.error);
    }
  } catch (err) {
    console.error('Network Error:', err);
  }
}
```
