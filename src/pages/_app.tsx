import { AppProps } from 'next/app';
import '../styles/globals.css'; // Adjust path if necessary

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;