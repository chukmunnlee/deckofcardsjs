import { v4 as uuidv4 } from 'uuid'

import {HttpException, Injectable} from "@nestjs/common";

import {Collection, MongoClient} from "mongodb";
import {Game, Pile, Player} from "common/models/game";
import {Card, GetDeckDescriptionByGameId} from "common/models/deck";

@Injectable()
export class GamesRepository {

  private games: Collection<Game>

  set client(_client: MongoClient) {
    this.games = _client.db().collection<Game>('games')
  }

  createGame(game: Game) {
    // @ts-ignore
    return this.games.insertOne({ _id: game.gameId, ...game })
  }

  startGame(gameId: string, password: string) {
    const sessionKey = uuidv4().replaceAll('-', '').substring(8, 16)
    return this.games.updateOne(
      { gameId, password },
      { $set: { 
          started: true, 
          lastUpdate: (new Date()).getTime(),
          sessionKey } 
      }
    ).then(result => result.modifiedCount >= 1)
  }

  addPlayerToGame(gameId: string, player: Player): Promise<boolean> {
    return this.games.updateOne(
      { gameId },
      { $push: { players: player } }
    ).then(result => result.modifiedCount == 1)
  }

  createPile(gameId: string, pileName: string, player = false) {
    const newPile: Pile = {
      name: pileName, cards: [], player: true
    }
    const p = `piles.${pileName}`
    return this.games.updateOne(
      { gameId },
      { $set: { [p]: newPile } }
    )
  }

  removePlayerFromGame(gameId: string, player: Player): Promise<boolean> {
    return this.games.updateOne(
      { gameId }, 
      {
        $pull: {
          players: { name: player.name, password: player.password }
        }
      }
    ).then(result => result.modifiedCount > 0)
  }

  removePlayerFromGameByAdmin(gameId: string, player: Player): Promise<boolean> {
    return this.games.updateOne(
      { gameId, password: player.password }, 
      {
        $pull: {
          players: { name: player.name }
        }
      }
    ).then(result => result.modifiedCount > 0)
  }

  getPlayersByGameId(gameId: string) {
    // @ts-ignore
    return this.games.find<Game[]>({ gameId })
        .project({ _id: 0, "players.name": 1 })
        .toArray()
        .then(results => {
          if (!results.length)
            return []
          return results[0]
        })
  }

  getGameById(gameId: string): Promise<Game> {
    // @ts-ignore
    return this.games.findOne({ _id: gameId })
  }

  deleteGameById(gameId: string, password: string): Promise<boolean> {
    return this.games.deleteOne({ gameId, password })
        .then(result => result.deletedCount > 0)
  }

  getDeckDescriptionFromGameId(gameId: string, ex: HttpException = null) {
    return this.games.aggregate([
      { $match: { gameId } },
      { $lookup: {
          "from": 'decks', 
          foreignField: '_id', 
          localField: 'deckId',
          'as': 'deck'
        }
      },
      {
        $project: {
          _id: 0, gameId: "$gameId", deckId: "$deckId",
          name: { $first: "$deck.metadata.name" },
          description: { $first: "$deck.metadata.description" },
        }
      }
    ]).toArray()
    .then(result => {
      if (!result.length) {
        if (!!ex)
          throw ex
        return undefined
      }
      return result[0] as GetDeckDescriptionByGameId
    })
  }

  getPilesContentByGameId(gameId: string, password: string): Promise<{ pileName: string, cards: string[] }[]> {
    // @ts-ignore
    return this.games.aggregate([
      { $match: { _id: gameId, password } },
      { $project: { allPiles: { $objectToArray: '$piles' } } },
      { $unwind: { path: '$allPiles', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$allPiles.v.cards', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$allPiles.k', cards: { $push: '$allPiles.v.cards.code'} } },
      { $project: { _id: 0, pileName: '$_id', cards: 1 } }
    ]).toArray()
    .then(result => {
      if (!!result.length)
        return result
      return undefined
    })
  }

  getPileContentByNameByGameId (gameId: string, pileName: string, password: string)
      : Promise<{ pileName: string, cards: string[] }[]> {
    const pilePath = `piles.${pileName}`
    // @ts-ignore
    return this.games.aggregate([
      { $match: { _id: gameId, password: password, [pilePath]: { $exists: true } } },
      { $project: { [pilePath]: 1 } },
      { $unwind: { path: `\$${pilePath}.cards`, preserveNullAndEmptyArrays: true } },
      { $group: { _id: `\$${pilePath}.name`, cards: { $push: `\$${pilePath}.cards.code` } } },
      { $project: { _id: 0, pileName: '$_id', cards: 1 } }
    ]).toArray()
    .then(result => {
      if (!!result.length)
        return result
      return undefined
    })
  }

  getGameCount(): Promise<number> {
    return this.games.countDocuments()
  }

  getPileNamesByGameId(gameId: string): Promise<string[]> {
    return this.getGameById(gameId)
        .then(game => !!game? Object.keys(game.piles): [])
  }

  getPileStatusByGameId(gameId: string) {
    return this.getGameById(gameId)
        .then(game => {
          if (!game)
            return [];
          return Object.entries(game.piles)
            .map(value => ({ 
              pileName: value[0],
              remaining: game.piles[value[0]].cards.length 
            }))
        })
  }

  updatePiles(gameId: string, srcPile: string, remain: Card[]
        , dstPile: string = undefined, drawn: Card[] = undefined, discardPile: boolean = false) {
    const updateOper = {
      $set: { [ `piles.${srcPile}.cards` ] : remain }  
    }

    if (!!dstPile)
      updateOper['$push'] = { [ `piles.${dstPile}.cards` ]: { $each: drawn } }

    if (discardPile && (dstPile !== 'discarded')) 
      updateOper['$push'] = { 'piles.discarded.cards' : { $each: drawn } }

    return this.games.updateOne({ gameId }, updateOper)
        .then(result => result.modifiedCount > 0)
  }

  updatePile(gameId: string, pileName: string, cards: Card[]) {
    return this.games.updateOne({ gameId }, 
      {
        $set: { [ `piles.${pileName}.cards` ]: cards }
      }
    ).then(result => result.modifiedCount > 0)
  }

}
