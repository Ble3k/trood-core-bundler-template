import React, { PureComponent } from 'react'
import classNames from 'classnames'

import TIcon from '../../../TIcon'

import styles from './index.css'


class StyleButton extends PureComponent {
  constructor(props) {
    super(props)
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle() {
    this.props.onToggle(this.props.style, this.props.editorState)
  }

  render() {
    const {
      editorState = {},
      color,
      label,
      icon,
      style,
    } = this.props

    let isActive = false

    if (editorState.getSelection) {
      const selection = editorState.getSelection()
      const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey())
      const delta = selection.getStartOffset() === selection.getEndOffset()
      isActive = block.getInlineStyleAt(selection.getStartOffset() - delta).some(s => s === style)
    }

    return (
      <TIcon {...{
        className: classNames(styles.root, isActive && styles.active),
        size: 16,
        type: icon,
        color,
        label,
        onClick: this.onToggle,
      }} />
    )
  }
}

export default StyleButton
