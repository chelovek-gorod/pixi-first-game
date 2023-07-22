import { Container, Graphics, Sprite, TextStyle, Text } from "pixi.js"
import { getTexture } from "../common/assets"
import appConstants from "../common/constants"
import { EventHub, gameOver, playerWin } from "../common/eventHub"
import { pause, play, setMuteEffects } from "../common/sound"
import { allTextureKeys } from "../common/textures"


let info
let app

let UFOText
let peopleText

let UFOCount = 0
let peopleCount = 0

let musicSprite
let isMusicPlayStatus = false

let effectsSprite
let isEffectsPlayStatus = false

const style = new TextStyle({
    fontFamily: 'MicraDi',
    fontSize: 26,
    fontStyle: 'normal',
    fontWeight: '400',
    fill: ['#ff0000', '#ffff00'],
    /*
    stroke: '#ffffff',
    strokeThickness: 2,
    */
    /*
    dropShadow: true,
    dropShadowColor: '#ff00ff',
    dropShadowBlur: 3,
    dropShadowDistance: 4,
    */
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
})

export const initInfo = (currApp, root) => {
    const musicOffTexture = getTexture( allTextureKeys.musicOff )
    const musicOnTexture = getTexture( allTextureKeys.musicOn )
    const effectsOffTexture = getTexture( allTextureKeys.effectsOff )
    const effectsOnTexture = getTexture( allTextureKeys.effectsOn )

    info = new Container()
    info.name = appConstants.containers.infoPanel

    app = currApp

    const infoPanel = new Container()
    infoPanel.position.x = 20
    infoPanel.position.y = 20

    const graphics = new Graphics()
    graphics.lineStyle( 2, 0xff00ff, 1 )
    graphics.beginFill( 0x777777, 0.25 )
    graphics.drawRoundedRect( 0, 0, 180, 40, 20 )
    graphics.endFill()
    infoPanel.addChild( graphics )

    const UFO = new Sprite( getTexture( allTextureKeys.enemyShip ) )
    UFO.scale.set( 0.3 )
    UFO.anchor.set( 0.5 )
    UFO.name = 'UFO'
    UFO.x = 110
    UFO.y = 20
    infoPanel.addChild( UFO )

    UFOText = new Text( "0", style )
    UFOText.anchor.set( 0.5 )
    UFOText.x = 150
    UFOText.y = 20
    UFOText.name = 'UFOText'
    infoPanel.addChild( UFOText )

    const person = new Sprite( getTexture( allTextureKeys.man ) )
    person.scale.set( 0.6 )
    person.anchor.set( 0.5 )
    person.name = 'person'
    person.x = 20
    person.y = 20
    infoPanel.addChild( person )

    peopleCount = appConstants.count.people
    peopleText = new Text( `${peopleCount}`, style )

    peopleText.anchor.set( 0.5 )
    peopleText.x = 60
    peopleText.y = 20
    peopleText.name = 'peopleText'
    infoPanel.addChild( peopleText )

    info.addChild( infoPanel )
    info.alpha = 0.6

    // MUSIC
    const musicButton = new Container()
    musicButton.x = appConstants.size.WIDTH - 60
    musicButton.y = 30
    musicButton.name = 'musicButton'

    const graphicsMusic = new Graphics()
    graphicsMusic.lineStyle( 2, 0xff00ff, 1 )
    graphicsMusic.beginFill( 0x777777, 0.25 )
    graphicsMusic.drawCircle( 10, 10, 20 )
    graphicsMusic.endFill()
    musicButton.addChild( graphicsMusic )

    musicSprite = new Sprite( isMusicPlayStatus ? musicOnTexture : musicOffTexture )
    if ( isMusicPlayStatus ) play( appConstants.sounds.background )
    else pause( appConstants.sounds.background )
    musicSprite.scale.set( 0.6 )
    musicSprite.anchor.set( 0.5 )
    musicSprite.x = 10
    musicSprite.y = 10
    musicSprite.name = 'musicSprite'
    musicButton.addChild( musicSprite )

    musicButton.eventMode = 'static'
    musicButton.on('pointertap', () => {
        isMusicPlayStatus = !isMusicPlayStatus
        musicSprite.texture = isMusicPlayStatus ? musicOnTexture : musicOffTexture
        if ( isMusicPlayStatus ) play( appConstants.sounds.background )
        else pause( appConstants.sounds.background )
    })

    info.addChild( musicButton )

    // EFFECTS
    const effectsButton = new Container()
    effectsButton.x = appConstants.size.WIDTH - 110
    effectsButton.y = 30
    effectsButton.name = 'effectsButton'

    const graphicsEffects = new Graphics()
    graphicsEffects.lineStyle( 2, 0xff00ff, 1 )
    graphicsEffects.beginFill( 0x777777, 0.25 )
    graphicsEffects.drawCircle( 10, 10, 20 )
    graphicsEffects.endFill()
    effectsButton.addChild( graphicsEffects )

    effectsSprite = new Sprite( isEffectsPlayStatus ? effectsOnTexture : effectsOffTexture )
    setMuteEffects( !isEffectsPlayStatus )
    effectsSprite.scale.set( 0.6 )
    effectsSprite.anchor.set( 0.5 )
    effectsSprite.x = 10
    effectsSprite.y = 10
    effectsSprite.name = 'effectsSprite'
    effectsButton.addChild( effectsSprite )

    effectsButton.eventMode = 'static'
    effectsButton.on('pointertap', () => {
        isEffectsPlayStatus = !isEffectsPlayStatus
        effectsSprite.texture = isEffectsPlayStatus ? effectsOnTexture : effectsOffTexture
        setMuteEffects( !isEffectsPlayStatus )
    })

    info.addChild( effectsButton )

    return info
}

EventHub.on( appConstants.events.killPerson, ( event ) => {
    peopleCount -= 1
    peopleText.text = `${peopleCount}`
    if (peopleCount === 0) {
        gameOver()
    }
})

EventHub.on( appConstants.events.deleteUFO, ( event ) => {
    UFOCount += 1
    UFOText.text = `${UFOCount}`
    if (UFOCount === 10) {
        playerWin()
    }
})

EventHub.on( appConstants.events.restartGame, ( event ) => {
    peopleCount =  appConstants.count.people
    peopleText.text = `${peopleCount}`

    UFOCount = 0
    UFOText.text = `${UFOCount}`
})