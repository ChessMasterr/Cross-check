import { useState, useEffect } from 'react'
import './ScoreInput.css'

function ScoreInput({ maxScore, onChange, initialValue = 0, initialComment = '' }) {
	const [value, setValue] = useState(initialValue)
	const [comment, setComment] = useState(initialComment)
	const [error, setError] = useState('')

	// Обновляем значения только при изменении initialValue или initialComment
	useEffect(() => {
		if (initialValue !== undefined) {
			setValue(initialValue)
		}
		if (initialComment !== undefined) {
			setComment(initialComment)
		}
	}, [initialValue, initialComment])

	const handleChange = e => {
		const newValue = e.target.value
		setValue(newValue)

		// Валидация для отображения ошибок
		if (newValue === '') {
			setError('Поле не может быть пустым')
			onChange?.({ score: undefined, comment })
			return
		}

		const numValue = Number(newValue)
		if (isNaN(numValue)) {
			setError('Введите число')
			onChange?.({ score: undefined, comment })
			return
		}

		if (numValue < 0) {
			setError('Оценка не может быть отрицательной')
			onChange?.({ score: undefined, comment })
			return
		}

		if (numValue > maxScore) {
			setError(`Максимальная оценка: ${maxScore}`)
			onChange?.({ score: undefined, comment })
			return
		}

		// Если значение валидно, обновляем состояние
		setError('')
		onChange?.({ score: numValue, comment })
	}

	const handleCommentChange = e => {
		const newComment = e.target.value
		setComment(newComment)
		onChange?.({ score: Number(value) || undefined, comment: newComment })
	}

	return (
		<div className='score-input-container'>
			<input
				type='number'
				value={value}
				onChange={handleChange}
				min={0}
				max={maxScore}
				className={`score-input  ${error ? 'error' : ''}`}
				title={`Введите оценку от 0 до ${maxScore}`}
			/>
			{error && <div className='score-input-error'>{error}</div>}
			<textarea
				placeholder='Комментарий к оценке (необязательно)'
				value={comment}
				onChange={handleCommentChange}
				className='score-input-comment'
				rows={2}
			/>
			<div className='score-input-hint'>Максимальная оценка: {maxScore}</div>
		</div>
	)
}

export default ScoreInput
