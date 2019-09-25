import React from 'react'
import App from 'next/app'
import Root from '../components/root'

class Application extends App {
  render() {
    const { Component, pageProps } = this.props
    return <Root>
      <Component {...pageProps} />
    </Root>
  }
}

export default Application;