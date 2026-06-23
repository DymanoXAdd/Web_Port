import {CogIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const skillType = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The title of the skill',
      type: 'string',
    }),
    defineField({
      name: 'progress',
      title: 'Progress',
      description: 'The progress of the skill from 0 to 100',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
