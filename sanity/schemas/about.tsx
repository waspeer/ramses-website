import { Panda } from '@icon-park/react';
import { defineField, defineType } from 'sanity';

export const About = defineType({
  name: 'about',
  title: 'About ramsesboomboom',
  type: 'document',
  icon: <Panda />,
  fields: [
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'richText',
    }),
    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [{ type: 'link' }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About ramsesboomboom',
        media: <Panda />,
      };
    },
  },
});
