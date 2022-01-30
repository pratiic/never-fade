export const addMembers = async (id, users, replace, token) => {
    try {
        const response = await fetch(
            `/api/memory-spaces/add-members/${id}/?replace=${replace}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    members: users.map((user) => user.id),
                }),
            }
        );
        const data = await response.json();

        return data;
    } catch (error) {}
};
