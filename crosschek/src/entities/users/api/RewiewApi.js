import { getAccessToken } from "../../../utils/auth.utils";

class ReviewApi {
  static async getReview() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/assignments/reviews/`,{
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });
    const data = await response.json();
    return data;
  }
}

export default ReviewApi;
