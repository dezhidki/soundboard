import $ from "jquery";
import * as settings from "./settings";
import * as utils from "./utils";
import * as settingsGui from "./button-settings";

var $grid, $audioContainer;
var buttonGrid;
var gridCols, gridRows;
var playSet;
var keyToButtonMap;
var $bgOverlay;

function init() {
    $bgOverlay = $("div#bg-overlay");
    $grid = $("div.soundboard-section div.grid");
    $audioContainer = $("div.audio-container");
    playSet = new Set();
    keyToButtonMap = {};

    $("body").on("keypress", e => {
        if($bgOverlay.hasClass("active"))
            return;
        let button = keyToButtonMap[e.key];
        if (button)
            button.click();
    });

    $grid.on("click", ".play-button", e => {
        let button = buttonGrid[+e.target.dataset.col + +e.target.dataset.row * gridCols];

        if (e.ctrlKey) {
            settingsGui.editButton(button.settings);
            return;
        }

        let audio = button.audio;
        let settings = button.settings;
        if (audio.src) {
            audio.loop = settings.loop;
            if (settings.type === "toggle") {
                if (!audio.paused)
                    audio.pause();
                else
                    audio.play();
            }
            else if (settings.type === "once") {
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                else
                    audio.play();
            }
            else if (settings.type === "shot") {
                audio.pause();
                audio.currentTime = 0;
                audio.play();
            }
        }
    });

    initButtonGrid(5, 5);
}

function setButtonData(data) {
    if (data.col === undefined || data.row === undefined)
        return;

    let button = buttonGrid[data.col + data.row * gridCols];
    if (!button)
        return;

    let prevKey = button.settings.key;
    button.settings = { ...button.settings, ...data };

    button.audio.pause();
    button.audio.currentTime = 0;
    button.audio.src = button.settings.audioSrc;

    button.element.css("background-color", button.settings.buttonColor);

    if (prevKey)
        delete keyToButtonMap[prevKey];
    if (button.settings.key)
        keyToButtonMap[button.settings.key] = button.element;

    button.textElement.text(button.settings.title);
}

function onPlay(audio) {
    let col = +audio.dataset.col;
    let row = +audio.dataset.row;
    let button = buttonGrid[col + row * gridCols];
    if(!button)
        return;
    let settings = button.settings;

    if (settings.stopAll) {
        playSet.forEach(audio => audio.pause());
        playSet.clear();
    }

    button.element.addClass("play-button-pressed");
    if (settings.playingColor)
        button.element.css("background-color", settings.playingColor);
    playSet.add(button.audio);
}

function onStop(audio) {
    let col = +audio.dataset.col;
    let row = +audio.dataset.row;
    let button = buttonGrid[col + row * gridCols];
    if(!button)
        return;
    button.element.removeClass("play-button-pressed");

    button.element.css("background-color", button.settings.buttonColor);
    playSet.delete(button.audio);
}

function initButtonGrid(cols, rows) {
    gridCols = cols;
    gridRows = rows;
    $grid.empty();
    $audioContainer.empty();

    buttonGrid = new Array(cols * rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let el = $("<div/>", { "class": "play-button" })
                .attr("data-col", i)
                .attr("data-row", j);

            let textEl = $("<span/>").appendTo(el);

            let audioEl = $("<audio/>")
                .attr("data-col", i)
                .attr("data-row", j)
                .on("play", e => onPlay(e.target))
                .on("ended pause", e => onStop(e.target));

            let buttonSettings = settings.createDefaultButtonSettings();
            buttonSettings.col = i;
            buttonSettings.row = j;

            buttonGrid[i + j * cols] = {
                element: el,
                textElement: textEl,
                audio: audioEl[0],
                settings: buttonSettings
            };

            el.css("background-color", buttonSettings.buttonColor);
            el.appendTo($grid);
            audioEl.appendTo($audioContainer);
        }
    }
}

function deserialize(data) {
    if(!data)
        return;
    
    data.layout.forEach(bs => setButtonData(bs));
}

function serialize() {
    let data = {
        layout: []
    };

    buttonGrid.forEach(b => {
        data.layout.push(b.settings);
    });

    return data;
}

export { init, setButtonData, serialize, deserialize };