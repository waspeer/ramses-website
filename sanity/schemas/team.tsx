import { PeoplesTwo } from '@icon-park/react';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const Team = defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  icon: <PeoplesTwo />,
  fields: [
    defineField({
      name: 'members',
      title: 'Members',
      type: 'array' as const,
      of: [defineArrayMember({ type: 'person' })],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Team',
        media: <PeoplesTwo />,
      };
    },
  },
});
