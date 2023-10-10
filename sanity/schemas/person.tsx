import { Baby } from '@icon-park/react';
import { defineField, defineType } from 'sanity';

export const Person = defineType({
  name: 'person',
  title: 'Person',
  type: 'object',
  icon: <Baby />,
  fieldsets: [
    { name: 'name', title: 'Name', options: { columns: 2 } },
    { name: 'company', title: 'Professional Information', options: { columns: 2 } },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      fieldset: 'name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      fieldset: 'name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company',
      type: 'string',
      fieldset: 'company',
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company URL',
      type: 'url',
      fieldset: 'company',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      fieldset: 'company',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      fieldset: 'contact',
      validation: (Rule) => Rule.required().email(),
    }),
  ],
  preview: {
    select: {
      companyName: 'companyName',
      email: 'email',
      role: 'role',
      title: 'firstName',
    },
    prepare: ({ companyName, email, role, title }: any) => ({
      title,
      subtitle: `${companyName ? `${companyName} | ` : ''}${role}, ${email}`,
    }),
  },
});
