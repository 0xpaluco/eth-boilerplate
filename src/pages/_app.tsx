import '@src/styles/globals.css'
import { AppPropsWithLayout } from '@lib/types'

export default function App({ Component, pageProps }: AppPropsWithLayout) {

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <div className='h-full'>
      {Component.auth ? (
        <Auth>
          {getLayout(<Component {...pageProps} />)}
        </Auth>
      ) : (
        getLayout(<Component {...pageProps} />)
      )}
    </div>
  )


}

interface AuthProps {
  children: any
}
function Auth({ children }: AuthProps) {

  // const { status } = useSession({ required: true })
  // const isLoading = status === "loading";
  // const isAuthenticated = status === "authenticated";

  // // useEffect(() => {
  // //   console.log(`isAuthenticated: ${isAuthenticated}`);
  // //   console.log(`isLoading: ${isLoading}`);
  // // },[isLoading, isAuthenticated])

  // if (isLoading) {
  //   return <div>Authenticating...</div>
  // }

  // if (isAuthenticated) {
  //   return children;
  // }

  // // Session is being fetched, or no user.
  // // If no user, useEffect() will redirect.
  // return <AuthView />

  return children;
}