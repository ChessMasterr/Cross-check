// components/shared/RegForm/RegForm.jsx
import React, { useState, useContext } from 'react'
import UserApi from '../../../entities/users/api/UserApi'
import UserContext from '../../../context/UserContext'
import { useNavigate } from 'react-router-dom'

function RegForm() {
	const { dispatchUser, userState } = useContext(UserContext)
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async e => {
		e.preventDefault()
		dispatchUser({ type: 'REGISTER_START' })

		try {
			await UserApi.register(username, email, password)
			dispatchUser({ type: 'REGISTER_SUCCESS' })
			navigate('/log') // Перенаправляем на страницу входа после успешной регистрации
		} catch (error) {
			dispatchUser({
				type: 'REGISTER_FAILURE',
				payload: error.message || 'Ошибка регистрации',
			})
		}
	}

	return (
		<div className='reg-form'>
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Name'
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
				<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<button type='submit'>Register</button>
				{userState.error && <p className='error'>{userState.error}</p>}
				{userState.loading && <p className='loading'>Loading...</p>}
			</form>
		</div>
	)
}

export default RegForm
