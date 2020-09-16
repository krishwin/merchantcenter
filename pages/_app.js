import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import Cookies from "js-cookie";
import '@shopify/polaris/styles.css';
import NProgress from 'nprogress'; 
import 'nprogress/nprogress.css'; 
import Router from 'next/router';


class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const config = { apiKey: API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };
    
     Router.events.on('routeChangeStart', () => NProgress.start());
   Router.events.on('routeChangeComplete', () => NProgress.done()); 
  Router.events.on('routeChangeError', () => NProgress.done());
  
    return (
   
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
        </Head>
        <Provider config={config}>
          <AppProvider>
            <Component {...pageProps} />
          </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default MyApp;
