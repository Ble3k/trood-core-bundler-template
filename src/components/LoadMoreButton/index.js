import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import { defineMessages } from 'react-intl'
import { intlObject } from '$trood/localeService'

import TButton from '$trood/components/TButton'
import LoadingIndicator from '$trood/components/LoadingIndicator'
import { BUTTON_COLORS, BUTTON_TYPES } from '$trood/components/TButton/constants'

import style from './index.css'


export const messages = defineMessages({
  loadMore: {
    id: 'components.LoadMoreButton.load_more',
    defaultMessage: 'Load more...',
  },
})

class LoadMoreButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    label: PropTypes.node,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    isLoading: false,
    onClick: () => {},
  }

  render() {
    const {
      className,
      label = intlObject.intl.formatMessage(messages.loadMore),
      isLoading,
      onClick,

    } = this.props

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        <LoadingIndicator {...{
          className: isLoading ? style.indicator : style.hidden,
          animationStop: !isLoading,
        }} />
        <TButton {...{
          className: isLoading ? style.hidden : style.button,
          label,
          type: BUTTON_TYPES.text,
          color: BUTTON_COLORS.gray,
          onClick: () => {
            onClick()
          },
        }} />
      </div>
    )
  }
}

export default LoadMoreButton
