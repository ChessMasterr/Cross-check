import { useEffect, useState } from 'react'
import ReviewApi from '../../entities/users/api/RewiewApi'
import CriteriaApi from '../../entities/criteria/api/criteriaApi'
import ScoreInput from '../../components/ScoreInput/ScoreInput'
import './ReviewPage.css'

function ReviewPage() {
	const [review, setReview] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [criteria, setCriteria] = useState([])
	const [scores, setScores] = useState({})
	const [saving, setSaving] = useState(false)

	const handleScoreChange = (criterionId, score) => {
		setScores(prev => ({
			...prev,
			[criterionId]: score,
		}))
	}

	const handleSaveScores = async reviewId => {
		try {
			setSaving(true)
			// Преобразуем объект scores в массив для API
			const scoresArray = Object.entries(scores).map(
				([criterionId, score]) => ({
					criterion: criterionId,
					score: score,
				})
			)

			await CriteriaApi.saveScores(reviewId, scoresArray)
			console.log('Оценки успешно сохранены')
			// Можно добавить уведомление об успешном сохранении
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
			setReview(data)
			setLoading(false)
		} catch (error) {
			setError(error)
			setLoading(false)
		}
	}

	const getCriteria = async taskId => {
		try {
			const criteriaData = await CriteriaApi.getCriteria(taskId)
			console.log(`Критерии для задания ${taskId}:`, criteriaData.criteries)
			setCriteria(criteriaData.criteries || [])
		} catch (error) {
			console.error('Ошибка при получении критериев:', error)
			setError(error)
		}
	}

	useEffect(() => {
		console.log('fetching review')
		fetchReview()
	}, [])

	useEffect(() => {
		if (review && review.length > 0) {
			// Получаем уникальные taskId из всех review
			const uniqueTaskIds = [
				...new Set(review.map(item => item.submission.task)),
			]
			// Загружаем критерии для каждого уникального задания
			uniqueTaskIds.forEach(taskId => {
				getCriteria(taskId)
			})
		}
	}, [review])

	return (
		<div className='review-page container'>
			<h1>Review</h1>
			{review && review.length > 0 ? (
				review.map(item => (
					<div key={item.id} className='review-item'>
						<div className='review-item-name'>
							<h2>{item?.submission?.student?.username}</h2>
							<p>{item?.submission?.student?.email}</p>
						</div>
						<div className='review-item-criterias'>
							{criteria && criteria.length > 0 ? (
								criteria.map(criterion => (
									<div key={criterion.id} className='criterion-item'>
										<p className='criterion-title'>{criterion.title}</p>
										<p className='criterion-description'>
											{criterion.description}
										</p>
										<ScoreInput
											maxScore={criterion.max_score}
											onChange={score => handleScoreChange(criterion.id, score)}
											initialValue={scores[criterion.id] || 0}
										/>
									</div>
								))
							) : (
								<p>Загрузка критериев...</p>
							)}
							<div className='review-actions'>
								<button
									className='save-button'
									onClick={() => handleSaveScores(item.id)}
									disabled={saving}
								>
									{saving ? 'Сохранение...' : 'Сохранить оценки'}
								</button>
							</div>
						</div>
					</div>
				))
			) : (
				<p>No reviews available.</p>
			)}
			{error && <div className='error-message'>Error: {error.message}</div>}
		</div>
	)
}

export default ReviewPage
