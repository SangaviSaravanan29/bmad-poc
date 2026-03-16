import type { AppProps } from 'next/app'
import Head from 'next/head'
import { AuthProvider } from '../context/AuthContext'
import { TaskProvider } from '../context/TaskContext'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#020617" />
      </Head>
      <AuthProvider>
        <TaskProvider>
          <Component {...pageProps} />
        </TaskProvider>
      </AuthProvider>
    </>
  )
}
