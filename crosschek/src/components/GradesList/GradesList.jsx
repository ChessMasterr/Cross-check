import './GradesList.css'

function GradesList({ grades }) {
    if (!grades || grades.length === 0) {
        return <div className="grades-list-empty">Нет оценок</div>
    }

    return (
        <div className="grades-list">
            {grades.map((grade, index) => (
                <div key={index} className="grade-item">
                    <div className="grade-header">
                        <span className="grade-score">Оценка: {grade.score}</span>
                        <span className="grade-date">
                            {new Date(grade.date_grade).toLocaleDateString()}
                        </span>
                    </div>
                    {grade.comment && (
                        <div className="grade-comment">{grade.comment}</div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default GradesList 