import { removeArrItem, updateArrItem } from "../../utils/utils.reducers";

const INITIAL_STATE = {
    memories: [],
    loading: false,
    error: null,
    memoryUpdateLoading: false,
    memoryUpdateErrors: [],
    memoryToUpdate: {},
    needToFetch: true,
};

export const memoriesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "MEMORIES_REQUEST":
            return { ...state, loading: true };
        case "MEMORIES_SUCCESS":
            return {
                ...INITIAL_STATE,
                memories: action.payload,
                needToFetch: false,
            };
        case "MEMORIES_FAILURE":
            return { ...INITIAL_STATE, error: action.payload };
        case "ADD_MEMORY":
            return { ...state, memories: [action.payload, ...state.memories] };
        case "MEMORY_UPDATE_REQUEST":
            return { ...state, memoryUpdateLoading: true };
        case "MEMORY_UPDATE_SUCCESS":
            return {
                ...state,
                memories: updateArrItem(
                    action.payload.id,
                    state.memories,
                    action.payload
                ),
            };
        case "MEMORY_UPDATE_FAILURE":
            return { ...state, memoryUpdateErrors: action.payload };
        case "SET_MEMORY_TO_UPDATE":
            return { ...state, memoryToUpdate: action.payload };
        case "SET_NEED_TO_FETCH_MEMORIES":
            return { ...state, needToFetch: action.payload };
        case "REMOVE_MEMORY":
            return {
                ...state,
                memories: removeArrItem(action.payload, state.memories),
            };
        case "RESET_MEMORIES":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
