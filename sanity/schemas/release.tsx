import { RecordDisc } from '@icon-park/react';
import { defineField, defineType } from 'sanity';

export const Release = defineType({
  name: 'release',
  title: 'Release',
  type: 'document',
  icon: RecordDisc,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artwork',
      title: 'Artwork',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      description: 'Link to for example spotify / link tree / etc.',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'artwork',
    },
  },
  orderings: [
    {
      title: 'Release Date',
      name: 'releaseDateAsc',
      by: [{ field: 'releaseDate', direction: 'asc' }],
    },
  ],
});
