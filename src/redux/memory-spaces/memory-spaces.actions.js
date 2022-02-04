import { getErrors } from "../../utils/utils.errors";

import { closeModal, showLoadingModal } from "../modal/modal.actions";

export const getMemorySpaces = () => {
    return async (dispatch, getState) => {
        dispatch({ type: "MEMORY_SPACES_REQUEST" });

        try {
            const response = await fetch(
                `/api/memory-spaces/?page=${getState().memorySpaces.page}`,
                {
                    headers: {
                        Authorization: `Bearer ${
                            getState().currentUser.userInfo.token
                        }`,
                    },
                }
            );
            const data = await response.json();
            dispatch({
                type: "MEMORY_SPACES_SUCCESS",
                payload: {
                    memorySpaces: data.memory_spaces,
                    hasNext: data.has_next,
                    hasPrev: data.has_prev,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };
};

export const updateMemorySpace = (id, updateInfo, callback) => {
    return async (dispatch, getState) => {
        dispatch({ type: "MEMORY_SPACE_UPDATE_REQUEST" });
        dispatch(showLoadingModal("editing memory space"));

        try {
            const response = await fetch(`/api/memory-spaces/edit/${id}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${
                        getState().currentUser.userInfo.token
                    }`,
                },
                body: updateInfo,
            });
            const data = await response.json();

            if (data.memory_space) {
                dispatch({
                    type: "MEMORY_SPACE_UPDATE_SUCCESS",
                    payload: data.memory_space,
                });

                if (callback) {
                    callback();
                }
                return;
            }

            dispatch({
                type: "MEMORY_SPACE_UPDATE_FAILURE",
                payload: getErrors(data),
            });
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(closeModal());
        }
    };
};

export const setMemorySpaceToUpdate = (memorySpace) => {
    return {
        type: "SET_MEMORY_SPACE_TO_UPDATE",
        payload: memorySpace,
    };
};

export const addMemorySpace = (memorySpace) => {
    return {
        type: "ADD_MEMORY_SPACE",
        payload: memorySpace,
    };
};

export const removeMemorySpace = (id) => {
    return {
        type: "REMOVE_MEMORY_SPACE",
        payload: id,
    };
};

export const incrementPage = () => {
    return {
        type: "INCREMENT_SPACES_PAGE",
    };
};

export const setPage = (page, needToFetch = false) => {
    return {
        type: "SET_SPACES_PAGE",
        payload: { page, needToFetch },
    };
};

export const setNeedToFetch = (needToFetch) => {
    return {
        type: "SET_NEED_TO_FETCH_SPACES",
        payload: needToFetch,
    };
};

export const resetMemorySpaces = () => {
    return {
        type: "RESET_MEMORY_SPACES",
    };
};
