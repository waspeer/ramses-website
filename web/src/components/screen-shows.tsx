import { format as formatDate } from 'date-fns';
import { For } from 'solid-js';

import type { ScreenByName } from '../lib/data';

import { MaybeLink } from './maybe-link';

interface ScreenShowsProps {
  data: ScreenByName['shows']['data'];
}

export function ScreenShows(props: ScreenShowsProps) {
  return (
    <For each={props.data}>
      {(show) => (
        <p>
          <MaybeLink url={show.link} blank>
            {show.title} ({formatDate(new Date(show.startDate), 'dd.MMM.yyyy')})
            <br />
            {show.city}, {show.country}
          </MaybeLink>
        </p>
      )}
    </For>
  );
}
