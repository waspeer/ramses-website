import { useMachine } from '@xstate/solid';
import { JSX, onCleanup, onMount } from 'solid-js';
import { terminalMachine } from '../machines/terminal.machine';

export function Terminal() {
  let commandInput: HTMLInputElement;

  const [state, send, service] = useMachine(terminalMachine);

  const handleCommand: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    send({ type: e.currentTarget.command.value });
    e.currentTarget.reset();
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
    <div>
      <pre>{state.value.toString()}</pre>

      {(!state.changed ?? false) && <p>Unrecognized command</p>}

      <form onsubmit={handleCommand}>
        <input ref={commandInput!} type="text" name="command" />
      </form>
    </div>
  );
}
