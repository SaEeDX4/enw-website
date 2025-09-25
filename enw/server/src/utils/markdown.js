import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
});

export function parseMarkdown(content) {
  if (!content) return "";

  // Convert markdown to HTML
  const rawHtml = marked.parse(content);

  // Sanitize HTML to prevent XSS
  const cleanHtml = purify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "a",
      "img",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "class",
      "id",
      "target",
      "rel",
      "width",
      "height",
    ],
    ALLOW_DATA_ATTR: false,
  });

  return cleanHtml;
}

export function extractExcerpt(content, maxLength = 200) {
  if (!content) return "";

  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/[*_~`]/g, "") // Remove emphasis
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Extract link text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
    .replace(/\n{2,}/g, " ") // Replace multiple newlines
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + "...";
}
