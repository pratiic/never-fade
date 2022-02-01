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

export const updateSharedMemory = (updateInfo) => {
    return {
        type: "UPDATE_SHARED_MEMORY",
        payload: updateInfo,
    };
};

export const addSharedMemory = (memory) => {
    return {
        type: "ADD_SHARED_MEMORY",
        payload: memory,
    };
};

export const removeSharedMemory = (id) => {
    return {
        type: "REMOVE_SHARED_MEMORY",
        payload: id,
    };
};

export const setNeedToFetch = (needToFetch) => {
    return {
        type: "SET_NEED_TO_FETCH_SHARED_MEMORIES",
        payload: needToFetch,
    };
};

export const resetSharedMemories = () => {
    return {
        type: "RESET_SHARED_MEMORIES",
    };
};
