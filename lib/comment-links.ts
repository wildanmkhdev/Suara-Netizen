export type CommentLinkFilter = 'contact' | 'linked' | 'unlinked';

const CONTACT_HOSTS: Readonly<Record<string, true>> = {
  'wa.me': true,
  'api.whatsapp.com': true,
  'chat.whatsapp.com': true,
  't.me': true,
  'telegram.me': true,
  'telegram.dog': true,
};

const TEXT_URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"'),;]+|\b(?:wa\.me|t\.me|telegram\.me|telegram\.dog|(?:api|chat)\.whatsapp\.com)\/[^\s<>"'),;]+/gi;

/** Classifies links inside the original text, never a comment's source permalink. */
export function getCommentLinkFilter(text: string): CommentLinkFilter {
  let hasLink = false;

  for (const match of text.matchAll(TEXT_URL_PATTERN)) {
    const candidate = match[0].replace(/[),.;!?\]}»”’]+$/gu, '');

    try {
      const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') continue;
      if (!url.hostname) continue;

      hasLink = true;
      const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
      if (CONTACT_HOSTS[hostname] === true && (url.pathname !== '/' || url.search)) {
        return 'contact';
      }
    } catch {
      // An invalid address is not counted as a detected link.
    }
  }

  return hasLink ? 'linked' : 'unlinked';
}
