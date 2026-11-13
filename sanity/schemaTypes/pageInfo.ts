import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const pageInfoType = defineType({
  name: 'pageInfo',
  title: 'Page Info',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    // Hero copy for the concept A redesign (2026-11-12). All optional: the site falls back to the
    // approved mockup wording when a field is empty.
    defineField({
      name: 'heroKicker',
      title: 'Hero code line',
      type: 'string',
      description: "Small mono line above your name, e.g. SELECT name, role FROM people WHERE handle = 'luis';",
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Shown under your name, e.g. Software engineer who makes data behave.',
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Shown in the hero strip, e.g. Open to opportunities.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'profilePic',
      title: 'Profile Picture',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'backgroundInformation',
      title: 'Background Information',
      type: 'text',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Info',
      type: 'object',
      fields: [
        defineField({name: 'email', title: 'Email', type: 'string'}),
        defineField({name: 'phoneNumber', title: 'Phone Number', type: 'string'}),
        defineField({name: 'address', title: 'Address', type: 'string'}),
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'social'}})],
    }),
  ],
})
