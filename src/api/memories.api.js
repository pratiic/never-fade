export const shareMemory = async (id, users, replace, token) => {
    try {
        const response = await fetch(
            `/api/memories/share/${id}/?replace=${replace}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    shared_with: users.map((user) => {
                        return user.id;
                    }),
                }),
            }
        );
        const data = await response.json();

        return data;
    } catch (error) {}
};
