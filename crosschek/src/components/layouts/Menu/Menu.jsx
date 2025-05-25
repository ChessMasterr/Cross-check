import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Menu.css'
import UserContext from '../../../context/UserContext'
import { clearTokenUserStorage } from '../../../utils/auth.utils'
function Menu() {
	const { dispatchUser, userState } = useContext(UserContext)
	const navigate = useNavigate()


	const handleLogout = () => {
		dispatchUser({ type: 'CLEAR_USER' })
		clearTokenUserStorage()
		navigate('/log')
	}
	return (
		<nav>
			<ul>
				<li>
					<Link to='/'>Home</Link>
				</li>
				{userState.user ? (
					<>

						<li>
							<Link to='/review'>Review</Link>
						</li>
						<li>
							<Link to='/account'>Account</Link>
						</li>
						<li>
							<Link to='#' onClick={handleLogout}>
								Logout
							</Link>
						</li>
					</>
				) : (
					<>
						<li>
							<Link to='/log'>Authorization</Link>
						</li>
						<li>
							<Link to='/reg'>Registration</Link>
						</li>
					</>
				)}


			</ul>
		</nav>
	)
}

export default Menu
