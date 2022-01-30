export const updateArrItem = (id, arr, updateInfo) => {
    return arr.map((arrItem) => {
        if (arrItem.id === id) {
            return updateInfo;
        }

        return arrItem;
    });
};

export const removeArrItem = (id, arr) => {
    return arr.filter((arrItem) => arrItem.id !== id);
};
