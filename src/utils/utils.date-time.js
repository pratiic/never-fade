const numberToMonthMap = {
    0: "jan",
    1: "feb",
    2: "mar",
    3: "apr",
    4: "may",
    5: "jun",
    6: "jul",
    7: "aug",
    8: "sep",
    9: "oct",
    10: "nov",
    11: "dec",
};

export const getDate = (fullDate) => {
    const date = new Date(fullDate);
    const dateString = `${date.getDate()} ${
        numberToMonthMap[date.getMonth()]
    }, ${date.getFullYear()}`;
    return dateString;
};
