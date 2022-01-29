export const selectFile = (files) => {
    return {
        type: "SELECT_FILES",
        payload: files,
    };
};

export const resetFiles = () => {
    return {
        type: "RESET_FILES",
    };
};
