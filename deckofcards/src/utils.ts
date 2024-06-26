import { join } from 'node:path'
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import * as yaml from 'js-yaml'
import {Card, Deck, DeckPresets} from 'common/models/deck'
import {MongoClient} from 'mongodb'
import {PileAttribute} from 'common/models/request'

const PRESETS_DEFAULT:  DeckPresets = {
  count: 1, split: 1, shuffle: true, replacement: false
}

export const loadDecks = (decksDir: string): Deck[] => {

  if (!existsSync(decksDir)) {
    console.error(`Decks directory does not exists: ${decksDir}`)
    process.exit(-1)
  }

  console.info(`Loading decks from ${decksDir}`)

  return readdirSync(decksDir)
    .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
    .map(f => join(decksDir, f))
    .map(f => {
        const deck = yaml.load(readFileSync(f, 'utf-8')) as Deck
        if (!deck.spec.presets)
          deck.spec.presets = PRESETS_DEFAULT
        else
          deck.spec.presets = {
            ...PRESETS_DEFAULT,
            ...deck.spec.presets
          }
        console.info(`[Loading] Id: ${deck.metadata.id}, Kind: ${deck.kind}, Name: ${deck.metadata.name}`)
        return deck
    })
}

export const createDatabaseConnection = (uri: string) => {
  return new MongoClient(uri)
}

export const constructDeck = (cards: Card[], count = 1, rand = true) => { 
  const deck: Card[] = []
  for (let c of cards) {
    const _c: Card = { count: 1, ...c }
    for (let i = 0; i < _c.count; i++)
      deck.push({ ...c } as Card)
  }

  let deckInst: Card[] = []
  for (let i = 0; i < count; i++)
    deckInst = [...deckInst, ...deck ]

  if (rand)
    shuffle(deckInst)
  return deckInst
}

export const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
}

export const toBoolean = (full: string) => {
    let _full = false
    if (full != undefined)
      _full = full.trim().toLowerCase() === 'true' || (full === '') 
    return _full
  }

export const toString = (str: string, defValue = '') => !str? defValue: str

export const emptyObject = (o: PileAttribute) => {
  if (Object.keys(o).length > 0)
    return o
  return undefined
}

