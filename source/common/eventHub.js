import { utils } from "pixi.js";
import appConstants from "./constants";

export const EventHub = new utils.EventEmitter()

export const startGame = ( data ) => {
    EventHub.emit( appConstants.events.startGame, data )
}

export const updateInfo = ( data ) => {
    EventHub.emit( appConstants.events.updateInfo, data )
}

export const deleteUFO = ( data ) => {
    EventHub.emit( appConstants.events.deleteUFO, data )
}

export const killPerson = ( data ) => {
    EventHub.emit( appConstants.events.killPerson, data )
}

export const explosionBomb = ( data ) => {
    EventHub.emit( appConstants.events.explosionBomb, data )
}

export const playerWin = ( data ) => {
    EventHub.emit( appConstants.events.playerWin, data )
}

export const gameOver = ( data ) => {
    EventHub.emit( appConstants.events.gameOver, data )
}

export const restartGame = ( data ) => {
    EventHub.emit( appConstants.events.restartGame, data )
}

export const callRestorePeople = ( data ) => {
    EventHub.emit( appConstants.events.callRestorePeople, data )
}