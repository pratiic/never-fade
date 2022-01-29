export const updateContent = (id, updateInfo, type, callback) => {
    return async (dispatch, getState) => {
        // dispatch({ type: "MEMORY_UPDATE_REQUEST" });
        const link = `/api/${
            type === "memory" ? "memories" : "memory-spaces"
        }/edit/${id}/`;

        try {
            const response = await fetch(link, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${
                        getState().currentUser.userInfo.token
                    }`,
                },
                body: JSON.stringify(updateInfo),
            });
            const data = await response.json();

            if (data.memory) {
                dispatch({
                    type: "MEMORY_UPDATE_SUCCESS",
                    payload: data.memory,
                });
                dispatch({ type: "UNSELECT_ALL_USERS" });

                if (callback) {
                    callback();
                }
                return;
            }

            console.log(data);
            dispatch({
                type: "MEMORY_UPDATE_FAILURE",
                payload: getErrors(data),
            });
        } catch (error) {
            console.log(error);
        }
    };
};
