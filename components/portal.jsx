import React from 'react'
import ReactDOM from 'react-dom'

export default class Portal extends React.Component {
  componentDidMount () {
    this.element = this.props.selector
      ? document.querySelector(this.props.selector)
      : document.body
    this.forceUpdate()
  }

  render () {
    if (this.element === undefined) {
      return null
    }

    return ReactDOM.createPortal(this.props.children, this.element)
  }
}