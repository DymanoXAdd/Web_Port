import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('pageInfo').title('Page Info'),
      S.documentTypeListItem('skill').title('Skill'),
      S.documentTypeListItem('social').title('Social'),
      S.documentTypeListItem('experience').title('Experience'),
      S.documentTypeListItem('project').title('Project'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['pageInfo', 'skill', 'social', 'experience', 'project'].includes(
            item.getId()!
          )
      ),
    ])
