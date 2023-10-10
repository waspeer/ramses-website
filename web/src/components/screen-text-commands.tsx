/* eslint-disable solid/reactivity */
import { toHTML, uriLooksSafe } from '@portabletext/to-html';
import { Show, createMemo } from 'solid-js';

import type { TextCommandResult } from '../lib/data';
import type { PortableTextComponents } from '@portabletext/to-html';

interface ScreenTextCommandsProps {
  data?: TextCommandResult;
}

const components: PortableTextComponents = {
  marks: {
    link(props) {
      const isSafe = uriLooksSafe(props.value.url || '');

      if (!isSafe) {
        return props.children;
      }

      return /* html */ `
        <a
          href="${props.value.url}"
          target="${props.value.blank ? '_blank' : ''}"
          rel="${props.value.blank ? 'noopener noreferrer' : ''}"
        >${props.children}</a>`;
    },
  },
};

export function ScreenTextCommands(props: ScreenTextCommandsProps) {
  const resultHTML = createMemo(() => {
    if (!props.data) return null;

    const html = toHTML(props.data?.result ?? [], { components });
    let result: string;

    if (props.data.type === 'random') {
      const matches = html.match(/<p>(.+?)<\/p>/g);
      result = matches ? randomArrayElement(matches) : '';
    } else {
      result = html;
    }

    return result;
  });

  return (
    <Show when={resultHTML()}>
      {/* eslint-disable-next-line solid/no-innerhtml */}
      <span innerHTML={resultHTML()!} />
    </Show>
  );
}

function randomArrayElement<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)]!;
}
