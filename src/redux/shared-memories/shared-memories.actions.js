export const getSharedMemories = (type) => {
    return async (dispatch, getState) => {
        dispatch({ type: "SHARED_MEMORIES_REQUEST" });

        try {
            const response = await fetch(`/api/memories/shared/?type=${type}`, {
                headers: {
                    Authorization: `Bearer ${
                        getState().currentUser.userInfo.token
                    }`,
                },
            });
            const data = await response.json();

            if (data.memories) {
                dispatch({
                    type: "SHARED_MEMORIES_SUCCESS",
                    payload: data.memories,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export const setSharedMemoriesType = (type) => {
    return {
        type: "SET_SHARED_MEMORIES_TYPE",
        payload: type,
    };
};
