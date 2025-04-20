import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './Menu.css'
import UserContext from '../../../context/UserContext'
import { clearTokenUserStorage } from '../../../utils/auth.utils'
function Menu() {
	const { dispatchUser } = useContext(UserContext)

	const handleLogout = () => {
		dispatchUser({ type: 'CLEAR_USER' })
		clearTokenUserStorage()
	}
	return (
		<nav>
			<ul>
				<li>
					<Link to='/'>Home</Link>
				</li>
				<li>
					<Link to='/review'>Review</Link>
				</li>
				<li>
					<Link to='/account'>Account</Link>
				</li>
				<li>
					<Link to='/log'>Authorization</Link>
				</li>
				<li>
					<Link to='/reg'>Registration</Link>
				</li>
				<li>
					<Link to='#' onClick={handleLogout}>
						Logout
					</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Menu
