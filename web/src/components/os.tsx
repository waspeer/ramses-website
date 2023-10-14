import { camelCase, noCase } from 'change-case';
import { Howl } from 'howler';
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type Setter,
} from 'solid-js';
import { match } from 'ts-pattern';

import type { Data, Screen } from '../lib/data';

import { ScreenAbout } from './screen-about';
import { ScreenContact } from './screen-contact';
import { ScreenMusic } from './screen-music';
import { ScreenShows } from './screen-shows';
import { ScreenTextCommands } from './screen-text-commands';

import './os.css';

// =========== //
// TERMINAL OS //
// =========== //

interface TerminalOSProps {
  data: Data;
  initialPath: string;
}

export function OS(props: TerminalOSProps) {
  const { currentScreen, sendCommandToRouter, goHome } = createRouter(props);
  const [command, setCommand] = createSignal<string>('');
  const [error, setError] = createSignal<'none' | 'command'>('none');

  const homeCommands = createMemo(() =>
    props.data
      .filter((screen) => !screen.hidden)
      .map((screen) => screen.commands[0]!)
      .concat('synare me'),
  );
  const availableCommands = createMemo(() =>
    typeof currentScreen() === 'string' ? homeCommands() : ['back'],
  );

  const synare = new Howl({ src: ['/synare.mp3'] });

  const handleCommand = (command: string) => {
    setCommand('');

    const camelCaseCommand = camelCase(command);

    if (['synare', 'synareMe'].includes(camelCaseCommand)) {
      synare.play();
      return;
    }

    if (camelCaseCommand === 'back') {
      goHome();
      setError('none');
      return;
    }

    const commandWasAccepted = sendCommandToRouter(camelCaseCommand);
    setError(commandWasAccepted ? 'none' : 'command');
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

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(props.value);
    commandInput.blur();
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
      onSubmit={handleSubmit}
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

// ====== //
// ROUTER //
// ====== //

interface RouterProps {
  data: Data;
  initialPath: string;
}

function createRouter(props: RouterProps) {
  const commandToScreen = createMemo(
    () =>
      new Map(props.data.flatMap((screen) => screen.commands.map((command) => [command, screen]))),
  );
  const targetToScreen = createMemo(
    () => new Map(props.data.map((screen) => [screen.target, screen])),
  );

  const getScreenFromPath = (path: string) => {
    const target = path.replace(/^\//, '');
    return target === '' ? 'home' : targetToScreen().get(target) ?? 'not-found';
  };

  const [currentScreen, setCurrentScreen] = createSignal<'home' | 'not-found' | Screen>(
    // eslint-disable-next-line solid/reactivity
    getScreenFromPath(props.initialPath),
  );

  createEffect(() => {
    const screen = currentScreen();

    match(screen)
      .with('not-found', () => null)
      .with('home', () => {
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', '/');
        }
      })
      .otherwise((screen) => {
        const path = `/${screen.target}`;
        if (window.location.pathname !== path) {
          window.history.pushState({}, '', path);
        }
      });
  });

  const sendCommandToRouter = (command: string) => {
    const target = commandToScreen().get(command);
    target && setCurrentScreen(target);
    return !!target;
  };

  const goHome = () => {
    setCurrentScreen('home');
  };

  onMount(() => {
    const syncPath = () => {
      setCurrentScreen(getScreenFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', syncPath);

    return () => {
      window.removeEventListener('popstate', syncPath);
    };
  });

  return {
    currentScreen,
    sendCommandToRouter,
    goHome,
  };
}
