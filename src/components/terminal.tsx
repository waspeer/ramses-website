import { useMachine } from '@xstate/solid';
import { createSignal, For, JSX, onCleanup, onMount } from 'solid-js';
import { terminalMachine } from '../machines/terminal.machine';

export function Terminal() {
  let commandInput: HTMLInputElement;

  const [state, send, service] = useMachine(terminalMachine);
  const [nextEvents, setNextEvents] = createSignal<string[]>([]);

  const handleCommand: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    send({ type: e.currentTarget.command.value });
    e.currentTarget.reset();
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
    <div>
      <pre>{state.value.toString()}</pre>

      <ul>
        <For each={nextEvents()}>{(event) => <li>{event}</li>}</For>
      </ul>

      {!(state.changed ?? true) && <p>Unrecognized command</p>}
      <form onsubmit={handleCommand}>
        <input ref={commandInput!} type="text" name="command" disabled={state.matches('booting')} />
      </form>
    </div>
  );
}
