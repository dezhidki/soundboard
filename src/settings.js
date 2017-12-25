const DEFAULT_BUTTON_SETTINGS = {
    loop: false,
    stopAll: false,
    buttonColor: "#444444",
    playingColor: "#444444",
    title: "",
    type: "toggle",
    key: "",
    audioSrc: "",
    col: 0,
    row: 0
};

function createDefaultButtonSettings() {
    return {...DEFAULT_BUTTON_SETTINGS};
}

export { createDefaultButtonSettings, DEFAULT_BUTTON_SETTINGS };