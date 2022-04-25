// Função para BLOQUEAR acesso para visitantes, pessoas que não estão logadas

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"

export const withSSRAuth = <P>(fn: GetServerSideProps<P>) => {
  return async (ctx: GetServerSidePropsContext): 
  Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
  
    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    return await fn(ctx)
  }
}
