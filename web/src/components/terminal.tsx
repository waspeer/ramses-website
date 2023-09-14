import { useMachine } from '@xstate/solid';
import { camelCase, noCase } from 'change-case';
import {
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { terminalMachine } from '../machines/terminal.machine';
import './terminal.css';

const CHAR_SIZE = 16;

const bootFiglet = `
       fb
      ffbb
     fffbbb
    ffffbbbb
   fffffbbbbb
  ffffffbbbbbb
 fffffffbbbbbbb
ffffffffbbbbbbbb
 bbbbbbbfffffff
  bbbbbbffffff
   bbbbbfffff
    bbbbffff
     ||||||
      ||||
       ||
       vv
`
  .split('\n')
  .filter((line) => line.trim().length > 0)
  .join('\n')
  .replaceAll('b', '\\')
  .replaceAll('f', '/');

function BootScreen() {
  let bootScreen: HTMLDivElement;
  const [frame, setFrame] = createSignal(0);

  const [screenWidth, setScreenWidth] = createSignal<number | null>(null);
  const [screenHeight, setScreenHeight] = createSignal<number | null>(null);
  
  const ySize = bootFiglet.split('\n').length;

  onMount(() => {
    const animationInterval = setInterval(() => {
      setFrame((frame) => frame + 1);
    }, 50);

    const measureYSize = () => {
      const { height } = bootScreen.getBoundingClientRect();
      setScreenHeight(Math.floor(height / CHAR_SIZE));
    };

    measureYSize();

    window.addEventListener('resize', measureYSize);

    onCleanup(() => {
      window.removeEventListener('resize', measureYSize);
      clearTimeout(animationInterval);
    });
  });

  return (
    <div
      class="terminal__boot"
      ref={bootScreen!}
      style={{
        '--x-position': Math.round(
          (screenHeight() ?? 0) - (frame() % (ySize * 2 + screenHeight()!)),
        ),
        '--cropped-height': `${(screenHeight() ?? 0) * CHAR_SIZE}px`,
      }}
    >
      <div class="terminal__boot-cropped">
        <pre class="terminal__boot-figlet">{bootFiglet}</pre>
        <h1 class="terminal__boot-title">RAMSES</h1>
      </div>
    </div>
  );
}

interface TerminalOSProps {
  errored: boolean;
  currentScreen: string;
  commands: string[];
  onCommand: (command: string) => void;
}

export function TerminalOS(props: TerminalOSProps) {
  let commandInput: HTMLInputElement;

  const [command, setCommand] = createSignal<string>('');
  const trailingSpaces = createMemo(() => command().length - command().trimEnd().length);

  const handleCommand: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    props.onCommand(camelCase(command().trim()));
    setCommand('');
  };

  onMount(() => {
    const focus = () => commandInput.focus();
    commandInput.addEventListener('blur', focus);

    focus();

    onCleanup(() => {
      commandInput.removeEventListener('blur', focus);
    });
  });

  return (
    <div class="terminal__os">
      <div class="terminal__current">Current screen: {props.currentScreen}</div>

      <div class="terminal__screen">
        <ul class="terminal__next-events">
          <For each={props.commands}>{(event) => <li>{noCase(event)}</li>}</For>
        </ul>
      </div>

      <p class="terminal__error">{props.errored && '⚠ Unrecognized command'}</p>
      <form
        class="terminal__input"
        style={`--trailing-spaces: ${trailingSpaces()}`}
        onsubmit={handleCommand}
      >
        <label for="command-input">Command:</label>
        <input
          id="command-input"
          ref={commandInput!}
          type="text"
          name="command"
          value={command()}
          onInput={(e) => setCommand(e.currentTarget.value)}
        />
        <span>{command()}</span>
      </form>
    </div>
  );
}

export function Terminal() {
  const [state, send, service] = useMachine(terminalMachine);
  const [nextEvents, setNextEvents] = createSignal<string[]>([]);

  onMount(() => {
    // TODO this should be fixed now in the new xstate/solid version
    const subscription = service.subscribe((state) => {
      setNextEvents(state.nextEvents.filter((event) => !event.startsWith('xstate.')));
    });

    onCleanup(() => {
      subscription.unsubscribe();
    });
  });

  return (
    <div class="terminal" style={{ '--character-size': `${CHAR_SIZE}px` }}>
      <Show when={state.matches('booting')}>
        <BootScreen />
      </Show>

      <Show when={!state.matches('booting')}>
        <TerminalOS
          commands={nextEvents()}
          currentScreen={state.value as string}
          errored={!(state.changed ?? true)}
          onCommand={(command) => send({ type: command as any })}
        />
      </Show>
    </div>
  );
}
