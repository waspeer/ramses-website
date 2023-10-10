import { Show, type JSXElement } from 'solid-js';

interface MaybeLinkProps {
  url?: string | undefined;
  blank?: boolean;
  children: JSXElement;
}

export function MaybeLink(props: MaybeLinkProps) {
  return (
    <>
      <Show when={props.url}>
        <a
          href={props.url}
          target={props.blank ? '_blank' : ''}
          rel={props.blank ? 'noopener noreferrer' : ''}
        >
          {props.children}
        </a>
      </Show>

      <Show when={!props.url}>{props.children}</Show>
    </>
  );
}
