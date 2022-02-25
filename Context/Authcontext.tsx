import Router from "next/router";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: String[];
  roles: String[];
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user
  
  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { 
        data: { permissions, roles } 
      } = await api.post('sessions', {
        email,
        password
      })

      setUser({ email, permissions, roles })
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
