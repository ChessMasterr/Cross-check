import { useEffect, useState } from 'react'
import ReviewApi from '../../entities/users/api/RewiewApi';
import './ReviewPage.css';

function ReviewPage() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReview = async () => {
    console.log('fetching review inter');
    try {
      const data = await ReviewApi.getReview();
      console.log('data',data);
      
      setReview(data);
      setLoading(false);
    } catch (error) {

      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('fetching review');
    fetchReview();
  }, []);

  return (
    <div className='review-page container'>
      <h1>Review</h1>
      {review && review.length > 0 ? (
        review.map((item) => (
          <div key={item.id} className='review-item'>
            <div className='review-item-name'>
              <h2>{item?.submission?.student?.username}</h2>
              <p>{item?.submission?.student?.email}</p>
            </div>
            <div className='review-item-criterias'>
              <p>тут критерии</p>
            </div>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}

export default ReviewPage 