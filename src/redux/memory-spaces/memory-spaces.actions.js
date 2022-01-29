import { getErrors } from "../../utils/utils.errors";

import { closeModal, showLoadingModal } from "../modal/modal.actions";

export const getMemorySpaces = () => {
    return async (dispatch, getState) => {
        dispatch({ type: "MEMORY_SPACES_REQUEST" });

        try {
            const response = await fetch("/api/memory-spaces", {
                headers: {
                    Authorization: `Bearer ${
                        getState().currentUser.userInfo.token
                    }`,
                },
            });
            const data = await response.json();
            dispatch({
                type: "MEMORY_SPACES_SUCCESS",
                payload: data["memory-spaces"],
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
