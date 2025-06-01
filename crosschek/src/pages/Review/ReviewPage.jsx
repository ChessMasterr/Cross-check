import { useEffect, useState } from 'react'
import ReviewApi from '../../entities/users/api/RewiewApi'
import CriteriaApi from '../../entities/criteria/api/criteriaApi'
import UserApi from '../../entities/users/api/UserApi'
import ScoreInput from '../../components/ScoreInput/ScoreInput'
import './ReviewPage.css'

function ReviewPage() {
	const [review, setReview] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [criteria, setCriteria] = useState([])
	const [scores, setScores] = useState({})
	const [saving, setSaving] = useState(false)
	const [scoreData, setScoreData] = useState({})

	const handleScoreChange = (criterionId, data) => {
		setScoreData(prev => ({
			...prev,
			[criterionId]: data,
		}))
	}

	const handleSaveGrades = async (reviewItem) => {
		try {
			setSaving(true)
			const user = JSON.parse(localStorage.getItem('user'))
			const rated_by = user?.id
			const now = new Date().toISOString()
			const submission = reviewItem.submission.id

			const promises = criteria.map(criterion => {
				const data = scoreData[criterion.id] || {}
				return CriteriaApi.saveGrade({
					submission,
					comment: data.comment || '',
					critety: criterion.id,
					score: data.score || 0,
					date_grade: now,
					rated_by,
				})
			})
			await Promise.all(promises)
			console.log('Оценки успешно сохранены')
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
											onChange={data => handleScoreChange(criterion.id, data)}
											initialValue={scoreData[criterion.id]?.score || 0}
											initialComment={scoreData[criterion.id]?.comment || ''}
										/>
									</div>
								))
							) : (
								<p>Загрузка критериев...</p>
							)}
							<div className='review-actions'>
								<button
									className='save-button'
									onClick={() => handleSaveGrades(item)}
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
