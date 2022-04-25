import type { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../Context/Authcontext'
import { withSSRGuest } from '../utils/withSSRGuest'

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

export const getServerSideProps: GetServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {
      
    }
  }
})

export default Home
