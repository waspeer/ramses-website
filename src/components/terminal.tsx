import { useMachine } from '@xstate/solid';
import { camelCase, capitalCase, noCase } from 'change-case';
import { createSignal, For, JSX, onCleanup, onMount } from 'solid-js';
import { terminalMachine } from '../machines/terminal.machine';
import './terminal.css';

export function Terminal() {
  let commandInput: HTMLInputElement;

  const [state, send, service] = useMachine(terminalMachine);
  const [nextEvents, setNextEvents] = createSignal<string[]>([]);
  const [command, setCommand] = createSignal<string>('');

  const handleCommand: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    send({ type: camelCase(command().trim()) as any });
    setCommand('');
  };

  onMount(() => {
    const focus = () => commandInput.focus();
    const subscription = service.subscribe((state) => {
      setNextEvents(state.nextEvents.filter((event) => !event.startsWith('xstate.')));
      focus();
    });

    commandInput.addEventListener('blur', focus);

    onCleanup(() => {
      subscription.unsubscribe();
      commandInput.removeEventListener('blur', focus);
    });
  });

  return (
    <div class="terminal">
      <div class="terminal__current">Current screen: {state.value.toString()}</div>

      <div class="terminal__screen">
        <ul class="terminal__next-events">
          <For each={nextEvents()}>{(event) => <li>{noCase(event)}</li>}</For>
        </ul>
      </div>

      <p class="terminal__error">{!(state.changed ?? true) && '⚠ Unrecognized command'}</p>
      <form class="terminal__input" onsubmit={handleCommand}>
        <label for="command-input">Command:</label>
        <input
          id="command-input"
          ref={commandInput!}
          type="text"
          name="command"
          disabled={state.matches('booting')}
          value={command()}
          onInput={(e) => setCommand(e.currentTarget.value)}
        />
        <span>{command()}</span>
      </form>
    </div>
  );
}
