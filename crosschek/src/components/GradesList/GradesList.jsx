import './GradesList.css'

function GradesList({ grades }) {
    if (!grades || grades.length === 0) {
        return <div className="grades-list-empty">Нет оценок</div>
    }

    // Группируем оценки по submission
    const groupedBySubmission = grades.reduce((acc, grade) => {
        if (!acc[grade.submission]) {
            acc[grade.submission] = {
                criteria: {},
                reviewers: new Set()
            }
        }

        // Группируем по критериям
        if (!acc[grade.submission].criteria[grade.critety]) {
            acc[grade.submission].criteria[grade.critety] = []
        }

        acc[grade.submission].criteria[grade.critety].push({
            score: grade.score,
            comment: grade.comment,
            date: grade.date_grade,
            reviewer: grade.rated_by
        })

        acc[grade.submission].reviewers.add(grade.rated_by)

        return acc
    }, {})

    return (
        <div className="grades-list">
            {Object.entries(groupedBySubmission).map(([submissionId, data]) => (
                <div key={submissionId} className="submission-grades">
                    <h3>Работа #{submissionId}</h3>
                    <div className="criteria-grades">
                        {Object.entries(data.criteria).map(([criteriaId, grades]) => (
                            <div key={criteriaId} className="criteria-item">
                                <h4>Критерий #{criteriaId}</h4>
                                <div className="grades-grid">
                                    {grades.map((grade, index) => (
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
                                                Проверяющий: #{grade.reviewer}
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