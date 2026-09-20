import type { Messages } from '@/lib/messages';

/**
 * One entry per help *topic* (not per page). `id` keys into
 * `messages.helpIndex.topics` for the title/summary shown on `/help`; `path`
 * is where the topic's own page lives.
 *
 * Adding a future article is one object here plus its `helpIndex.topics.<id>`
 * strings in `@/lib/messages` — not an edit to `HelpIndex`'s markup.
 */
export interface HelpTopic {
  id: keyof Messages['helpIndex']['topics'];
  path: string;
}

export const HELP_TOPICS: HelpTopic[] = [
  // The school-mail guide links with no platform segment: `HelpReceiveMail`
  // already renders a neutral state offering Android and iPhone, so it works
  // as the topic's landing page.
  { id: 'receiveMail', path: '/help/receive-mail' },
];
