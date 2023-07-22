import { getAlivePeoplePositionsX, getRandomAlivePersonPositionX } from './people'
import { getTexture } from '../common/assets'
import { allTextureKeys } from '../common/textures'
import appConstants from '../common/constants'
import { AnimatedSprite, Container } from 'pixi.js'
import { randomIntFromInterval } from '../common/utils'
import { addBomb } from './bombs'
import { addExplosion } from './explosions'
import { destroySprite } from '../common/utils'
import { deleteUFO } from '../common/eventHub'

let enemies
let app
let rootContainer

export const initEnemies = (currApp, root) => {
    enemies = new Container()
    enemies.name = appConstants.containers.enemies
    app = currApp
    rootContainer = root
    return enemies
}

const enemyOffsetX = 25
const enemyOffsetY = 150

export const addEnemy = () => {
    const textures = [
        getTexture( allTextureKeys.shipBlue ),
        getTexture( allTextureKeys.shipBlue2 )
    ]
    const enemy = new AnimatedSprite(textures)
    enemy.anchor.set(0.5, 1)
    const aliveHumanPositionX = getRandomAlivePersonPositionX()
    if ( aliveHumanPositionX ) enemy.position.x = aliveHumanPositionX
    else enemy.position.x = randomIntFromInterval( enemyOffsetX, appConstants.size.WIDTH - enemyOffsetX )
    enemy.position.y = enemyOffsetY
    enemy.scale.set( 0.5 )
    enemy.isMoveToLeft = ( Math.random() < 0.5 ) ? true : false
    enemy.animationSpeed = 0.1
    enemy.destroyMe = function() {
        addExplosion( {x: this.position.x, y: this.position.y + 20} )
        destroySprite( this )
        deleteUFO()
        setTimeout( addEnemy, appConstants.timeouts.addNewEnemy )
    }
    enemies.addChild( enemy )
    return enemy
}

export const enemyTick = () => {
    const allAlivePositionsX = getAlivePeoplePositionsX()

    enemies.children.forEach( (enemy) => {
        let isDirectionChanged = false
        if ( enemy.isMoveToLeft ) {
            enemy.position.x -= 1
            if (enemy.position.x < enemyOffsetX) {
                enemy.isMoveToLeft = false
                isDirectionChanged = true
            }
        }
        else {
            enemy.position.x += 1
            if (enemy.position.x > appConstants.size.WIDTH - enemyOffsetX) {
                enemy.isMoveToLeft = true
                isDirectionChanged = true
            }
        }

        if( !isDirectionChanged && Math.random() < appConstants.probability.enemyChangeDirection ) {
            enemy.isMoveToLeft = !enemy.isMoveToLeft
            const spriteIndex = randomIntFromInterval(0, 1)
            enemy.gotoAndStop( spriteIndex )
        }

        const underPerson = allAlivePositionsX.filter( (x) => {
            return (x - 10 <= enemy.position.x) && (x + 10 >= enemy.position.x)
        })
        if (underPerson.length) {
            if ( Math.random() < appConstants.probability.bomb ) {
                addBomb(enemy.position)
            }
        }
        else {
            if ( Math.random() < (appConstants.probability.bomb / 5) ) {
                addBomb(enemy.position)
            }
        }
    })
}