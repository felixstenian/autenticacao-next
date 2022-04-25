import { useContext, useEffect, useCallback } from 'react'
import { AuthContext } from '../Context/Authcontext'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  const loadUser = useCallback(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }, [])
  
  useEffect(() => {
    loadUser()
  }, [loadUser])

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')
  console.log(response.data)
  return {
    props: {}
  }
})