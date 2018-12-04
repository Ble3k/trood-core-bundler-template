import React, { PureComponent } from 'react'

import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import PopupBox from '$trood/components/PopupBox'

import style from './index.css'


class DotMenu extends PureComponent {
  render() {
    const {
      size,
      menuRef,
    } = this.props

    return (
      <PopupBox {...{
        ...this.props,
        tRef: menuRef,
        control: (
          <TIcon {...{
            size,
            type: ICONS_TYPES.dotMenu,
            className: style.icon,
          }} />
        ),
      }} />
    )
  }
}

export { POPUP_POSITION } from '$trood/components/PopupBox'

export default DotMenu
