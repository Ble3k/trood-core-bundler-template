import pageGridLayout from './pageGridLayout'
import mailService from '$trood/mailService'
import authService from '$trood/auth'


export const PAGE_TYPE_GRID = 'grid'
export const PAGE_TYPE_MAIL = 'mail'
export const PAGE_TYPE_PERSONAL_ACCOUNT = 'personalAccount'

export const PAGE_TYPES = {
  [PAGE_TYPE_GRID]: PAGE_TYPE_GRID,
  [PAGE_TYPE_MAIL]: PAGE_TYPE_MAIL,
  [PAGE_TYPE_PERSONAL_ACCOUNT]: PAGE_TYPE_PERSONAL_ACCOUNT,
}

const pageTypesLayoutsDict = {
  [PAGE_TYPES.grid]: pageGridLayout,
  [PAGE_TYPES.mail]: mailService,
  [PAGE_TYPES.personalAccount]: authService,
}

// Here we getting all page info for rendering it's layout to Trood system
// We have some services, that provide some special pages, that can also be configured in system config
// These services can define their own implementation of headerRenderer and pageContainer,
// so the page will render custom redux container.
// Also these services recieve an instance of default pageGridLayout, so they can inherit it's behaviour
//
// Later this is a possibility for defining full custom user services and pages
export const getPageLayoutProps = (page, entityPageName) => {
  const currentPageService = pageTypesLayoutsDict[page.type]
  const propsArgs = [page, entityPageName, pageGridLayout]
  return {
    pageConfig: currentPageService.getPageConfig(...propsArgs),
    id: currentPageService.getPageId(...propsArgs),
    headerRenderer: currentPageService.getPageHeaderRendererConfig(...propsArgs),
    container: currentPageService.getPageContainer(...propsArgs),
    modelType: currentPageService.getModelType(...propsArgs),
    modelIdSelector: currentPageService.getModelIdSelector(...propsArgs),
  }
}
