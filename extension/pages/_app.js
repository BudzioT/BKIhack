import '../styles/globals.css';
import "../components/navbar/navbar.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
