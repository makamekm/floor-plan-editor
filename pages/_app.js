import React from 'react'
import App from 'next/app'
import Root from '../components/root'

class Application extends App {
  // Without it query will be empty
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return <Root>
      <Component {...pageProps} />
    </Root>
  }
}

export default Application;