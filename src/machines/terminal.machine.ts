import { createMachine } from 'xstate';
export const terminalMachine = createMachine({
  id: 'terminal',
  tsTypes: {} as import('./terminal.machine.typegen').Typegen0,
  schema: {
    context: {} as {},
    events: {} as { type: 'shows' } | { type: 'contact' } | { type: 'back' },
  },
  context: {},
  initial: 'booting',
  states: {
    booting: {
      after: {
        1000: 'idle',
      },
    },
    idle: {
      on: {
        shows: 'shows',
        contact: 'contact',
      },
    },
    shows: {
      on: {
        back: 'idle',
      },
    },
    contact: {
      on: {
        back: 'idle',
      },
    },
  },
  predictableActionArguments: true,
});
