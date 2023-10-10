import { For } from 'solid-js';

import type { ScreenByName } from '../lib/data';

import { MaybeLink } from './maybe-link';

interface ScreenMusicProps {
  data: ScreenByName['music']['data'];
}

export function ScreenMusic(props: ScreenMusicProps) {
  return (
    <For each={props.data}>
      {(release) => (
        <p>
          <MaybeLink url={release.link} blank>
            {release.name} ({new Date(release.releaseDate).getFullYear()}) // {release.label}
          </MaybeLink>
        </p>
      )}
    </For>
  );
}
