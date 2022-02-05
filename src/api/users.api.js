export const getUserDetails = async (token) => {
    try {
        const response = await fetch(`/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();

        return data;
    } catch (error) {}
};
