import { useEffect, useState } from 'react'
import UserApi from '../../entities/users/api/UserApi'
import './GradesList.css'

function GradesList({ grades }) {
    const [reviewers, setReviewers] = useState({})

    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                const reviewersData = await UserApi.getUsers()
                const reviewersMap = reviewersData.reduce((acc, user) => {
                    acc[user.id] = user
                    return acc
                }, {})
                setReviewers(reviewersMap)
            } catch (error) {
                console.error('Ошибка при загрузке данных о проверяющих:', error)
            }
        }

        fetchReviewers()
    }, [])

    if (!grades || grades.length === 0) {
        return <div className="grades-list-empty">Нет оценок</div>
    }

    // Группируем оценки по submission
    const groupedBySubmission = grades.reduce((acc, grade) => {
        if (!acc[grade.submission]) {
            acc[grade.submission] = {
                task_title: grade.task_title,
                task_description: grade.task_description,
                criteria: {},
                reviewers: new Set(),
                totalScore: 0,
                maxTotalScore: 0
            }
        }

        // Группируем по критериям
        if (!acc[grade.submission].criteria[grade.critety]) {
            acc[grade.submission].criteria[grade.critety] = {
                name: grade.critery_name,
                max_score: grade.max_score,
                grades: [],
                averageScore: 0
            }
            acc[grade.submission].maxTotalScore += grade.max_score
        }

        acc[grade.submission].criteria[grade.critety].grades.push({
            score: grade.score,
            comment: grade.comment,
            date: grade.date_grade,
            reviewer: grade.rated_by_username
        })

        // Обновляем среднюю оценку по критерию
        const criteria = acc[grade.submission].criteria[grade.critety]
        const totalScore = criteria.grades.reduce((sum, g) => sum + g.score, 0)
        criteria.averageScore = totalScore / criteria.grades.length

        // Обновляем общую сумму баллов
        acc[grade.submission].totalScore = Object.values(acc[grade.submission].criteria)
            .reduce((sum, c) => sum + c.averageScore, 0)

        acc[grade.submission].reviewers.add(grade.rated_by_username)

        return acc
    }, {})

    return (
        <div className="grades-list">
            {Object.entries(groupedBySubmission).map(([submissionId, data]) => (
                <div key={submissionId} className="submission-grades">
                    <h3>{data.task_title}</h3>
                    {data.task_description && (
                        <p className="task-description">{data.task_description}</p>
                    )}
                    <div className="total-scores">
                        <p className="total-score">
                            Общая оценка: {data.totalScore.toFixed(2)} / {data.maxTotalScore}
                        </p>
                    </div>
                    <div className="criteria-grades">
                        {Object.entries(data.criteria).map(([criteriaId, criteriaData]) => (
                            <div key={criteriaId} className="criteria-item">
                                <div className="criteria-header">
                                    <h4>{criteriaData.name}</h4>
                                    <div className="criteria-scores">
                                        <p className="max-score">Макс. балл: {criteriaData.max_score}</p>
                                        <p className="average-score">
                                            Средняя оценка: {criteriaData.averageScore.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="grades-grid">
                                    {criteriaData.grades.map((grade, index) => (
                                        <div key={index} className="grade-item">
                                            <div className="grade-header">
                                                <span className="grade-score">Оценка: {grade.score}</span>
                                                <span className="grade-date">
                                                    {new Date(grade.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {grade.comment && (
                                                <div className="grade-comment">{grade.comment}</div>
                                            )}
                                            <div className="grade-reviewer">
                                                Проверяющий: {grade.reviewer}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GradesList 