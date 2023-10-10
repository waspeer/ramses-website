import { camelCase } from 'change-case';

import type { ImageValue, LinkData, RichTextValue } from './types';

import { resolvePromiseMap } from './resolve-promise-map';
import { sanity } from './sanity';

type SanityData = Awaited<ReturnType<typeof fetchSanityData>>;

export type TextCommandResult = Omit<
  NonNullable<SanityData['textCommands']>['commands'][number],
  'command' | 'title'
>;

export interface TextCommandScreen {
  _kind: 'textCommand';
  commands: string[];
  hidden: boolean;
  target: string;
  data: TextCommandResult;
}

export type ScreenByName = {
  [ScreenName in keyof SanityData]: ScreenName extends 'textCommands'
    ? never
    : {
        _kind: 'template';
        commands: string[];
        hidden: boolean;
        target: ScreenName;
        data: SanityData[ScreenName];
      };
};

export type TemplateScreen = ScreenByName[keyof ScreenByName];

export type Screen = TemplateScreen | TextCommandScreen;

export type Data = Screen[];

// Commands that trigger each screen
const COMMANDS: Record<keyof SanityData, string[]> = {
  shows: ['shows', 'tour'],
  about: ['about'],
  music: ['music', 'releases'],
  contact: ['contact'],
  textCommands: [],
};

// Sanity data fragment for link data
const LINK_FRAGMENT = /* groq */ `
  text,
  url,
  blank,
`;

// Last modified date of the last fetched data
let lastModified: string | null = null;

// Last fetched data
let data: Data | null = null;

/**
 * Fetches fresh data in parallel queries from Sanity.
 */
async function fetchSanityData() {
  return await resolvePromiseMap({
    about: sanity.fetch<{
      bio: RichTextValue;
      socials: LinkData[];
    }>(/* groq */ `
      *[_id == 'about'][0] {
        bio,
        socials[] { ${LINK_FRAGMENT} }
      }
    `),

    shows: sanity.fetch<
      {
        title: string;
        startDate: string;
        city: string;
        country: string;
        link?: string;
        linkText?: string;
      }[]
    >(/* groq */ `
      *[_type == 'show' && startDate > now()] | order(startDate asc) {
        title,
        startDate,
        city,
        country,
        link,
        linkText,
      }
    `),

    music: sanity.fetch<
      {
        name: string;
        label: string;
        artwork: ImageValue;
        releaseDate: string;
        link: string;
      }[]
    >(/* groq */ `
      *[_type == 'release'] | order(releaseDate desc) {
        name,
        label,
        artwork,
        releaseDate,
        link,
      }
    `),

    contact: sanity.fetch<{
      team: {
        firstName: string;
        lastName: string;
        role: string;
        companyName?: string;
        companyUrl?: string;
        email: string;
      }[];
    }>(/* groq */ `
      *[_id == 'team'][0] {
        'team': members[] {
          firstName,
          lastName,
          companyName,
          companyUrl,
          role,
          email,
        }
      }
    `),

    textCommands: sanity.fetch<{
      commands: {
        title: string;
        command: string;
        hidden?: boolean;
        type: 'single' | 'random';
        result: RichTextValue;
      }[];
    }>(/* groq */ `
      *[_id == 'textCommands'][0] {
        commands[] {
          title,
          command,
          hidden,
          type,
          result,
        }
      }
    `),
  });
}

/**
 * Parses fetched Sanity data into app screens.
 */
function parseData(data: Awaited<ReturnType<typeof fetchSanityData>>) {
  // Sanity data did not fetch properly
  if (!data) {
    return null;
  }

  const screens: Data = [];

  for (const screenName of Object.keys(data) as (keyof SanityData)[]) {
    const screenCommands = COMMANDS[screenName];
    const screenData = data[screenName];

    if (!screenData) {
      continue;
    }

    if (screenName === 'textCommands') {
      for (const textCommand of data.textCommands?.commands ?? []) {
        const { command: commandList, title, hidden, ...rest } = textCommand;
        const commands = commandList.split(/,\s*/g).map((c) => camelCase(c));

        screens.push({
          _kind: 'textCommand',
          commands,
          hidden: !!hidden,
          target: camelCase(title),
          data: rest,
        });
      }
    } else {
      screens.push({
        _kind: 'template',
        commands: screenCommands,
        hidden: false,
        target: screenName,
        data: screenData as any,
      });
    }
  }

  return screens;
}

/**
 * Fetches latest data from Sanity.
 * Only fetches fresh data if the data has been updated since the last fetch.
 */
export async function fetchData() {
  const newLastModified = await sanity.fetch<string | null>(
    lastModified
      ? /* groq */ `*[!(_type match 'system.*') && _updatedAt > $lastModified] | order(_updatedAt desc)[0]._updatedAt`
      : /* groq */ `*[!(_type match 'system.*')] | order(_updatedAt desc)[0]._updatedAt`,
    { lastModified },
    { perspective: 'published' },
  );

  if (newLastModified !== lastModified) {
    lastModified = newLastModified;
    data = await fetchSanityData().then(parseData);
  }

  return data;
}
