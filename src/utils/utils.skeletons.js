export const getSkeletons = (skeleton) => {
    let skeletons = [];

    for (let i = 0; i < 5; i++) {
        skeletons = [...skeletons, skeleton];
    }

    return skeletons;
};
