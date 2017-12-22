import $ from "jquery";
import * as settings from "./settings";
import * as utils from "./utils";

var $grid, $audioContainer;
var buttonGrid;
var playSet;
var keyToButtonMap;

function init() {
    $grid = $("div.soundboard-section div.grid");
    $audioContainer = $("div.audio-container");
    playSet = new Set();
    keyToButtonMap = {};

    $("body").on("keypress", e => {
        let button = keyToButtonMap[e.key];
        if (button)
            button.click();
    });

    $grid.on("click", "button", e => {
        let button = buttonGrid[e.target.dataset.col][e.target.dataset.row];
        let audio = button.audio;
        if (audio.src) {
            audio.loop = button.settings.loop;
            if (audio.loop && audio.paused)
                audio.currentTime = 0;
            if (button.settings.toggle) {
                if (!audio.paused)
                    audio.pause();
                else
                    audio.play();
                return;
            }
            audio.play();
        }
    });

    initButtonGrid(5, 5);

/*     $("input#audio-file").on("change", e => {
        let target = e.target;
        let file = target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = e => {
                buttonGrid.forEach(r => r.forEach(b => b.audio.src = e.target.result));
            };
            reader.readAsDataURL(file);
        }
    }); */
}

function onPlay(button) {
    let settings = button.settings;

    if (settings.stopAll) {
        playSet.forEach(audio => audio.pause());
        playSet.clear();
    }

    button.element.addClass("play-button-pressed");
    if(settings.playingColor)
        button.element.css("background-color", settings.playingColor);
    playSet.add(button.audio);
}

function onStop(button) {
    button.element.removeClass("play-button-pressed");

    if (!button.settings.loop && !button.settings.pausable)
        button.audio.currentTime = 0;
    if(button.settings.playingColor)        
        button.element.css("background-color", button.settings.buttonColor || "");
    playSet.delete(button.audio);
}

function initButtonGrid(cols, rows) {
    $grid.empty();
    $audioContainer.empty();

    buttonGrid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        buttonGrid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            let el = $("<button/>", { "class": "play-button" })
                .attr("data-col", i)
                .attr("data-row", j);

            let audioEl = $("<audio/>")
                .attr("data-col", i)
                .attr("data-row", j)
                .on("play", e => onPlay(buttonGrid[e.target.dataset.col][e.target.dataset.row]))
                .on("ended pause", e => onStop(buttonGrid[e.target.dataset.col][e.target.dataset.row]));

            buttonGrid[i][j] = {
                element: el,
                audio: audioEl[0],
                settings: settings.createDefaultButtonSettings()
            };

            keyToButtonMap[utils.rand(0, 9).toFixed()] = el;

            // TODO: Remove later
            el.css("background-color", buttonGrid[i][j].settings.buttonColor || "");
            el.appendTo($grid);
            audioEl.appendTo($audioContainer);
        }
    }
}

init();