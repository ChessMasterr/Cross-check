import { getAccessToken } from '../../../utils/auth.utils'

class CriteriaApi {
	/**
	 * Получить критерии для задания
	 * @param {number} taskId - ID задания
	 * @returns {Promise<Array<import('../model/types').Criterion>>}
	 */
	static async getCriteria(taskId) {
		console.log('Fetching criteria for task:', taskId)
		const url = `${import.meta.env.VITE_API_URL}/assignments/tasks/${taskId}/`
		console.log('Request URL:', url)
		console.log('Auth token:', getAccessToken())

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getAccessToken()}`,
			},
		})

		console.log('Response status:', response.status)
		if (!response.ok) {
			console.error('Error response:', await response.text())
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = await response.json()
		console.log('Response data:', data)
		return data
	}

	/**
	 * Сохранить оценки по критериям
	 * @param {number} reviewId - ID проверки
	 * @param {Array<import('../model/types').CriterionScore>} scores - Массив оценок
	 * @returns {Promise<void>}
	 */
	static async saveScores(reviewId, scores) {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/assignments/reviews/${reviewId}/scores/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAccessToken()}`,
				},
				body: JSON.stringify({ scores }),
			}
		)
		return response.json()
	}

	/**
	 * Отправить оценку по критерию
	 * @param {Object} grade - объект с полями submission, comment, critety, score, date_grade, rated_by
	 * @returns {Promise<any>}
	 */
	static async saveGrade(grade) {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/assignments/grades/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAccessToken()}`,
				},
				body: JSON.stringify(grade),
			}
		)
		if (!response.ok) {
			throw new Error(`Ошибка при отправке оценки: ${response.status}`)
		}
		return response.json()
	}

	/**
	 * Получить оценки пользователя
	 * @returns {Promise<Array<import('../model/types').Grade>>}
	 */
	static async getGrades() {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/assignments/grades/`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAccessToken()}`,
				},
			}
		)
		if (!response.ok) {
			throw new Error(`Ошибка при получении оценок: ${response.status}`)
		}
		return response.json()
	}
}

export default CriteriaApi
