import { PortableText } from '@portabletext/solid';
import { uriLooksSafe } from '@portabletext/to-html';
import { For, Show, createMemo } from 'solid-js';

import type { ScreenByName } from '../lib/data';
import type { PortableTextComponents } from '@portabletext/solid';

import { MaybeLink } from './maybe-link';

interface ScreenAboutProps {
  data: ScreenByName['about']['data'];
}

const components: PortableTextComponents = {
  marks: {
    link(props) {
      const isSafe = createMemo(() => uriLooksSafe(props.value.url || ''));

      return (
        <>
          <Show when={!isSafe}>{props.children}</Show>

          <Show when={isSafe}>
            <MaybeLink url={props.value.url || ''} blank={!!props.value.blank}>
              {props.children}
            </MaybeLink>
          </Show>
        </>
      );
    },
  },
};

export function ScreenAbout(props: ScreenAboutProps) {
  return (
    <Show when={props.data}>
      <PortableText value={props.data!.bio} components={components} />

      <ul>
        <For each={props.data!.socials}>
          {(link) => (
            <li>
              <a
                href={link.url}
                target={link.blank ? '_blank' : ''}
                rel={link.blank ? 'noopener noreferrer' : ''}
              >
                {link.text}
              </a>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}
