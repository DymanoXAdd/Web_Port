import {BarChartIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

// One document (_id "minecraftStats"), written every 15 min by scripts/orbis-stats.py on the
// Orbis server. Read-only here: edits would be overwritten by the next run.
export const minecraftStatsType = defineType({
  name: 'minecraftStats',
  title: 'Minecraft Stats',
  type: 'document',
  icon: BarChartIcon,
  readOnly: true,
  fields: [
    defineField({name: 'updatedAt', title: 'Updated at', type: 'datetime'}),
    defineField({
      name: 'players',
      title: 'Players',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'uuid', type: 'string'}),
            defineField({name: 'name', type: 'string'}),
            defineField({name: 'playTime', title: 'Play time (ticks)', type: 'number'}),
            defineField({name: 'deaths', type: 'number'}),
            defineField({name: 'mobKills', type: 'number'}),
            defineField({name: 'blocksMined', type: 'number'}),
            defineField({name: 'distanceCm', title: 'Distance (cm)', type: 'number'}),
          ],
          preview: {select: {title: 'name'}},
        }),
      ],
    }),
  ],
})
