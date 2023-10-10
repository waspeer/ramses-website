import { For } from 'solid-js';

import type { ScreenByName } from '../lib/data';

import { MaybeLink } from './maybe-link';

interface ScreenContactProps {
  data: ScreenByName['contact']['data'];
}

export function ScreenContact(props: ScreenContactProps) {
  return (
    <For each={props.data?.team}>
      {(member) => (
        <p>
          {member.firstName} {member.lastName} // {member.role}
          <br />
          <MaybeLink url={member.companyUrl} blank>
            {member.companyName}
          </MaybeLink>
          <br />
          <a href={`mailto:${member.email}`}>{member.email}</a>
        </p>
      )}
    </For>
  );
}
