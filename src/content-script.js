// Extracts main article text from the page


function extractArticleText() {
  // Try common selectors for news articles
  const selectors = [
    'article',
    '[itemprop="articleBody"]',
    '.article-content',
    '.story-body',
    '.main-content',
    '#main-content',
    '.post-content',
    '.entry-content',
    '.news-article',
    '.news-content',
    '.content'
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
  if (el && el.innerText && el.innerText.replace(/\s+/g, ' ').length > 1000) {
      console.log('Article selector matched:', sel);
      return { text: el.innerText, selector: sel };
    }
  }
  // fallback: find largest visible text block
  let largest = { text: '', length: 0, selector: null };
  const allEls = Array.from(document.querySelectorAll('p, div, section'));
  for (const el of allEls) {
    const txt = el.innerText;
  if (txt && txt.length > largest.length && txt.replace(/\s+/g, ' ').length > 1000) {
      largest = { text: txt, length: txt.length, selector: el.className || el.tagName };
    }
  }
  if (largest.text) {
    console.log('Fallback to largest block:', largest.selector);
    return { text: largest.text, selector: largest.selector };
  }
  // fallback: all body text
  const fallbackText = document.body.innerText;
  if (fallbackText && fallbackText.replace(/\s+/g, ' ').length > 1000) {
    console.log('Fallback to body text');
    return { text: fallbackText, selector: 'body' };
  }
  return { text: '', selector: null };
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'read_article') {
    const result = extractArticleText();
    if (result.text && result.text.length > 0) {
      sendResponse({ articleText: result.text, selector: result.selector });
    } else {
      sendResponse({ error: 'No article content found.' });
    }
  }
});
