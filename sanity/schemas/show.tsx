import { Headset } from '@icon-park/react';
import { defineField, defineType } from 'sanity';

export const Show = defineType({
  name: 'show',
  title: 'Show',
  type: 'document',
  icon: Headset,
  // validation: (Rule) =>
  //   Rule.custom((fields) => {
  //     const link = typeof fields?.link === 'string' ? fields.link : '';
  //     const linkText = typeof fields?.linkText === 'string' ? fields.linkText : '';

  //     if (link.length > 0 && linkText.length === 0) {
  //       return 'A link text must be added when adding a link';
  //     }

  //     return true;
  //   }),
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
    }),
    // defineField({
    //   name: 'linkText',
    //   title: 'Link Text',
    //   type: 'string',
    //   options: {
    //     list: ['More Info', 'Tickets'],
    //   },
    // }),
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      city: 'city',
      country: 'country',
    },
    prepare(selection) {
      const { title, startDate, city, country } = selection;

      return {
        title,
        subtitle: `${startDate} - ${city}, ${country}`,
      };
    },
  },
  orderings: [
    {
      title: 'Start Date',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
});
