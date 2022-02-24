import type { NextPage } from 'next'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../Context/Authcontext'

const Home: NextPage = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const { signIn, isAuthenticated } = useContext(AuthContext)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const data = { email, password }

    await signIn(data)
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className='content'>
        <input type='email' value={email} onChange={e => setEmail(e.target.value)}  />
        <input type='password' value={password} onChange={e => setPassword(e.target.value)}  />

        <button type='submit'>Entrar</button>
      </form>
    </div>
  )
}

export default Home
