import { createBrowserRouter } from "react-router-dom"
import Layout from "../Layout/Layout"
import { lazy } from "react"

const HomePage = lazy(() => import('../../pages/Home/HomePage'))
const ReviewPage = lazy(() => import('../../pages/Review/ReviewPage'))
const AccountPage = lazy(() => import('../../pages/Account/AccountPage'))
const AuthPage = lazy(() => import('../../pages/AuthPge/AuthPage'))
const RegPage = lazy(() => import('../../pages/RegPage/RegPage'))


const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <HomePage />,
			},
			{
				path: '/review',
				element: <ReviewPage />,
			},
			{
				path: '/account',
				element: <AccountPage />,
			},
			{
				path: '/log',
				element: <AuthPage />,
			},
			{
				path: '/reg',
				element: <RegPage />,
			},
		],
	},
])

export default router
