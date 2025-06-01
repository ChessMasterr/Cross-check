import { useEffect, useState } from 'react'
import CriteriaApi from '../../entities/criteria/api/criteriaApi'
import GradesList from '../../components/GradesList/GradesList'
import './HomePage.css'

function HomePage() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await CriteriaApi.getGrades()
        setGrades(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [])

  if (loading) {
    return <div className="home-page-loading">Загрузка оценок...</div>
  }

  if (error) {
    return <div className="home-page-error">Ошибка: {error}</div>
  }

  return (
    <div className="home-page container">
      <h1>Мои оценки</h1>
      <GradesList grades={grades} />
    </div>
  )
}

export default HomePage 