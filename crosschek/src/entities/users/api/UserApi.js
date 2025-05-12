// entities/users/api/UserApi.js
import {
	setTokenStorage,
	getAccessToken,
	getRefreshToken,
	clearTokenUserStorage,
	isTokenExpired,
} from '../../../utils/auth.utils'

class UserApi {
	static async auth(username, password) {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/accounts/token/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ username, password }),
			}
		)

		if (!response.ok) {
			throw new Error('Ошибка авторизации')
		}

		const data = await response.json()
		return data
	}

	static async register(username, email, password){
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/accounts/register/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ username, email, password }),
			}
		)

		if (!response.ok) {
			throw new Error('Ошибка регистрации')
		}

		const data = await response.json()
		return data
	}

	static async refreshToken() {
		const refresh = getRefreshToken()
		if (!refresh) throw new Error('No refresh token')

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/accounts/token/refresh/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ refresh }),
			}
		)

		if (!response.ok) {
			clearTokenUserStorage()
			throw new Error('Ошибка обновления токена')
		}

		return response.json()
	}

	// Метод для авторизованных запросов
	static async authorizedRequest(url, options = {}) {
		let access = getAccessToken()

		// Если токен истек, пробуем обновить
		if (isTokenExpired(access)) {
			try {
				const newTokens = await this.refreshToken()
				setTokenStorage(newTokens.access, newTokens.refresh)
				access = newTokens.access
			} catch (error) {
				clearTokenUserStorage()
				throw new Error('Session expired')
			}
		}

		const response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${access}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})

		if (response.status === 401) {
			clearTokenUserStorage()
			throw new Error('Session expired')
		}

		return response
	}
	static async getUserById(id) {
		const accessToken = getAccessToken()

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/accounts/users/${id}/`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			}
		)

		if (response.status === 401) {
			// Если токен истек, пробуем обновить
			try {
				const newTokens = await this.refreshToken()
				setTokenStorage(newTokens.access, newTokens.refresh)
				// Повторяем запрос с новым токеном
				return this.getUserById(id)
			} catch (error) {
				clearTokenUserStorage()
				throw new Error('Session expired')
			}
		}

		if (!response.ok) {
			throw new Error('Ошибка получения данных пользователя')
		}

		return response.json()
	}

	static async updateUser(id, userData) {
		try {
			const response = await this.authorizedRequest(
				`${import.meta.env.VITE_API_URL}/accounts/users/${id}/`,
				{
					method: 'PUT',
					body: JSON.stringify(userData),
				}
			)

			if (!response.ok) {
				const errorData = await response.json()
				console.error('Error response:', errorData)
				throw new Error(
					errorData.detail ||
						JSON.stringify(errorData) ||
						'Ошибка обновления данных пользователя'
				)
			}

			return response.json()
		} catch (error) {
			console.error('Update user error:', error)
			throw error
		}
	}
}

export default UserApi
