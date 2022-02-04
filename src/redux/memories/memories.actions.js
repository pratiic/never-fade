import { getErrors } from "../../utils/utils.errors";

import { closeModal, showLoadingModal } from "../modal/modal.actions";

export const getMemories = () => {
    return async (dispatch, getState) => {
        dispatch({ type: "MEMORIES_REQUEST" });

        try {
            const response = await fetch(
                `/api/memories/?page=${getState().memories.page}`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            getState().currentUser.userInfo.token
                        }`,
                    },
                }
            );
            const data = await response.json();

            if (data.memories) {
                dispatch({
                    type: "MEMORIES_SUCCESS",
                    payload: {
                        memories: data.memories,
                        hasNext: data.has_next,
                        hasPrev: data.has_prev,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export const addMemory = (memory) => {
    return {
        type: "ADD_MEMORY",
        payload: memory,
    };
};

export const updateMemory = (id, updateInfo, callback) => {
    return async (dispatch, getState) => {
        if (updateInfo.date) {
            const memoryDate = new Date(updateInfo.date);

            if (String(memoryDate) === "Invalid Date") {
                return dispatch({
                    type: "MEMORY_UPDATE_FAILURE",
                    payload: ["the date is invalid"],
                });
            }
        }

        dispatch({ type: "MEMORY_UPDATE_REQUEST" });
        dispatch(showLoadingModal("editing memory"));

        try {
            const response = await fetch(`/api/memories/edit/${id}/`, {
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
                if (data.memory.shared) {
                    dispatch({
                        type: "UPDATE_SHARED_MEMORY",
                        payload: data.memory,
                    });
                }

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

            dispatch({
                type: "MEMORY_UPDATE_FAILURE",
                payload: getErrors(data),
            });
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(closeModal());
        }
    };
};

export const setMemoryToUpdate = (memory) => {
    return {
        type: "SET_MEMORY_TO_UPDATE",
        payload: memory,
    };
};

export const setNeedToFetch = (needToFetch) => {
    return {
        type: "SET_NEED_TO_FETCH_MEMORIES",
        payload: needToFetch,
    };
};

export const removeMemory = (id) => {
    return {
        type: "REMOVE_MEMORY",
        payload: id,
    };
};

export const incrementPage = () => {
    return {
        type: "INCREMENT_MEMORIES_PAGE",
    };
};

export const controlPage = (increase = true) => {
    return {
        type: "CONTROL_MEMORY_PAGE",
        payload: increase,
    };
};

export const setPage = (page, needToFetch = false) => {
    return {
        type: "SET_MEMORY_PAGE",
        payload: { page, needToFetch },
    };
};

export const resetMemories = () => {
    return {
        type: "RESET_MEMORIES",
    };
};
