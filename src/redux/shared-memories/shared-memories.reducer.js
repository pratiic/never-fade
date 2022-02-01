import { removeArrItem, updateArrItem } from "../../utils/utils.reducers";

const INITIAL_STATE = {
    sharedMemories: [],
    loading: false,
    error: null,
    type: "with me",
    options: [
        { title: "with me", active: true },
        { title: "by me", active: false },
    ],
    needToFetch: true,
};

export const sharedMemoriesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SHARED_MEMORIES_REQUEST":
            return { ...state, loading: true };
        case "SHARED_MEMORIES_SUCCESS":
            return {
                ...state,
                sharedMemories: action.payload,
                loading: false,
                needToFetch: false,
            };
        case "SHARED_MEMORIES_FAILURE":
            return { ...INITIAL_STATE, error: action.payload };
        case "ADD_SHARED_MEMORY":
            return {
                ...state,
                sharedMemories: [action.payload, ...state.sharedMemories],
            };
        case "SET_SHARED_MEMORIES_TYPE":
            return {
                ...state,
                type: action.payload,
                options: state.options.map((option) => {
                    if (option.title === action.payload) {
                        return { ...option, active: true };
                    }

                    return { ...option, active: false };
                }),
                needToFetch: true,
            };
        case "UPDATE_SHARED_MEMORY":
            return {
                ...state,
                sharedMemories: updateArrItem(
                    action.payload.id,
                    state.sharedMemories,
                    action.payload
                ),
            };
        case "REMOVE_SHARED_MEMORY":
            return {
                ...state,
                sharedMemories: removeArrItem(
                    action.payload,
                    state.sharedMemories
                ),
            };
        case "SET_NEED_TO_FETCH_SHARED_MEMORIES":
            return {
                ...state,
                needToFetch: action.payload,
            };
        case "RESET_SHARED_MEMORIES":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
