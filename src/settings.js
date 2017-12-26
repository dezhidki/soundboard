const DEFAULT_BUTTON_SETTINGS = {
    loop: false,
    stopAll: false,
    buttonColor: "#757575",
    playingColor: "#757575",
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