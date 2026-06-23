import type {SchemaTypeDefinition} from 'sanity'

import {experienceType} from './experience'
import {pageInfoType} from './pageInfo'
import {projectType} from './project'
import {skillType} from './skill'
import {socialType} from './social'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [pageInfoType, experienceType, projectType, skillType, socialType],
}
