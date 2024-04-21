import {HttpException, Injectable} from "@nestjs/common";

import {Collection, MongoClient} from "mongodb";
import {Game} from "common/models/game";
import {Card} from "common/models/deck";

@Injectable()
export class GamesRepository {

  private games: Collection<Game>

  set client(_client: MongoClient) {
    this.games = _client.db().collection<Game>('games')
  }

  createGame(game: Game, ex: HttpException = null) {
    // @ts-ignore
    return this.games.insertOne({ _id: game.gameId, ...game })
  }

  getGameById(gameId: string): Promise<Game> {
    // @ts-ignore
    return this.games.findOne({ _id: gameId })
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
        console.info('>>>> in here: ', pilePath)
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

}
