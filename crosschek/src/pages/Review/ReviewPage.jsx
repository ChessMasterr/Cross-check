import { useEffect, useState } from 'react'
import ReviewApi from '../../entities/users/api/RewiewApi'
import CriteriaApi from '../../entities/criteria/api/criteriaApi'
import UserApi from '../../entities/users/api/UserApi'
import ScoreInput from '../../components/ScoreInput/ScoreInput'
import './ReviewPage.css'

function ReviewPage() {
	const [reviews, setReviews] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [criteria, setCriteria] = useState({})
	const [saving, setSaving] = useState(false)
	const [scoreData, setScoreData] = useState({})
	const [validationErrors, setValidationErrors] = useState({})

	const validateScores = (taskId, submissionId) => {
		const taskCriteria = criteria[taskId] || []
		const errors = {}
		let hasErrors = false

		taskCriteria.forEach(criterion => {
			const key = `${taskId}-${submissionId}-${criterion.id}`
			const data = scoreData[key] || {}
			const score = data.score

			console.log('Validating score:', { key, score, data }) // Добавляем лог для отладки

			// Проверяем, что оценка является числом
			if (typeof score !== 'number' || isNaN(score)) {
				errors[key] = 'Внесите оценку'
				hasErrors = true
				return
			}

			// Проверяем, что оценка не отрицательная
			if (score < 0) {
				errors[key] = 'Оценка не может быть отрицательной'
				hasErrors = true
				return
			}

			// Проверяем, что оценка не превышает максимальный балл
			if (score > criterion.max_score) {
				errors[key] = `Максимальный балл: ${criterion.max_score}`
				hasErrors = true
				return
			}

			// Проверяем, что оценка является целым числом
			if (!Number.isInteger(score)) {
				errors[key] = 'Оценка должна быть целым числом'
				hasErrors = true
				return
			}
		})

		setValidationErrors(errors)
		return !hasErrors
	}

	const handleScoreChange = (taskId, submissionId, criterionId, data) => {
		const key = `${taskId}-${submissionId}-${criterionId}`
		console.log('handleScoreChange data:', data) // Добавляем лог для отладки
		setScoreData(prev => {
			const newData = {
				...prev,
				[key]: {
					...prev[key],
					...data,
					score: Number(data.score) // Преобразуем в число
				}
			}
			console.log('New score data:', newData) // Для отладки
			return newData
		})
		// Очищаем ошибку валидации при изменении оценки
		setValidationErrors(prev => {
			const newErrors = { ...prev }
			delete newErrors[key]
			return newErrors
		})
	}

	const handleSaveGrades = async (taskId, submissionId) => {
		try {
			// Проверяем валидность оценок перед сохранением
			if (!validateScores(taskId, submissionId)) {
				console.log('Ошибки валидации:', validationErrors)
				return // Прерываем выполнение функции если есть ошибки
			}

			setSaving(true)
			const user = JSON.parse(localStorage.getItem('user'))
			const rated_by = user?.id
			const now = new Date().toISOString()

			const taskCriteria = criteria[taskId] || []
			let hasErrors = false

			// Отправляем оценки последовательно
			for (const criterion of taskCriteria) {
				const key = `${taskId}-${submissionId}-${criterion.id}`
				const data = scoreData[key] || {}

				// Дополнительная проверка перед отправкой
				if (typeof data.score !== 'number' || isNaN(data.score) ||
					data.score < 0 || data.score > criterion.max_score ||
					!Number.isInteger(data.score)) {
					console.error(`Ошибка валидации для критерия ${criterion.id}:`, data)
					hasErrors = true
					break
				}

				try {
					await CriteriaApi.saveGrade({
						submission: submissionId,
						comment: data.comment || '',
						critety: criterion.id,
						score: data.score,
						date_grade: now,
						rated_by,
					})
					// Добавляем небольшую задержку между запросами
					await new Promise(resolve => setTimeout(resolve, 100))
				} catch (error) {
					console.error(`Ошибка при сохранении оценки для критерия ${criterion.id}:`, error)
					hasErrors = true
					break
				}
			}

			if (!hasErrors) {
				console.log('Оценки успешно сохранены')
			} else {
				setError(new Error('Ошибка при сохранении оценок'))
			}
		} catch (error) {
			console.error('Ошибка при сохранении оценок:', error)
			setError(error)
		} finally {
			setSaving(false)
		}
	}

	const fetchReview = async () => {
		console.log('fetching review inter')
		try {
			const data = await ReviewApi.getReview()
			console.log('data', data)

			// Проверяем, является ли ответ объектом с ошибкой
			if (data && data.detail) {
				throw new Error(data.detail)
			}

			setReviews(data)

			// Получаем уникальные taskId и загружаем критерии для каждого
			const uniqueTaskIds = [...new Set(data.map(review => review.task.id))]
			const criteriaPromises = uniqueTaskIds.map(taskId =>
				CriteriaApi.getCriteria(taskId)
					.then(criteriaData => ({ taskId, criteria: criteriaData.criteries || [] }))
			)

			const criteriaResults = await Promise.all(criteriaPromises)
			const criteriaMap = criteriaResults.reduce((acc, { taskId, criteria }) => {
				acc[taskId] = criteria
				return acc
			}, {})

			setCriteria(criteriaMap)
			setLoading(false)
		} catch (error) {
			console.log('Ошибка при загрузке данных:', error)
			setError(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		console.log('fetching review')
		fetchReview()
	}, [])

	if (loading) {
		return (
			<div className='review-page container'>
				<div className='loading-message'>Загрузка данных...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='review-page container'>
				<div className='error-message'>
					<h3>Ошибка при загрузке данных</h3>
					<p>{error.message}</p>
					{error.message === 'Пожалуйста, заполните профиль.' && (
						<p className='error-hint'>
							Для доступа к этой странице необходимо заполнить профиль пользователя.
						</p>
					)}
				</div>
			</div>
		)
	}

	if (!reviews || reviews.length === 0) {
		return (
			<div className='review-page container'>
				<div className='error-message'>Нет доступных данных для проверки</div>
			</div>
		)
	}

	// Группируем ревью по task.id
	const groupedReviews = reviews.reduce((acc, review) => {
		const taskId = review.task.id
		if (!acc[taskId]) {
			acc[taskId] = {
				task: review.task,
				reviews: []
			}
		}
		acc[taskId].reviews.push(review)
		return acc
	}, {})

	return (
		<div className='review-page container'>
			<h1>Review</h1>
			{Object.values(groupedReviews).map(({ task, reviews }) => (
				<div key={task.id} className='review-container'>
					<div className='task-header card-back'>
						<h2>{task.title}</h2>
						<p>{task.description}</p>
					</div>

					<div className='criteria-section card-back'>
						<h3>Критерии оценки:</h3>
						<div className="criteria-block">
							{criteria[task.id]?.map(criterion => (
								<div key={criterion.id} className='criterion-item card-back'>
									<p className='criterion-title'>{criterion.title}</p>
									<p className='criterion-description'>{criterion.description}</p>
									<p className='criterion-max-score'>Максимальный балл: {criterion.max_score}</p>
								</div>
							))}

						</div>
					</div>

					<div className='submissions-section'>
						<h3>Работы для проверки:</h3>
						{reviews.map(review => (
							<div key={review.id} className='review-item card-back'>
								<div className='review-item-name'>
									<h4>{review.submission.student.username}</h4>
									<p>{review.submission.student.email}</p>
								</div>
								<div className='review-item-criterias'>
									{criteria[task.id]?.map(criterion => {
										const key = `${task.id}-${review.submission.id}-${criterion.id}`
										const currentData = scoreData[key] || { score: 0, comment: '' }
										return (
											<div key={criterion.id} className='criterion-item card-back'>
												<p className='criterion-title'>{criterion.title}</p>
												<ScoreInput
													maxScore={criterion.max_score}
													onChange={data => handleScoreChange(task.id, review.submission.id, criterion.id, data)}
													initialValue={currentData.score}
													initialComment={currentData.comment}
												/>
												{validationErrors[key] && (
													<p className='validation-error'>
														{validationErrors[key]}
													</p>
												)}
											</div>
										)
									})}
								</div>
								<div className='review-actions'>
									<button
										className='hover-right-to-left'
										onClick={() => handleSaveGrades(task.id, review.submission.id)}
										disabled={saving}
									>
										{saving ? 'Сохранение...' : 'Сохранить оценки'}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export default ReviewPage
