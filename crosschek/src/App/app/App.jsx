import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from '../router/Router'
import { useReducer } from 'react'
import UserContext from '../../context/UserContext'
import UserReducer from '../../entities/users/model/UserReducer'
function App() {
	const [userState, dispatchUser] = useReducer(UserReducer, {
		user: null,
		isAuthenticated: false,
		loading: false,
		error: null,
	})

	return (
		<UserContext.Provider value={{ userState, dispatchUser }}>
			<RouterProvider router={router} />
		</UserContext.Provider>
	)
}

export default App
