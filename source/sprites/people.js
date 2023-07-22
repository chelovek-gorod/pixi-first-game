import { Sprite, Container } from 'pixi.js'
import { getTexture } from '../common/assets'
import { allTextureKeys } from '../common/textures'
import appConstants from '../common/constants'
import { randomIntFromInterval, destroySprite } from '../common/utils'
import { killPerson } from '../common/eventHub'

let app
let rootContainer
let people
let aliveCoords = []
let peopleFrames
let tombStoneFrames

export const initPeople = (currApp, root) => {
    if (!peopleFrames) {
        peopleFrames = [
            getTexture( allTextureKeys.man ),
            getTexture( allTextureKeys.man2 ),
            getTexture( allTextureKeys.woman )
        ]
    }
    if (!tombStoneFrames) {
        tombStoneFrames = [
            getTexture( allTextureKeys.tombStone1 ),
            getTexture( allTextureKeys.tombStone2 )
        ]
    }

    people = new Container()
    people.name = appConstants.containers.people
    app = currApp
    rootContainer = root

    return people
}

let x = appConstants.count.peopleStartX
let y = appConstants.size.HEIGHT

const recalculateAlivePeople = () => {
    const result = []
    people.children.forEach( (person) => {
        if (person.isAlive) result.push( person.position.x )
    })
    aliveCoords = [...result]
}

export const destroyPerson = ( person ) => {
    const position = {
        x: person.position.x,
        y: person.position.y
    }

    const frameName = tombStoneFrames[ randomIntFromInterval( 0, tombStoneFrames.length - 1 ) ]
    const tombStone = new Sprite( frameName )
    tombStone.scale.set( 0.5 )
    tombStone.anchor.set( 0.5, 1 )
    tombStone.name = person.name
    tombStone.isAlive = false
    tombStone.position.x = position.x
    tombStone.position.y = y + 100
    tombStone.destroyMe = function() {
        destroySprite( this )
    }

    killPerson()
    destroySprite( person )

    people.addChild( tombStone )
    recalculateAlivePeople()
}

export const restorePeople = () => {
    aliveCoords.length = 0
    x = appConstants.count.peopleStartX
    y = appConstants.size.HEIGHT

    const toRemove = []
    people.children.forEach( ( person ) => {
        toRemove.push( person )
    })
    toRemove.forEach( (sprite) => {
        destroySprite( sprite )
    })

    for (let i = 0; i < appConstants.count.people; i++) {
        const frameName = peopleFrames[ randomIntFromInterval( 0, peopleFrames.length - 1 ) ]
        const person = new Sprite( frameName )
        console.log(`x${i}: ${x}`)
        person.anchor.set( 0.5, 1 )
        person.name = i
        person.isAlive = true
        person.position.x = x
        person.position.y = y
        x += person.width + 10
        person.destroyMe = function() {
            destroyPerson( this )
        }
        people.addChild( person )
    }

    recalculateAlivePeople()
}

export const getAlivePeoplePositionsX = () => [...aliveCoords]

export const getRandomAlivePersonPositionX = () => {
    const alive = getAlivePeoplePositionsX()
    if (alive.length) return alive[ randomIntFromInterval( 0, alive.length - 1 ) ]
    return null 
}

export const peopleTick = () => {
    people.children.forEach( (person) => {
        if ( person.position.y > y ) person.position.y--
    })
}