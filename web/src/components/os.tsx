import { camelCase, noCase } from 'change-case';
import { Howl } from 'howler';
import { For, Show, createMemo, createSignal, onCleanup, onMount, type Setter } from 'solid-js';
import { match } from 'ts-pattern';

import type { Data, Screen } from '../lib/data';

import { ScreenAbout } from './screen-about';
import { ScreenContact } from './screen-contact';
import { ScreenMusic } from './screen-music';
import { ScreenShows } from './screen-shows';
import { ScreenTextCommands } from './screen-text-commands';

import './os.css';

interface TerminalOSProps {
  data: Data;
  initialPath: string;
}

function createPathState(initialPath: string) {
  const path = typeof window !== 'undefined' ? window.location.pathname : initialPath;
  const initialScreenName = path === '/' ? null : path.slice(1);

  const [screenName, setScreenName] = createSignal<string | null>(initialScreenName);

  function updatePath(screenName: string | null) {
    setScreenName(screenName);
    window.history.pushState({}, '', screenName ? `/${screenName}` : '/');
  }

  onMount(() => {
    const syncPath = () => {
      setScreenName(window.location.pathname.slice(1) || null);
    };

    window.addEventListener('popstate', syncPath);

    return () => {
      window.removeEventListener('popstate', syncPath);
    };
  });

  return [screenName, updatePath] as const;
}

export function OS(props: TerminalOSProps) {
  const [screenName, setScreenName] = createPathState(props.initialPath);
  const [currentScreen, setCurrentScreen] = createSignal<Screen | 'home' | 'not-found'>(
    screenName()
      ? // eslint-disable-next-line solid/reactivity
        props.data.find((screen) => screen.target === screenName()) ?? 'not-found'
      : 'home',
  );
  const [command, setCommand] = createSignal<string>('');
  const [error, setError] = createSignal<'none' | 'command'>('none');

  const availableCommands = createMemo(() =>
    typeof currentScreen() === 'string'
      ? props.data
          .filter((screen) => !screen.hidden)
          .map((event) => event.commands[0]!)
          .concat('synare')
      : ['back'],
  );

  const synare = new Howl({ src: ['/synare.mp3'] });

  const handleCommand = (command: string) => {
    setCommand('');

    const camelCaseCommand = camelCase(command);

    if (camelCaseCommand === 'synare') {
      synare.play();
      return;
    }

    if (camelCaseCommand === 'back') {
      setScreenName(null);
      setCurrentScreen('home');
      setError('none');
      return;
    }

    const targetScreen = props.data.find((event) => event.commands.includes(camelCaseCommand));

    if (targetScreen) {
      setScreenName(targetScreen.target);
      setCurrentScreen(targetScreen);
      setError('none');
      return;
    }

    setError('command');
  };

  return (
    <div class="os">
      <div class="os__screen">
        <div class="os__screen-inner">
          {match(currentScreen())
            .with('home', () => null)
            .with('not-found', () => 'not found')
            .with({ _kind: 'template' }, (screen) =>
              match(screen)
                .with({ target: 'about' }, (screen) => <ScreenAbout data={screen.data} />)
                .with({ target: 'contact' }, (screen) => <ScreenContact data={screen.data} />)
                .with({ target: 'music' }, (screen) => <ScreenMusic data={screen.data} />)
                .with({ target: 'shows' }, (screen) => <ScreenShows data={screen.data} />)
                .exhaustive(),
            )
            .with({ _kind: 'textCommand' }, (screen) => <ScreenTextCommands data={screen.data} />)
            .exhaustive()}
        </div>
      </div>

      <ul class="os__available-commands">
        <For each={availableCommands()}>{(command) => <li>{noCase(command)}</li>}</For>
      </ul>

      <Show when={error() === 'command'}>
        <p class="os__error">⚠ Unrecognized command</p>
      </Show>

      <CommandInput value={command()} onInput={setCommand} onSubmit={handleCommand} />
    </div>
  );
}

interface CommandInputProps {
  value: string;
  onInput: Setter<string>;
  onSubmit: (command: string) => void;
}

function CommandInput(props: CommandInputProps) {
  let commandInput: HTMLInputElement;

  // The input is masked so we need to keep track of the number of trailing spaces
  // to properly align the cursor.
  const trailingSpaces = createMemo(() => props.value.length - props.value.trimEnd().length);

  const focusInput = () => {
    commandInput.focus();
  };

  // Focus the input when the user presses a key
  onMount(() => {
    document.addEventListener('keydown', focusInput);
    focusInput();

    onCleanup(() => {
      document.removeEventListener('keydown', focusInput);
    });
  });

  return (
    <form
      class="os__input"
      style={{ '--trailing-spaces': trailingSpaces() }}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(props.value);
      }}
      onClick={focusInput}
      role="presentation"
    >
      <label for="command-input">Command:</label>
      <input
        id="command-input"
        ref={commandInput!}
        type="text"
        name="command"
        autofocus
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
      <span>{props.value}</span>
    </form>
  );
}
