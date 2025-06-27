export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token
        ? { Authorization: `Bearer ${user.token}` }
        : {};
}