import { MessageOne } from '@icon-park/react';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const TextCommands = defineType({
  name: 'textCommands',
  title: 'Text Commands',
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
          icon: MessageOne,
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
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { value: 'single', title: 'Single result' },
                  { value: 'random', title: 'Random result' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'result',
              title: 'Result',
              type: 'richText',
              description:
                'In case of single result, this is the result. In case of random result separate each result with a new line.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'result',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Text Prompts',
        media: MessageOne,
      };
    },
  },
});
