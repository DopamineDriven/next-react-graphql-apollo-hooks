import React from 'react';
import get from 'lodash.get';
import App, { Container } from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import Router from 'next/router';
import { pageview } from '../lib/gtag';
import { NODE_ENV, CUSTOM_ENV } from '../config/config';
import withApolloClient from '../lib/with-apollo-client';
import globalStyle from '../theme/global.scss';

interface MyAppProps {
  Component: any,
  pageProps: any,
  apolloClient: any
}

if (CUSTOM_ENV === 'production') {
  Router.events.on('onRouteChangeComplete', (url: string) => {
    pageview(url);
  });
}

class MyApp extends App<MyAppProps> {
  componentDidMount(): void {
    import('webfontloader').then(WebFont =>
      WebFont.load({
        google: {
          families: ['Montserrat']
        }
      })
    );
    if ('serviceWorker' in navigator && NODE_ENV === 'production') {
      get(navigator, 'serviceWorker').register('/service-worker.js');
    }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;

    console.log(Component, pageProps, apolloClient);

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <div className={globalStyle.Global}>
            <Component {...pageProps} />
          </div>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
