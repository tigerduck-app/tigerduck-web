// Rewrites the demo's HTML for the site, which renders it as is.
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
