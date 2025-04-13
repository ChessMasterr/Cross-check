import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/layouts/Header/Header'
import Loader from '../../components/ui/Loader/Loader'
function Layout() {
	return (
		<>
			<Header />
			<main>
				<Suspense fallback={<Loader />}>
					<Outlet />
				</Suspense>
			</main>
		</>
	)
}

export default Layout
