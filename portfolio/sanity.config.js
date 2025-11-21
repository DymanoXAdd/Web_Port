/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.jsx` route
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'

const config = {
  projectId: projectId || 'tl1sng9j',
  dataset: dataset || 'production',
}

export default defineConfig({
  basePath: '/studio',
  projectId: config.projectId,
  dataset: config.dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema,
})
