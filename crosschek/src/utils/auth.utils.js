export function setTokenStorage(access, refresh) {
	localStorage.setItem('access_token', access)
	localStorage.setItem('refresh_token', refresh)
}

export function getAccessToken() {
	return localStorage.getItem('access_token')
}

export function getRefreshToken() {
	return localStorage.getItem('refresh_token')
}

export function setUserStorage(user) {
	localStorage.setItem('user', JSON.stringify(user))
}

export function getUserStorage() {
	const user = localStorage.getItem('user')
	return user ? JSON.parse(user) : null
}

export function clearTokenUserStorage() {
	localStorage.removeItem('access_token')
	localStorage.removeItem('refresh_token')
	localStorage.removeItem('user')
}

// Добавим функцию проверки срока действия токена
export function isTokenExpired(token) {
	if (!token) return true
	try {
		const payload = JSON.parse(atob(token.split('.')[1]))
		return payload.exp * 1000 < Date.now()
	} catch (error) {
		return true
	}
}
