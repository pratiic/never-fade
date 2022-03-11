const INITIAL_STATE = {
    show: false,
    images: [],
    activeIndex: 0,
};

export const galleryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SHOW_GALLERY":
            return {
                ...state,
                show: true,
                images: action.payload.images,
                activeIndex: action.payload.activeIndex,
            };
        case "INCREMENT_ACTIVE_INDEX":
            return {
                ...state,
                activeIndex:
                    ++state.activeIndex >= state.images.length
                        ? 0
                        : state.activeIndex++,
            };
        case "DECREMENT_ACTIVE_INDEX":
            return {
                ...state,
                activeIndex:
                    --state.activeIndex < 0
                        ? state.images.length - 1
                        : state.activeIndex--,
            };
        case "RESET_GALLERY":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
