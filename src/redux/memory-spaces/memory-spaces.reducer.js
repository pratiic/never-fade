import { removeArrItem, updateArrItem } from "../../utils/utils.reducers";

const INITIAL_STATE = {
    memorySpaces: [],
    loading: false,
    error: null,
    memorySpaceUpdateLoading: false,
    memorySpaceUpdateErrors: [],
    memorySpaceToUpdate: {},
    needToFetch: true,
    page: 0,
    hasNext: false,
    hasPrev: false,
};

export const memorySpacesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "MEMORY_SPACES_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "MEMORY_SPACES_SUCCESS":
            return {
                ...INITIAL_STATE,
                memorySpaces: action.payload.memorySpaces,
                needToFetch: false,
                hasNext: action.payload.hasNext,
                hasPrev: action.payload.hasPrev,
                page: state.page,
            };
        case "MEMORY_SPACES_FAILURE":
            return { ...INITIAL_STATE, error: action.payload };
        case "MEMORY_SPACE_UPDATE_REQUEST":
            return { ...state, memorySpaceUpdateLoading: true };
        case "MEMORY_SPACE_UPDATE_SUCCESS":
            return {
                ...INITIAL_STATE,
                memorySpaces: updateArrItem(
                    action.payload.id,
                    state.memorySpaces,
                    action.payload
                ),
            };
        case "MEMORY_SPACE_UPDATE_FAILURE":
            return { ...state, memorySpaceUpdateErrors: action.payload };
        case "ADD_MEMORY_SPACE":
            return {
                ...state,
                memorySpaces: [action.payload, ...state.memorySpaces],
            };
        case "SET_MEMORY_SPACE_TO_UPDATE":
            return { ...state, memorySpaceToUpdate: action.payload };
        case "REMOVE_MEMORY_SPACE":
            return {
                ...state,
                memorySpaces: removeArrItem(action.payload, state.memorySpaces),
            };
        case "INCREMENT_SPACES_PAGE":
            return { ...state, page: state.page + 1, needToFetch: true };
        case "SET_SPACES_PAGE":
            return {
                ...state,
                page: action.payload.page,
                needToFetch: action.payload.needToFetch,
            };
        case "SET_NEED_TO_FETCH_SPACES":
            return { ...state, needToFetch: action.payload };
        case "RESET_MEMORY_SPACES":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
