import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cleanHtml, stripDemo } from './demo-html.mjs';

test('keeps allowed tags without attributes', () => {
  const html = '<h2 style="color:#1a4f8b">Hi</h2><p><a href="https://x.example">a &amp; b</a></p><table><tr><td style="border:1px">1</td></tr></table>';
  assert.equal(cleanHtml(html), '<h2>Hi</h2><p><a>a &amp; b</a></p><table><tbody><tr><td>1</td></tr></tbody></table>');
});

test('drops images and counts them', () => {
  const found = { images: 0 };
  assert.equal(cleanHtml('<div><img src="https://x.example/a.png" alt="A">text</div>', 'mail', found), '<div>text</div>');
  assert.equal(found.images, 1);
});

test('leaves text without tags as it is', () => {
  assert.equal(cleanHtml('a &amp; b'), 'a &amp; b');
});

for (const html of [
  '<img/onerror=alert(1) src=x><script>alert(1)</script>',
  '<svg/onload=alert(1)>',
  '<scr<script></script>ipt>alert(1)</script>',
  '<p onclick="alert(1)">x</p>',
  '<p class="x">x</p>',
  '<base href="https://x.example/">',
  '<form action="https://x.example"><p>x</p></form>',
  '<meta http-equiv="refresh" content="0;url=https://x.example">',
  '<link rel="stylesheet" href="https://x.example/a.css">',
  '<math><mi>x</mi></math>',
  '<iframe src="https://x.example"></iframe>',
  '<style>p{}</style>',
]) {
  test(`refuses ${html}`, () => assert.throws(() => cleanHtml(html), /is not allowed/));
}

test('keeps no link target, encoded or not', () => {
  assert.equal(cleanHtml('<a href="jav&#x61;script:alert(1)">x</a><a href="data:text/html,x">y</a>'), '<a>x</a><a>y</a>');
});

test('cleans HTML fields and leaves plain text as it is', () => {
  const demo = {
    password: 'secret',
    mail: {
      messages: [
        {
          subject: 'a < b',
          from: { name: 'Wang < 3' },
          plain: { zh: 'a < b', en: 'a <= b' },
          html: { zh: '<p>a</p><img src="https://x.example/a.png">', en: '<p>a &lt; b</p>' },
        },
        { plain: 'x' },
      ],
    },
  };
  assert.deepEqual(stripDemo(demo), {
    mail: {
      messages: [
        {
          subject: 'a < b',
          from: { name: 'Wang < 3' },
          plain: { zh: 'a < b', en: 'a <= b' },
          html: { zh: '<p>a</p>', en: '<p>a &lt; b</p>' },
          remoteImages: true,
        },
        { plain: 'x' },
      ],
    },
  });
});

test('refuses a script in an HTML field', () => {
  assert.throws(() => stripDemo({ moodle: { courses: [{ summary: '<script>x</script>' }] } }), /moodle\.courses\[0\]\.summary: <script>/);
});

for (const plain of ['Wang <wang@example.com>', '</p>', '<!-- x -->', '<?xml?>']) {
  test(`refuses ${plain} in a field not listed as HTML`, () => {
    assert.throws(
      () => stripDemo({ mail: { messages: [{ plain: { zh: 'x', en: plain } }] } }),
      /mail\.messages\[0\]\.plain\.en looks like HTML: list mail\.messages\[\]\.plain in HTML_FIELDS or PLAIN_FIELDS/
    );
  });
}
