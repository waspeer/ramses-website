import { defineArrayMember, defineType } from 'sanity';

export const RichText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'url',
                title: 'URL',
                type: 'url',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'blank',
                title: 'Open in new tab',
                description: 'Read https://css-tricks.com/use-target_blank/',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
        ],
      },
      styles: [],
      type: 'block',
    }),
  ],
});
