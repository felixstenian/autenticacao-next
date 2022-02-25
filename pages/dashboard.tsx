import { useContext } from 'react'
import { AuthContext } from '../Context/Authcontext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
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