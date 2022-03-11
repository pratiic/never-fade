export const showGallery = (images, activeIndex = 0) => {
    return {
        type: "SHOW_GALLERY",
        payload: { images, activeIndex },
    };
};

export const incrementActiveIndex = () => {
    return {
        type: "INCREMENT_ACTIVE_INDEX",
    };
};

export const decrementActiveIndex = () => {
    return {
        type: "DECREMENT_ACTIVE_INDEX",
    };
};

export const resetGallery = () => {
    return {
        type: "RESET_GALLERY",
    };
};
