import "bootstrap";
import "./styles/style.css";
import $ from "jquery";
import * as soundboard from "./soundboard";
import * as buttonSettings from "./button-settings";

$(() => {
    soundboard.init();
    buttonSettings.init();
});
