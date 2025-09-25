import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
});

export function parseMarkdown(content) {
  if (!content) return '';

  const rawHtml = marked.parse(content);
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return cleanHtml;
}
