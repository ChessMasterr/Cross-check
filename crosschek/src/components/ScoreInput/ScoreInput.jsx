import { useState } from 'react'
import './ScoreInput.css'

function ScoreInput({ maxScore, onChange, initialValue = 0 }) {
	const [value, setValue] = useState(initialValue)
	const [error, setError] = useState('')

	const handleChange = e => {
		const newValue = e.target.value
		setValue(newValue)

		// Валидация
		if (newValue === '') {
			setError('Поле не может быть пустым')
			return
		}

		const numValue = Number(newValue)
		if (isNaN(numValue)) {
			setError('Введите число')
			return
		}

		if (numValue < 0) {
			setError('Оценка не может быть отрицательной')
			return
		}

		if (numValue > maxScore) {
			setError(`Максимальная оценка: ${maxScore}`)
			return
		}

		setError('')
		onChange?.(numValue)
	}

	return (
		<div className='score-input-container'>
			<input
				type='number'
				value={value}
				onChange={handleChange}
				min={0}
				max={maxScore}
				className={`score-input ${error ? 'error' : ''}`}
				title={`Введите оценку от 0 до ${maxScore}`}
			/>
			{error && <div className='score-input-error'>{error}</div>}
			<div className='score-input-hint'>Максимальная оценка: {maxScore}</div>
		</div>
	)
}

export default ScoreInput
