import { NftContextProvider } from "../context/NftContext";
import "../styles/globals.css";
import "../styles/main.css";

function MyApp({ Component, pageProps }) {
  return (
    <NftContextProvider>
      <Component {...pageProps} />
    </NftContextProvider>
  );
}

export default MyApp;
