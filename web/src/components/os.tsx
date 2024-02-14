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
  const { currentScreen, sendCommandToRouter, triggeredAudioFile, goHome } = createRouter(props);

  const [command, setCommand] = createSignal<string>('');
  const [error, setError] = createSignal<'none' | 'command'>('none');

  const homeCommands = createMemo(() =>
    props.data.filter((screen) => !screen.hidden).map((screen) => screen.commands[0]!),
  );
  const availableCommands = createMemo(() =>
    // currentScreen is a string in the case of the home or not-found screens
    typeof currentScreen() === 'string' ? homeCommands() : ['back'],
  );

  // Play triggered audio files
  const audioFiles = new Map<string, Howl>();
  const [isPlaying, setIsPlaying] = createSignal(false);

  createEffect(() => {
    const assetUrl = triggeredAudioFile()?.url;

    if (assetUrl) {
      let audioFile = audioFiles.get(assetUrl);

      if (!audioFile) {
        audioFile = new Howl({
          src: [assetUrl],
          onend: () => setIsPlaying(false),
          onplay: () => setIsPlaying(true),
          onstop: () => setIsPlaying(false),
          onpause: () => setIsPlaying(false),
        });
        audioFiles.set(assetUrl, audioFile);
      }

      audioFile.play();
    }
  });

  const handleCommand = (command: string) => {
    setCommand('');

    const camelCaseCommand = camelCase(command);

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
        <Show when={isPlaying()}>
          <div class="os__sound-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11 2h2v20h-2v-2H9v-2h2V6H9V4h2zM7 8V6h2v2zm0 8H3V8h4v2H5v4h2zm0 0v2h2v-2zm10-6h-2v4h2zm2-2h2v8h-2zm0 8v2h-4v-2zm0-10v2h-4V6z"
              />
            </svg>
          </div>
        </Show>

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
                .with({ target: 'audioCommands' }, () => {
                  throw new Error('No screen for audio commands');
                })
                .exhaustive(),
            )
            .with({ _kind: 'textCommand' }, (screen) => <ScreenTextCommands data={screen.data} />)
            .with({ _kind: 'audioCommand' }, () => {
              throw new Error('No screen for audio commands');
            })
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

  const [triggeredAudioFile, setTriggeredAudioFile] = createSignal<{ url: string } | null>(null);

  // Sync the URL with the current screen
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

    if (target) {
      if (target._kind === 'audioCommand') {
        setTriggeredAudioFile({ url: target.assetUrl });
      } else {
        setCurrentScreen(target);
      }
    }
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

    // eslint-disable-next-line solid/reactivity
    return () => {
      window.removeEventListener('popstate', syncPath);
    };
  });

  return {
    currentScreen,
    sendCommandToRouter,
    triggeredAudioFile,
    goHome,
  };
}
