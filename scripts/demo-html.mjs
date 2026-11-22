// Prepares the demo's data for the site, which renders its HTML fields as is.
import { parseFragment } from 'parse5';

// Only these tags are kept, written again without any attribute. Any other tag or attribute
// throws, so a change to the demo's HTML is reviewed before the site allows it.
const TAGS = new Set([
  'a', 'b', 'br', 'div', 'em', 'h2', 'h4', 'li', 'ol', 'p', 'span', 'strong', 'ul',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]);
const VOID_TAGS = new Set(['br']);
// Links go nowhere and the site fetches nothing from other servers, so these are dropped quietly.
const DROPPED_ATTRIBUTES = new Set(['href', 'style']);

const escapeText = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function rewrite(nodes, where, found) {
  return nodes
    .map((node) => {
      if (node.nodeName === '#text') return escapeText(node.value);
      if (node.nodeName === '#comment') return '';
      if (node.tagName === 'img') {
        found.images += 1;
        return '';
      }
      if (!TAGS.has(node.tagName)) throw new Error(`${where}: <${node.nodeName}> is not allowed`);
      const unknown = node.attrs.find((attribute) => !DROPPED_ATTRIBUTES.has(attribute.name));
      if (unknown) throw new Error(`${where}: <${node.tagName} ${unknown.name}> is not allowed`);
      if (VOID_TAGS.has(node.tagName)) return `<${node.tagName}>`;
      return `<${node.tagName}>${rewrite(node.childNodes, where, found)}</${node.tagName}>`;
    })
    .join('');
}

/** The allowed part of `html`; `found.images` counts the images it leaves out. */
export function cleanHtml(html, where = 'html', found = { images: 0 }) {
  return html.includes('<') ? rewrite(parseFragment(html).childNodes, where, found) : html;
}

// Sign-in secrets and file bodies are not needed to draw the screens.
const DROPPED_KEYS = new Set(['school-password', 'library-password', 'password', 'base64']);

// The fields that hold HTML, by path with each array index written []; every other string is plain text.
const HTML_FIELDS = new Set([
  'mail.messages[].html',
  'moodle.courses[].summary',
  'moodle.courses[].announcements[].message',
  'moodle.courses[].forums[].discussions[].posts[].message',
  'moodle.courses[].grades[].feedback',
  'moodle.courses[].members[].description',
  'moodle.courses[].assignments[].intro',
  'moodle.courses[].assignments[].submission.text',
  'moodle.courses[].assignments[].submission.grade.feedback',
  'moodle.courses[].assignments[].submission.comments[].content',
]);

/** The demo without secrets, its HTML fields cleaned; an object whose HTML held images is marked `remoteImages`. */
export function stripDemo(value, where = '') {
  if (Array.isArray(value)) return value.map((inner, index) => stripDemo(inner, `${where}[${index}]`));
  if (!value || typeof value !== 'object') return value;
  const found = { images: 0 };
  const copy = Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !DROPPED_KEYS.has(key))
      .map(([key, inner]) => {
        const at = where ? `${where}.${key}` : key;
        if (!HTML_FIELDS.has(at.replace(/\[\d+\]/g, '[]'))) return [key, stripDemo(inner, at)];
        // An HTML field is one string or a localized object of them.
        if (typeof inner === 'string') return [key, cleanHtml(inner, at, found)];
        return [key, Object.fromEntries(Object.entries(inner).map(([lang, html]) => [lang, cleanHtml(html, `${at}.${lang}`, found)]))];
      })
  );
  return found.images ? { ...copy, remoteImages: true } : copy;
}
