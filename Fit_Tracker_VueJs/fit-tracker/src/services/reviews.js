import axios from './axios';

const ReviewService = {

    getAll(page = 0, size = 10) {
        return axios
            .get('/reviews', { params: { page, size } })
            .then(res => res.data);
    },

    getForWorkout(workoutId, { page = 0, size = 10 } = {}) {
        return axios.get(`/reviews/workout/${workoutId}`, { params: { page, size } })
            .then(res => res.data);
    },

    getForUser(userId, { page = 0, size = 10 } = {}) {
        return axios.get(`/reviews/user/${userId}`, { params: { page, size } })
            .then(res => res.data);
    },

    create(reviewPayload) {
        return axios.post('/reviews', reviewPayload)
            .then(res => res.data);
    },

    delete(reviewId, userId) {
        return axios.delete(`/reviews/${reviewId}`, {
            params: { userId }
        });
    }
};

export default ReviewService;
