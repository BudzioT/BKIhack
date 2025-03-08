import '../styles/globals.css';
import "../components/navbar/navbar.css"
import "../components/emails/emailPage.css"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
