const DEFAULT_BUTTON_SETTINGS = {
    loop: false,
    toggle: true,
    pausable: false,
    stopAll: false,
    buttonColor: "#880000",
    playingColor: null
};

function createDefaultButtonSettings() {
    return Object.assign({}, DEFAULT_BUTTON_SETTINGS);
}

export {createDefaultButtonSettings};