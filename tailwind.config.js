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
                2: "auto 1fr",
                list: "repeat(auto-fit, 17rem)",
                "list-medium": "repeat(auto-fit, 14rem)",
                "list-small": "repeat(2, 1fr)",
                "list-smallest": "1fr",
                details: "1fr",
                "details-small": "1fr auto",
                "details-medium": "50% auto",
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
                20: "20rem",
            },
            maxWidth: {
                7: "7rem",
                10: "10rem",
                15: "15rem",
                17: "17rem",
                20: "20rem",
                22: "22rem",
                23: "23rem",
                25: "25rem",
                80: "80%",
                90: "90%",
                95: "95%",
            },
            minHeight: {
                5: "5rem",
                12: "12rem",
                11: "11rem",
            },
            maxHeight: {
                80: "80%",
                95: "95%",
            },
            animation: {
                spin: "spin 2s infinite linear",
            },
            screens: {
                350: "350px",
                400: "400px",
                500: "500px",
                550: "550px",
                600: "600px",
                650: "650px",
                700: "700px",
                850: "850px",
                1000: "1000px",
                1200: "1200px",
            },
            height: {
                3.5: "3.5rem",
            },
            spacing: {
                3.5: "3.5rem",
            },
        },
    },
    plugins: [],
};
