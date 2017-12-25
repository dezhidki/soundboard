import $ from "jquery";
import { DEFAULT_BUTTON_SETTINGS } from "./settings";
import * as soundboard from "./soundboard";

var nameLabel;
var keyShortcutLabel;

var audioFile;
var audioFileButton;
var audioRemoveButton;
var audioPreview;

var colorIdle;
var colorPlaying;

var playTypeRadioGroup;
var playTypeRadioContainer;

var $loopButton;
var $stopAllButton;
var $bgOverlay;
var $formContainer;

var form;

var buttonData;

function init() {
    $bgOverlay = $("div#bg-overlay");
    $formContainer = $("div#button-settings");
    form = document.querySelector("form#button-settings-form");

    nameLabel = form.querySelector("#audio-name");
    keyShortcutLabel = form.querySelector("#activation-button");

    audioFile = form.querySelector("#audio-file");
    audioFileButton = form.querySelector("#audio-from-file-button");
    audioRemoveButton = form.querySelector("#audio-remove-button");
    audioPreview = form.querySelector("#audio-preview");

    colorIdle = form.querySelector("#color-idle");
    colorPlaying = form.querySelector("#color-play");
    toggleColorEdit(false);

    playTypeRadioContainer = form.querySelector("#play-type-radio-group");

    playTypeRadioGroup = {};
    playTypeRadioContainer.querySelectorAll("label").forEach(el => {
        let button = $(el);
        playTypeRadioGroup[button.find("input")[0].value] = button;
    });

    $loopButton = $(form.querySelector("#loop-toggle"));
    $stopAllButton = $(form.querySelector("#stop-others-toggle"));

    audioRemoveButton.addEventListener("click", e => {
        e.preventDefault();
        audioPreview.src = "";
        toggleColorEdit(false);
    });

    audioFileButton.addEventListener("click", e => {
        e.preventDefault();
        audioFile.click();
    });

    audioFile.addEventListener("change", e => {
        let files = e.target.files;
        if (files.length !== 1)
            return;
        let file = files[0];
        if (!file.type.match("audio.*"))
            return;

        let reader = new FileReader();
        reader.onload = e => {
            audioPreview.src = e.target.result;
            if (e.target.result)
                toggleColorEdit(true);
        };
        reader.readAsDataURL(file);
        audioFile.value = "";
    });

    form.addEventListener("submit", e => {
        e.preventDefault();

        if (!buttonData)
            return;

        buttonData.title = nameLabel.value;
        buttonData.key = keyShortcutLabel.value;
        buttonData.audioSrc = audioPreview.src.startsWith("data:") ? audioPreview.src : "";
        buttonData.buttonColor = colorIdle.value;
        buttonData.playingColor = colorPlaying.value;

        let selectedType = playTypeRadioContainer.querySelector(":checked");
        buttonData.type = selectedType ? selectedType.value : DEFAULT_BUTTON_SETTINGS.type;
        buttonData.loop = $loopButton.is(".active");
        buttonData.stopAll = $stopAllButton.is(".active");

        soundboard.setButtonData(buttonData);
        editButton(DEFAULT_BUTTON_SETTINGS, true);
        $bgOverlay.removeClass("active");
        $formContainer.removeClass("active");
        buttonData = null;
    });
}

function toggleColorEdit(enable) {
    colorIdle.disabled = !enable;
    colorPlaying.disabled = !enable;
    if (!enable) {
        colorIdle.value = DEFAULT_BUTTON_SETTINGS.buttonColor;
        colorPlaying.value = DEFAULT_BUTTON_SETTINGS.playingColor;
    }
}

function isString(str) {
    return typeof str === "string" && str != null && str.length > 0;
}

function editButton(buttonSettings, noTransition) {
    buttonData = { ...buttonSettings };

    let loader = e => {
        e.target.removeEventListener("canplaythrough", loader);
        if (!noTransition)
            $formContainer.addClass("active");
    };
    let hasAudioData = isString(buttonSettings.audioSrc);

    nameLabel.value = buttonSettings.title;
    keyShortcutLabel.value = buttonSettings.key;
    toggleColorEdit(hasAudioData);
    colorIdle.value = buttonSettings.buttonColor;
    colorPlaying.value = buttonSettings.playingColor;

    let playTypeButton = playTypeRadioGroup[buttonSettings.type];
    if (playTypeButton)
        playTypeButton.button("toggle");

    setButton($loopButton, buttonSettings.loop);
    setButton($stopAllButton, buttonSettings.stopAll);

    if (hasAudioData) {
        if (!noTransition) {
            $bgOverlay.addClass("active");
            audioPreview.addEventListener("canplaythrough", loader);
        }
        audioPreview.src = buttonSettings.audioSrc;
    }
    else {
        if (!noTransition) {
            $bgOverlay.addClass("active");
            $formContainer.addClass("active");
        }
        audioPreview.src = "";
    }
}

function setButton($button, value) {
    if ($button.is(".active"))
        $button.button("toggle");
    if (value)
        $button.button("toggle");
}

export { init, editButton };