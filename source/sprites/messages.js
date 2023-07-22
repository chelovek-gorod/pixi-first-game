import { Container, Graphics, TextStyle, Text } from "pixi.js"
import appConstants from "../common/constants"
import { startGame,restartGame } from "../common/eventHub"

let rootContainer
let containerType

const style = new TextStyle({
    fontFamily: 'MicraDi',
    fontSize: 36,
    fontStyle: 'normal',
    fontWeight: '400',
    fill: ['#ff0000', '#ffff00'],
    stroke: '#ffffff',
    strokeThickness: 2,
    dropShadow: true,
    dropShadowColor: '#ff00ff',
    dropShadowBlur: 3,
    dropShadowDistance: 4,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
})

const startMessage = new Container()
startMessage.eventMode = 'static'

const graphicsStart = new Graphics()
graphicsStart.lineStyle( 2, 0xff00ff, 1 )
graphicsStart.beginFill( 0x777777, 0.25 )
graphicsStart.drawRoundedRect( 0, 0, 280, 140, 20 )
graphicsStart.endFill()
startMessage.addChild( graphicsStart )

const textStart1 = new Text( 'Control - MOUSE', style )
textStart1.anchor.set( 0.5 )
textStart1.x = 140
textStart1.y = 50
textStart1.name = 'textStart1'
startMessage.addChild( textStart1 )

const textStart2 = new Text( 'Shoot - SPACE', style )
textStart2.anchor.set( 0.5 )
textStart2.x = 140
textStart2.y = 90
textStart2.name = 'textStart2'
startMessage.addChild( textStart2 )

startMessage.on('pointertap', () => {
    rootContainer.removeChild( containerType )
    startGame()
})

startMessage.position.x = appConstants.size.WIDTH / 2 - startMessage.width / 2
startMessage.position.y = appConstants.size.HEIGHT / 2 - startMessage.height / 2

export const getStart = ( root ) => {
    rootContainer = root
    containerType = startMessage
    return startMessage
}

const gameOverMessage = new Container()
gameOverMessage.eventMode = 'static'

const graphicsGameOver = new Graphics()
graphicsGameOver.lineStyle( 2, 0xff00ff, 1 )
graphicsGameOver.beginFill( 0x777777, 0.25 )
graphicsGameOver.drawRoundedRect( 0, 0, 280, 140, 20 )
graphicsGameOver.endFill()
gameOverMessage.addChild( graphicsGameOver )

const textGameOver = new Text( 'GAME OVER', style )
textGameOver.anchor.set( 0.5 )
textGameOver.x = 140
textGameOver.y = 70
textGameOver.name = 'textGameOver'
gameOverMessage.addChild( textGameOver )
gameOverMessage.on('pointertap', () => {
    rootContainer.removeChild( containerType )
    restartGame()
})

gameOverMessage.position.x = appConstants.size.WIDTH / 2 - gameOverMessage.width / 2
gameOverMessage.position.y = appConstants.size.HEIGHT / 2 - gameOverMessage.height / 2

export const getGameOver = ( root ) => {
    rootContainer = root
    containerType = gameOverMessage
    return gameOverMessage
}

const playerWinMessage = new Container()
playerWinMessage.eventMode = 'static'

const graphicsPlayerWin = new Graphics()
graphicsPlayerWin.lineStyle( 2, 0xff00ff, 1 )
graphicsPlayerWin.beginFill( 0x777777, 0.25 )
graphicsPlayerWin.drawRoundedRect( 0, 0, 280, 140, 20 )
graphicsPlayerWin.endFill()
playerWinMessage.addChild( graphicsPlayerWin )

const textPlayerWin = new Text( 'YOU WIN', style )
textPlayerWin.anchor.set( 0.5 )
textPlayerWin.x = 140
textPlayerWin.y = 70
textPlayerWin.name = 'textPlayerWin'
playerWinMessage.addChild( textPlayerWin )
playerWinMessage.on('pointertap', () => {
    rootContainer.removeChild( containerType )
    restartGame()
})

playerWinMessage.position.x = appConstants.size.WIDTH / 2 - playerWinMessage.width / 2
playerWinMessage.position.y = appConstants.size.HEIGHT / 2 - playerWinMessage.height / 2

export const getPlayerWin = ( root ) => {
    rootContainer = root
    containerType = playerWinMessage
    return playerWinMessage
}