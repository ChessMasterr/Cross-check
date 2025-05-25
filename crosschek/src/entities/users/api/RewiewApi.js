import { getAccessToken } from '../../../utils/auth.utils'

class ReviewApi {
	static async getReview() {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/assignments/reviews/`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAccessToken()}`,
				},
			}
		)
		const data = await response.json()
		return data
	}

	static async getCriteria(taskId) {
		console.log('Fetching criteria for task:', taskId)
		const url = `${
			import.meta.env.VITE_API_URL
		}/assignments/criteria/?task=${taskId}`
		console.log('Request URL:', url)

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getAccessToken()}`,
			},
		})

		console.log('Response status:', response.status)
		const data = await response.json()
		console.log('Response data:', data)
		return data
	}
}

export default ReviewApi
