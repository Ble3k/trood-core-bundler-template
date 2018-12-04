import React from 'react'

import style from './index.css'

import componentsManifest from '$trood/componentLibraries/manifest'

import {
  GRID_COLUMNS,
  DEFAULT_SPAN,
  GRID_COMPONENT_TYPE,
  GRID_MARGIN,
  TROOD_PAGE_PADDING,
} from '../../constants'

import {
  PageManagerContext,
} from '../../../constants'

import {
  HeaderMenu,
  HEADER_TYPES,
  RouteSchema,
} from '../../../components'

import {
  getPagesHeaderRenderers,
  getPagesRouteShemaRenderers,
} from '../../../helpers'

import {
  getModelEditorActionsName,
  getFormActionsName,
  getFormPropName,
  getModelComponentsName,
  getModelActionsName,
  getModelConstantsName,
  getModelEntitiesName,
  getModelApiActionsName,
} from '$trood/entityManager'

import {
  SERVICES_PROPS_NAMES,
} from '$trood/serviceManager'


const PageGridLayout = ({
  page: {
    components = [],
    pages,
    url,
  },
  parentPath,
  nestLevel = 0,
  isFirstColumn = true,
  isLastColumn = true,
  entityPageModelName,
  entityPageModelIdSelector,
  ...other
}) => {
  let prevColumn = 0
  return (
    <div {...{
      className: nestLevel > 0 ? style.nestedRoot : style.root,
      style: {
        grid: `auto-flow auto / repeat(${GRID_COLUMNS}, 1fr)`,
      },
    }}>
      {components.map((comp, index) => {
        const currentSpan = comp.span || DEFAULT_SPAN
        const currentId = comp.id || index

        const currentColumnIndex = prevColumn
        prevColumn = (prevColumn + currentSpan) % GRID_COLUMNS

        let compToRender
        if (comp.type === GRID_COMPONENT_TYPE) {
          compToRender = (
            <PageGridLayout {...{
              page: {
                components: comp.components,
                url,
              },
              parentPath,
              nestLevel,
              isFirstColumn: currentColumnIndex === 0,
              isLastColumn: prevColumn === 0,
              entityPageModelName,
              ...other,
            }} />
          )
        } else {
          const CurrentComponent = componentsManifest.components[comp.type]
          let componentServices = {}
          if (componentsManifest.services[comp.type]) {
            // Here we get all services injected props for the component
            // Iterate by component services and get general props object
            componentServices = componentsManifest.services[comp.type].reduce((memo, serviceName) => ({
              ...memo,
              // Iterate by service prop names and get service props object
              ...SERVICES_PROPS_NAMES[serviceName].reduce((propsMemo, propName) => ({
                ...propsMemo,
                [propName]: other[propName],
              }), {}),
            }), {})
          }

          const currentComponentProps = Object.keys(comp.models || {}).reduce((memo, key) => {
            const currentEditorActionsName = getModelEditorActionsName(key)
            const currentApiActionsName = getModelApiActionsName(key)
            const currentActionsName = getModelActionsName(key)
            const currentComponentsName = getModelComponentsName(key)
            const currentConstantsName = getModelConstantsName(key)
            const currentEntitiesName = getModelEntitiesName(key)
            return {
              ...memo,
              [key]: other[key],
              [currentEditorActionsName]: other[currentEditorActionsName],
              [currentActionsName]: other[currentActionsName],
              [currentComponentsName]: other[currentComponentsName],
              [currentConstantsName]: other[currentConstantsName],
              [currentEntitiesName]: other[currentEntitiesName],
              [currentApiActionsName]: other[currentApiActionsName],
            }
          }, {
            model: other.model,
            form: other[getFormPropName(comp.type)],
            formActions: other[getFormActionsName(comp.type)],
            ...componentServices,
          })

          compToRender = (
            <CurrentComponent {...{
              ...currentComponentProps,
            }} />
          )
        }

        // Define margings for current grid unit
        // We can have page edges(extra padding) or components without marging
        let marginLeft
        let marginRight
        let marginTop
        if (comp.withMargin && !comp.components) {
          marginTop = GRID_MARGIN
          marginRight = GRID_MARGIN
          if (currentColumnIndex === 0 && isFirstColumn) {
            marginLeft = TROOD_PAGE_PADDING
          }
          if (prevColumn === 0 && isLastColumn) {
            marginRight = TROOD_PAGE_PADDING
          }
        }
        return (
          <div {...{
            key: currentId,
            style: {
              // We add 1, because css grid columns starts from 1
              gridColumn: `${currentColumnIndex + 1} / span ${currentSpan}`,
              marginLeft,
              marginRight,
              marginTop,
            },
          }}>
            {compToRender}
          </div>
        )
      })}
      {pages &&
        <PageManagerContext.Consumer>
          {({ match, basePath, registeredRoutesPaths }) => (
            <React.Fragment>
              <div {...{
                style: {
                  gridColumn: `1 / span ${GRID_COLUMNS}`,
                },
                className: style.secondaryMenu,
              }}>
                <HeaderMenu {...{
                  type: HEADER_TYPES.primary,
                  menuRenderers: getPagesHeaderRenderers(pages, entityPageModelName),
                  basePath,
                }} />
              </div>

              <div style={{
                gridColumn: `1 / span ${GRID_COLUMNS}`,
              }}>
                <RouteSchema {...{
                  basePath,
                  prevMatch: match,
                  registeredRoutesPaths,
                  renderers: getPagesRouteShemaRenderers(pages, {
                    nestLevel: nestLevel + 1,
                    entityPageModelName,
                    parentPath: parentPath.concat(url),
                    entityPageModelIdSelector: other.entityPageModelIdSelector,
                  }),
                }} />
              </div>
            </React.Fragment>
          )}
        </PageManagerContext.Consumer>
      }
    </div>
  )
}

export default PageGridLayout
