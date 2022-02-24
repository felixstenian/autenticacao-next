import { AppProps } from "next/app"
import { AuthProvider } from "../Context/Authcontext"
import '../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
