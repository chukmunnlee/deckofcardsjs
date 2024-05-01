import { v4 as uuidv4 } from 'uuid'
import {BadRequestException, Injectable, NotFoundException, ServiceUnavailableException} from "@nestjs/common";
import {DecksRepository} from "src/repositories/decks.repository";
import {ConfigService} from "./config.service";
import {GamesRepository} from "src/repositories/games.repository";
import {constructDeck, shuffle} from "src/utils";
import {Game, Pile} from "common/models/game";
import { Deck } from "common/models/deck";
import {PostDeckById} from "common/models/request";

@Injectable()
export class DecksService {

  constructor(private readonly decksRepo: DecksRepository, private readonly gamesRepo: GamesRepository
      , private readonly configSvc: ConfigService) { }

  async createGame(form: PostDeckById): Promise<Game> {

    const gameCount  = await this.gamesRepo.getGameCount()
    if (gameCount > this.configSvc.games)
      throw new ServiceUnavailableException("Exceeded number of game instance supported on the server")

    let deck: Deck = null
    if (!!form.deckId)
      deck = await this.decksRepo.findDeckById(form.deckId
          , new NotFoundException(`Cannot find deck ${form.deckId}`))
    else if (!!form.name)
      deck = await this.decksRepo.findDeckByName(form.name
          , new NotFoundException(`Cannot find deck ${form.name}`))
    else
      throw new BadRequestException("Missing deckId or deck name")

    const options: PostDeckById = {
      deckId: '', 
      name: '', 
      count: 1, 
      split: 1, 
      shuffle: true, 
      replacement: false,
      ...form
    }

    const cards = constructDeck(deck.spec.cards, options.count, options.shuffle)

    if (options.shuffle)
      shuffle(cards)

    let piles: { [ name: string ]: Pile } = {
      discarded: { name: 'discarded', cards: [] }
    }
    let cardsPerPile = Math.ceil(cards.length / options.split)
    for (let i = 0; i < options.split; i++) {
      const name = `pile${i}`
      const start = i * cardsPerPile
      piles[name] = { name, cards: cards.slice(start, start + cardsPerPile) }
    }

    const time = (new Date()).getTime()
    const id = uuidv4().replaceAll('-', '')
    const game: Game = {
      gameId: id.substring(0, 8),
      deckId: deck.metadata.id,
      password: id.substring(8),
      piles,
      createdOn: time,
      lastUpdate: time,
      count: options.count,
      split: options.split,
      shuffle: options.shuffle,
      replacement: options.replacement,
      started: false,
      players: []
    }

    return this.gamesRepo.createGame(game).then(() => game)
  }

}
