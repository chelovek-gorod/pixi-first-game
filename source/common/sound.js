import { Howl, Howler } from "howler"
import appConstants from "./constants"

const allSounds = {

}

let muteEffectStatus = true

const effects = [
    appConstants.sounds.shut,
    appConstants.sounds.miss,
    appConstants.sounds.explosion,
    appConstants.sounds.gameOver,
    appConstants.sounds.playerWin,
]

allSounds[appConstants.sounds.shut] = new Howl({
    src: ['./src/sounds/shot.mp3'],
    volume: 0.5,
})

allSounds[appConstants.sounds.miss] = new Howl({
    src: ['./src/sounds/miss.mp3'],
    volume: 0.5,
})

allSounds[appConstants.sounds.explosion] = new Howl({
    src: ['./src/sounds/explosion.mp3'],
    volume: 0.5,
})

allSounds[appConstants.sounds.gameOver] = new Howl({
    src: ['./src/sounds/game_over.mp3'],
    volume: 0.5,
})

allSounds[appConstants.sounds.playerWin] = new Howl({
    src: ['./src/sounds/you_win.mp3'],
    volume: 0.5,
})

allSounds[appConstants.sounds.background] = new Howl({
    src: ['./src/sounds/background.mp3'],
    volume: 0.3,
    loop: true,
    autoplay: false,
})

export const playBackground = () => {
    allSounds[appConstants.sounds.background].play()
}

export const play = (id) => {
    if (muteEffectStatus) {
        if (effects.indexOf(id) === -1) allSounds[id].play()
    }
    else allSounds[id].play()
}

export const pause = (id) => {
    allSounds[id].pause()
}

export const resume = (id) => {
    allSounds[id].resume()
}

export const stop = (id) => {
    allSounds[id].stop()
}

export const muteAll = () => {
    Howler.mute()
}

export const unmuteAll = () => {
    Howler.mute( false )
}

export const setMuteEffects = (isMute) => {
    muteEffectStatus = isMute ? true : false
}