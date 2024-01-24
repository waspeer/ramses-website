import { VolumeNotice } from '@icon-park/react';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const AudioCommands = defineType({
  name: 'audioCommands',
  title: 'Audio Commands',
  type: 'document',
  fields: [
    defineField({
      name: 'commands',
      title: 'Commands',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'command',
          title: 'Command',
          type: 'object',
          icon: VolumeNotice,
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'command',
              title: 'Command',
              type: 'string',
              description:
                'The command that will trigger the response. If you want to define multiple commands, separate them with a comma.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'hidden',
              title: 'Hidden',
              type: 'boolean',
              description:
                'If checked, the command will not be shown in the list of available commands.',
              initialValue: false,
            }),
            defineField({
              name: 'file',
              title: 'File',
              type: 'file',
              description: 'The audio file to play.',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Audio Prompts',
        media: VolumeNotice,
      };
    },
  },
});
