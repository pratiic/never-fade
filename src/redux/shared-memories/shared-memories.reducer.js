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
    page: 0,
    hasNext: false,
    hasPrev: false,
    // fetchingNext: false,
};

export const sharedMemoriesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SHARED_MEMORIES_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "SHARED_MEMORIES_SUCCESS":
            return {
                ...state,
                page: state.page,
                sharedMemories: action.payload.sharedMemories,
                loading: false,
                needToFetch: false,
                hasNext: action.payload.hasNext,
                hasPrev: action.payload.hasPrev,
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
                needToFetch: true,
                type: action.payload,
                options: state.options.map((option) => {
                    if (option.title === action.payload) {
                        return { ...option, active: true };
                    }

                    return { ...option, active: false };
                }),
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
        case "INCREMENT_SHARED_MEMORIES_PAGE":
            return { ...state, page: state.page + 1, needToFetch: true };
        case "RESET_SHARED_MEMORIES":
            return { ...INITIAL_STATE };
        case "SET_SHARED_MEMORIES_PAGE":
            return {
                ...state,
                page: action.payload.page,
                needToFetch: action.payload.needToFetch,
            };
        default:
            return state;
    }
};
