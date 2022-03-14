import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { 
  setCookie, // armazena o cokkie
  parseCookies,  // retorna uma lista com todos os cookies armazenados
  destroyCookie // Remove os dados dos cookies
} from 'nookies'

import { api } from "../services/api";

type User = {
  email: string;
  permissions: String[];
  roles: String[];
  token?: string;
  refreshToken?: string;
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User | undefined;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export const signOut = () => {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  Router.push('/')
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  // Fazer com que toda vez que o usuário acessar a aplicação apenas pela primeira vez, carregar os dados de usuário novamente
  useEffect(() => {
    const { 'nextauth.token': token  } = parseCookies()

    if (token)
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data

        setUser({ email, permissions, roles })
      }).catch(() => {
        signOut()
      })
  }, [])

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { 
        data: { permissions, roles, token, refreshToken } 
      } = await api.post('sessions', {
        email,
        password
      })

      setUser({ email, permissions, roles, token, refreshToken })
      
      setCookie(undefined, 'nextauth.token', token, {  // recebe 3 parametros obrigatorios e também conseguimos passar algumas configurações / 1. contexto da requisição (mas como o usuário realiza o login pelo navegador, não existe requisição, então envamos como undefined) / 2. nome do cookie / 3. valor do token
        maxAge: 60 * 60 * 24 * 30, // 30 days // Tempo em que o cookie fica salvo no navegador
        path: '/' // diz quais caminhos da aplicação vão ter acesso a esse cookie, e quando colocamos '/' falamos que qualquer endereço da aplicação pode ter acesso ao cookie
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      Router.push('/dashboard')
      
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

// diego@rocketseat.team
// 123456