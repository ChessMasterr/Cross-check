import { createContext } from 'react'

const UserContext = createContext({
	userState: {
		user: null,
		isAuthenticated: false,
		loading: false,
		error: null,
	},
	dispatchUser: () => {},
})

export default UserContext
