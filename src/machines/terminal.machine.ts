import { createMachine } from 'xstate';
export const terminalMachine = createMachine({
  id: 'terminal',
  tsTypes: {} as import('./terminal.machine.typegen').Typegen0,
  schema: {
    context: {} as {},
    events: {} as
      | { type: 'shows' }
      | { type: 'contact' }
      | { type: 'back' }
      | { type: 'about' }
      | { type: 'music' }
      | { type: 'lifequote' }
      | { type: 'tellMyFuture' }
      | { type: 'whereAmI' },
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
        about: 'about',
        music: 'music',
        contact: 'contact',
        lifequote: 'lifequote',
        tellMyFuture: 'tellMyFuture',
        whereAmI: 'whereAmI',
      },
    },
    shows: {
      on: {
        back: 'idle',
      },
    },
    about: {
      on: {
        back: 'idle',
      },
    },
    music: {
      on: {
        back: 'idle',
      },
    },
    contact: {
      on: {
        back: 'idle',
      },
    },
    lifequote: {
      on: {
        back: 'idle',
      },
    },
    tellMyFuture: {
      on: {
        back: 'idle',
      },
    },
    whereAmI: {
      on: {
        back: 'idle',
      },
    },
  },
  predictableActionArguments: true,
});
