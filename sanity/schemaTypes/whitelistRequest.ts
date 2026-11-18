import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

// A visitor's request to join Orbis, created by /api/whitelist with id "whitelist-requests.<uuid>"
// (the "." keeps it out of the public API). Set Status to Approved and publish to let them in;
// delete the request to deny it. scripts/orbis-stats.py adds approved players, then deletes the request.
export const whitelistRequestType = defineType({
  name: 'whitelistRequest',
  title: 'Whitelist request',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'username', title: 'Minecraft username', type: 'string', readOnly: true}),
    defineField({name: 'note', title: 'Their note', type: 'text', rows: 2, readOnly: true}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Approved: add to the whitelist', value: 'approved'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({name: 'requestedAt', title: 'Requested at', type: 'datetime', readOnly: true}),
    defineField({name: 'uuid', title: 'UUID', type: 'string', readOnly: true}),
  ],
  preview: {select: {title: 'username', subtitle: 'status'}},
})
