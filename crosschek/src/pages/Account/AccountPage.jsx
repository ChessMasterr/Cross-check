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
		gitlab_account: '',
		surname: "",
		first_name: "",
		last_name: "",
	})

	const [errors, setErrors] = useState({
		email: '',
		phone_number: '',
		telegram_account: '',
		password: '',
		gitlab_account: '',
		surname: "",
		first_name: "",
		last_name: "",
	})


	const getUser = async (id = 1) => {
		try {
			const userData = await UserApi.getUserById(id)
			setUser(userData)
			setFormData({
				email: userData.email || '',
				phone_number: userData.phone_number || '',
				telegram_account: userData.telegram_account || '',
				gitlab_account: userData.gitlab_account || '',
				surname: userData.surname || '',
				username: userData.username || '',
				first_name: userData.first_name || '',
				last_name: userData.last_name || '',
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
			gitlab_account: '',
			surname: "",
			first_name: "",
		})
	}

	const handleClose = () => {
		setIsModalOpen(false)
		setFormData({
			email: user.email || '',
			phone_number: user.phone_number || '',
			telegram_account: user.telegram_account || '',
			gitlab_account: user.gitlab_account || '',
			surname: user.surname || '',
			first_name: user.first_name || '',
			password: '',
		})
		setErrors({
			email: '',
			phone_number: '',
			telegram_account: '',
			password: '',
			gitlab_account: '',
			surname: "",
			first_name: "",
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
					gitlab_account: errorData.gitlab_account?.[0] || '',
					surname: errorData.surname?.[0] || '',
					first_name: errorData.first_name?.[0] || '',
					last_name: errorData.last_name?.[0] || '',
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
		console.log(user);

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
				<p>
					<strong>Git:</strong> {user.gitlab_account}
				</p>
				<p>
					<strong>Last Name:</strong> {user.last_name}
				</p>
				<p>
					<strong>First Name:</strong> {user.first_name}
				</p>
				<p>
					<strong>Surname:</strong> {user.surname}
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
						<label>Git:</label>
						<input
							type='text'
							name='gitlab_account'
							value={formData.gitlab_account}
							onChange={handleChange}
							placeholder='git'
							className={errors.gitlab_account ? 'input-error' : ''}
						/>
						{errors.gitlab_account && (
							<span className='error-message'>{errors.gitlab_account}</span>
						)}
					</div>
					<div className='form-group'>
						<label>Surname:</label>
						<input
							type='text'
							name='surname'
							value={formData.surname}
							onChange={handleChange}
							placeholder='Surname'
							className={errors.surname ? 'input-error' : ''}
						/>
						{errors.surname && (
							<span className='error-message'>{errors.surname}</span>
						)}
					</div>
					<div className='form-group'>
						<label>First Name:</label>
						<input
							type='text'
							name='first_name'
							value={formData.first_name}
							onChange={handleChange}
							placeholder='First Name'
							className={errors.first_name ? 'input-error' : ''}
						/>
						{errors.first_name && (
							<span className='error-message'>{errors.first_name}</span>
						)}
					</div>
					<div className='form-group'>
						<label>Last Name:</label>
						<input
							type='text'
							name='last_name'
							value={formData.last_name}
							onChange={handleChange}
							placeholder='Last Name'
							className={errors.last_name ? 'input-error' : ''}
						/>
						{errors.last_name && (
							<span className='error-message'>{errors.last_name}</span>
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
