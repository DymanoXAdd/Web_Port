import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const socialType = defineType({
  name: 'social',
  title: 'Social',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      description: 'Platform for social media',
      type: 'string',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    }
  ]
})
