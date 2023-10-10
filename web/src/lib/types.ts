import type { toHTML } from '@portabletext/to-html';

export type RichTextValue = Parameters<typeof toHTML>[0];

export interface LinkData {
  text: string;
  url: string;
  blank?: boolean;
}
export type { ImageValue } from 'sanity';
