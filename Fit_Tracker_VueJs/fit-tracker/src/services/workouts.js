import axios from './axios';

const WorkoutService = {
    search({ keyword = '', page = 0, size = 10 } = {}) {
        return axios.get('/workouts', { params: { keyword, page, size } })
            .then(res => res.data);
    },

    getById(workoutId) {
        return axios.get(`/workouts/${workoutId}`)
            .then(res => res.data);
    },

    getByCoach(coachId, { page = 0, size = 10 } = {}) {
        return axios.get(`/workouts/by-coach/${coachId}`, { params: { page, size } })
            .then(res => res.data);
    },

    create(workoutPayload) {
        return axios.post('/workouts', workoutPayload)
            .then(res => res.data);
    },

    update(workoutId, workoutPayload) {
        return axios.put(`/workouts/${workoutId}`, workoutPayload)
            .then(res => res.data);
    },

    delete(workoutId) {
        return axios.delete(`/workouts/${workoutId}`);
    }
};

export default WorkoutService;
