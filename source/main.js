import { initGame } from "./game";
const FontFaceObserver = require('fontfaceobserver')

var font = new FontFaceObserver('MicraDi');

font.load().then( () => {
    const app = initGame()
});