module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#282C34",
                grey: "#EAEAEA",
                "grey-dark": "#d6d6d6",
                "grey-darker": "#6D6D6D",
                "grey-darkest": "#C4C4C4",
                "grey-light": "#f7f7f7",
                black: "#222222",
                blue: "#4284F3",
                "blue-darker": "#1667f0",
                "blue-light": "#5e96f4",
                "black-modal": "rgba(0, 0, 0, 0.7)",
            },
            gridTemplateColumns: {
                2: "4rem auto",
                list: "repeat(auto-fit, 17rem)",
                details: "50% auto",
            },
            gridTemplateRows: {
                2: "3.5rem",
            },
            gridAutoRows: {
                5: "5px",
                3: "3px",
            },
            fontSize: {
                "1.5xl": "1.35rem",
                "2.5xl": "1.75rem",
                md: "1.1rem",
            },
            scale: {
                103: "1.03",
                102: "1.02",
            },
            minWidth: {
                15: "15rem",
                5: "5rem",
            },
            maxWidth: {
                15: "15rem",
                25: "25rem",
            },
            minHeight: {
                5: "5rem",
            },
            animation: {
                spin: "spin 2s infinite linear",
            },
        },
    },
    plugins: [],
};
