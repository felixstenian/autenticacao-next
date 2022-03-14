import { useContext, useEffect } from 'react'
import { AuthContext } from '../Context/Authcontext'
import { api } from '../services/api'

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }, [])
  return (
    <>
      <h1>dashboard</h1>
      <div>
        User: {user?.email}
      </div>    
    </>
  )
}

export default Dashboard