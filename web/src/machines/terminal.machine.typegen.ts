// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.after(5000)#terminal.booting': { type: 'xstate.after(5000)#terminal.booting' };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | 'about'
    | 'booting'
    | 'contact'
    | 'idle'
    | 'lifequote'
    | 'music'
    | 'shows'
    | 'tellMyFuture'
    | 'whereAmI';
  tags: never;
}
