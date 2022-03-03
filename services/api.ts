import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'

let cookies = parseCookies()

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
      })
    } else {
      // desloga usuário
    }
})