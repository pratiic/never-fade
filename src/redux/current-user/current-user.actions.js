import { resetAccount } from "../account/account.actions";
import { resetMemories } from "../memories/memories.actions";
import { resetMemorySpaces } from "../memory-spaces/memory-spaces.actions";
import { resetSharedMemories } from "../shared-memories/shared-memories.actions";

export const setCurrentUser = (userInfo) => {
    return (dispatch) => {
        dispatch({
            type: "SET_CURRENT_USER",
            payload: userInfo,
        });
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    };
};

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem("userInfo");
        dispatch({
            type: "CURRENT_USER_LOGOUT",
        });
        dispatch({ type: "CLOSE_MODAL" });
        dispatch(resetMemories());
        dispatch(resetSharedMemories());
        dispatch(resetMemorySpaces());
        dispatch(resetAccount());
    };
};
