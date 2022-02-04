import { removeArrItem, updateArrItem } from "../../utils/utils.reducers";

const INITIAL_STATE = {
    memories: [],
    loading: false,
    error: null,
    memoryUpdateLoading: false,
    memoryUpdateErrors: [],
    memoryToUpdate: {},
    needToFetch: true,
    page: 0,
    hasNext: false,
    hasPrev: false,
    // fetchingNext: false,
};

export const memoriesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "MEMORIES_REQUEST":
            return {
                ...state,
                loading: true,
                // fetchingNext: state.page > 1,
            };
        case "MEMORIES_SUCCESS":
            return {
                ...INITIAL_STATE,
                page: state.page,
                memories: action.payload.memories,
                hasNext: action.payload.hasNext,
                hasPrev: action.payload.hasPrev,
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
            return { ...state, needToFetch: action.payload, page: 1 };
        case "REMOVE_MEMORY":
            return {
                ...state,
                memories: removeArrItem(action.payload, state.memories),
            };
        case "CONTROL_MEMORY_PAGE":
            return {
                ...state,
                page: action.payload ? state.page + 1 : state.page - 1,
                needToFetch: true,
            };
        case "SET_MEMORY_PAGE":
            return {
                ...state,
                page: action.payload.page,
                needToFetch: action.payload.needToFetch,
            };
        case "RESET_MEMORIES":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
