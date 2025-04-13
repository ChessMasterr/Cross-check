class UserApi {
	static async auth(usermane, password) {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
			method: 'POST',
			body: JSON.stringify({ usermane, password }),
		})
		return response.json()
	}
	static async register(usermane, email, password) {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
			method: 'POST',
			body: JSON.stringify({ usermane, email, password }),
		})
		return response.json()
	}
}

export default UserApi
