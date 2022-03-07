import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'

let cookies = parseCookies()
let isRefreshig = false
let filedRequestsQueue: any = [] // fila com todas as requisições que aconteceram e deram falha por conta do tokem expirado

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['nextauth.token']}`
  }
})

api.interceptors.request.use(response => { // Recebe dois parametros. 1. resposta que deu sucesso e retornamos sem fazer nada; 2. se deu error
  return response
}, (error: AxiosError) => {
  if (error.response?.status === 401)
    if (error.response.data?.code === 'token.expired') {
      // renova token
      cookies = parseCookies()

      const { 'next.refreshToken': refreshToken } = cookies
      const originalConfig = error.config // é basicamente toda a configuração da requisição feita para o back-end (dentro dela tem todas as configurações necessarias para repetir a requisição para o back)

      if (!isRefreshig) {
        isRefreshig = true

        api.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token, refreshToken: newRefreshToken } = response.data
  
          setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
          })
          setCookie(undefined, 'nextauth.refreshToken', newRefreshToken, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
          })
  
          api.defaults.headers['Authorization'] = `Bearer ${token}`;

          filedRequestsQueue.forEach((request: any) => request.onSucess(token))
          filedRequestsQueue = []
        }).catch(error => {
          filedRequestsQueue.forEach((request: any) => request.onFailure(error))
          filedRequestsQueue = []
        }).finally(() => {
          isRefreshig = false
        })
      }

      return new Promise((resolver, reject) => {
        filedRequestsQueue.push({
          onSucess: (token: string) => { // o que acontece quando o processo de refreshToken finaliza
            originalConfig.headers['Authorization'] = `Bearer ${token}`

            resolver(api(origin))
          }, 
            
          onFailure: (error: AxiosError) => { // o que acontece quando quando o processo falaha
            reject(error)
          } 
            
        })
      })
    } else {
      // desloga usuário
    }
})