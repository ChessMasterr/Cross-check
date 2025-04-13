import { createBrowserRouter } from "react-router-dom"
import Layout from "../Layout/Layout"
import { lazy } from "react"
// import HomePage from "../../pages/Home/HomePage"
// import ReviewPage from "../../pages/Review/ReviewPage"
// import AccountPage from "../../pages/Account/AccountPage" 

const HomePage = lazy(() => import('../../pages/Home/HomePage'))
const ReviewPage = lazy(() => import('../../pages/Review/ReviewPage'))
const AccountPage = lazy(() => import('../../pages/Account/AccountPage'))

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout   />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/review",
                element: <ReviewPage />
            },
            {
                path: "/account",
                element: <AccountPage />
            },
        ]
    }
])

export default router
