// components/shared/AuthForm/AuthForm.jsx
import React, { useState, useContext } from 'react'
import UserApi from '../../../entities/users/api/UserApi'
import UserContext from '../../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { setTokenStorage, setUserStorage } from '../../../utils/auth.utils'

function AuthForm() {
	const { dispatchUser, userState } = useContext(UserContext)
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = async e => {
		e.preventDefault()
		dispatchUser({ type: 'AUTH_START' })

		try {
			const data = await UserApi.auth(username, password)
			setTokenStorage(data.access, data.refresh)
			setUserStorage(data.user)
			dispatchUser({
				type: 'SET_USER',
				payload: {
					user: data.user,
				},
			})
			navigate('/')
		} catch (error) {
			dispatchUser({
				type: 'AUTH_FAILURE',
				payload: error.message || 'Ошибка авторизации',
			})
		}
	}

	return (
		<div className='auth-form'>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='username'
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<button type='submit'>Login</button>
				{userState.error && <p className='error'>{userState.error}</p>}
				{userState.loading && <p className='loading'>Loading...</p>}
			</form>
		</div>
	)
}

export default AuthForm
