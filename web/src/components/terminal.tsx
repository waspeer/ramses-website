import { Show, createSignal, onMount } from 'solid-js';

import type { Data } from '../lib/data';

import { BootScreen } from './boot-screen';
import { OS } from './os';
import { CHAR_SIZE } from './terminal-constants';
import './terminal.css';

interface TerminalProps {
  data: Data;
  initialPath: string;
}

export function Terminal(props: TerminalProps) {
  const [bootState, setBootState] = createSignal<'booting' | 'booted'>('booting');

  onMount(() => {
    setTimeout(() => {
      setBootState('booted');
    }, 2000);
  });

  return (
    <div class="terminal" style={{ '--character-size': `${CHAR_SIZE}px` }}>
      <Show when={bootState() === 'booting'}>
        <BootScreen />
      </Show>

      <Show when={bootState() === 'booted'}>
        <OS data={props.data} initialPath={props.initialPath} />
      </Show>
    </div>
  );
}
