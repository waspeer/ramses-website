import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'ramsesboomboom',

  projectId: '3immztfh',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentListItem().id('about').schemaType('about'),
            S.documentTypeListItem('show').title('Shows'),
            S.documentTypeListItem('release').title('Releases'),
            S.documentListItem().id('team').schemaType('team').title('Team'),
            S.documentListItem()
              .id('textCommands')
              .schemaType('textCommands')
              .title('Text Commands'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
