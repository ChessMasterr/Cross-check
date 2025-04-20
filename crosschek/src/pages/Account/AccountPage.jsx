import React, { useEffect, useState } from 'react'
import UserApi from '../../entities/users/api/UserApi'
import Modal from '../../components/shared/Modal/Modal'
import './AccountPage.css'

function AccountPage() {
	const [user, setUser] = useState({})
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		phone_number: '',
		telegram_account: '',
		password: '',
	})
	const [errors, setErrors] = useState({
		email: '',
		phone_number: '',
		telegram_account: '',
		password: '',
	})

	const getUser = async (id = 1) => {
		try {
			const userData = await UserApi.getUserById(id)
			setUser(userData)
			setFormData({
				email: userData.email || '',
				phone_number: userData.phone_number || '',
				telegram_account: userData.telegram_account || '',
				password: '',
			})
		} catch (error) {
			console.error('Error fetching user data:', error)
		}
	}

	const handleEdit = () => {
		setIsModalOpen(true)
		setErrors({
			email: '',
			phone_number: '',
			telegram_account: '',
			password: '',
		})
	}

	const handleClose = () => {
		setIsModalOpen(false)
		setFormData({
			email: user.email || '',
			phone_number: user.phone_number || '',
			telegram_account: user.telegram_account || '',
			password: '',
		})
		setErrors({
			email: '',
			phone_number: '',
			telegram_account: '',
			password: '',
		})
	}

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
		setErrors(prev => ({
			...prev,
			[name]: '',
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			await UserApi.updateUser(user.id, formData)
			await getUser(user.id)
			setIsModalOpen(false)
		} catch (error) {
			console.error('Error updating user data:', error)
			try {
				const errorData = JSON.parse(error.message)
				const newErrors = {
					email: errorData.email?.[0] || '',
					phone_number: errorData.phone_number?.[0] || '',
					telegram_account: errorData.telegram_account?.[0] || '',
					password: errorData.password?.[0] || '',
				}
				setErrors(newErrors)
			} catch (parseError) {
				setErrors({
					email: error.message,
					phone_number: '',
					telegram_account: '',
					password: '',
				})
			}
		}
	}

	useEffect(() => {
		getUser()
	}, [])

	return (
		<div className='account-page'>
			<h1>Account</h1>
			<div className='account-info'>
				<p>
					<strong>Username:</strong> {user.username}
				</p>
				<p>
					<strong>Email:</strong> {user.email}
				</p>
				<p>
					<strong>Phone:</strong> {user.phone_number}
				</p>
				<p>
					<strong>Telegram:</strong> {user.telegram_account}
				</p>
				<button onClick={handleEdit} className='edit-button'>
					Edit Profile
				</button>
			</div>

			<Modal isOpen={isModalOpen} onClose={handleClose}>
				<h2>Edit Profile</h2>
				<form onSubmit={handleSubmit} className='edit-form'>
					<div className='form-group'>
						<label>Email:</label>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							required
							className={errors.email ? 'input-error' : ''}
						/>
						{errors.email && (
							<span className='error-message'>{errors.email}</span>
						)}
					</div>
					<div className='form-group'>
						<label>Phone Number:</label>
						<input
							type='text'
							name='phone_number'
							value={formData.phone_number}
							onChange={handleChange}
							className={errors.phone_number ? 'input-error' : ''}
						/>
						{errors.phone_number && (
							<span className='error-message'>{errors.phone_number}</span>
						)}
					</div>
					<div className='form-group'>
						<label>Telegram Account:</label>
						<input
							type='text'
							name='telegram_account'
							value={formData.telegram_account}
							onChange={handleChange}
							className={errors.telegram_account ? 'input-error' : ''}
						/>
						{errors.telegram_account && (
							<span className='error-message'>{errors.telegram_account}</span>
						)}
					</div>
					<div className='form-group'>
						<label>Password:</label>
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							placeholder='Enter new password (optional)'
							className={errors.password ? 'input-error' : ''}
						/>
						{errors.password && (
							<span className='error-message'>{errors.password}</span>
						)}
					</div>
					<div className='form-actions'>
						<button type='submit' className='save-button'>
							Save Changes
						</button>
						<button
							type='button'
							onClick={handleClose}
							className='cancel-button'
						>
							Cancel
						</button>
					</div>
				</form>
			</Modal>
		</div>
	)
}

export default AccountPage
