import { NextApiRequest, NextApiResponse, NextPage } from 'next'
import { Session } from 'next-auth'
import { AppInitialProps, AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
    auth: boolean
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
    session: Session
}
