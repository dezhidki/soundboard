import $ from "jquery";
import * as soundboard from "./soundboard";
import {saveAs} from "file-saver";

var $jsonFileInput;

function init() {
    $jsonFileInput = $("input#load-json-input");
    $jsonFileInput.on("change", e => {
        let input = e.target;
        let file = input.files[0];
        if(!file)
            return;

        let reader = new FileReader();
        reader.onload = e => soundboard.deserialize(JSON.parse(e.target.result));
        reader.readAsText(file);
    });
    $("a#button-load").on("click", e => {
        e.preventDefault();
        $jsonFileInput.click();
    });

    $("a#button-save").on("click", e => {
        e.preventDefault();
        let data = soundboard.serialize();
        if(!data)
            return;
        let text = encodeURIComponent();
        if(text)
            saveAs(new Blob([JSON.stringify(data)], {type: "application/json;charset=UTF-8"}), "soundboard.json");
    });
}

export { init };