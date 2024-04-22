import { Injectable} from "@nestjs/common";
import {Card} from "common/models/deck";
import {GameStatus} from "common/models/game";
import {PatchGameDrawCard} from "common/models/request";
import {PatchGameDrawCardResponse} from "common/models/response";
import {GamesRepository} from "src/repositories/games.repository";
import {shuffle} from "src/utils";

@Injectable()
export class GamesService {

  constructor(private readonly gamesRepo: GamesRepository) { }

  getGameStatus(gameId: string) {
    return this.gamesRepo.getGameById(gameId)
      .then(game => {
        if (!game)
          return undefined
        const gameStatus: GameStatus = {
          gameId: game.gameId,
          deckId: game.deckId,
          count: game.count,
          split: game.split,
          shuffle: game.shuffle, 
          replacement: game.replacement,
          piles: {}
        }
        for (let p in game.piles)
          gameStatus.piles[p] = game.piles[p].cards.length
        return gameStatus
      })
  }

  async drawCard(gameId: string, srcPile: string, dstPile: string
        , patchReq: PatchGameDrawCard): Promise<PatchGameDrawCardResponse> {

    const game = await this.gamesRepo.getGameById(gameId)
    const fromPile = !!srcPile.match(/^pile[0-9]+$/)

    if (!(game && (srcPile in game.piles)))
      return { pileName: srcPile, remaining: 0, drawn: [] }

    const toPile = !!dstPile.match(/^pile[0-9]+$/)

    if (toPile && !(dstPile in game.piles))
      throw `Cannot create pile ${dstPile}`

    let drawn: Card[] = []
    let remain: Card[] = []

    if (patchReq?.codes.length > 0) {
      // Get code from pile
      remain = [ ...game.piles[srcPile].cards ]

    outer: 
      for (let code of patchReq.codes) {
        for (let i = 0; i < remain.length; i++) {
          const card = remain[i]
          if (code.toLowerCase() == card.code.toLowerCase()) {
            drawn.push(card)
            remain.splice(i, 1)
            if (drawn.length == patchReq.codes.length)
              break outer
            else
              break
          }
        }
      }
    } else if (patchReq?.positions.length > 0) {
      // Get cards from location
      // Select cards from pile
      for (let i = 0; i < game.piles[srcPile].cards.length; i++) {
        const card = game.piles[srcPile].cards[i]
        if (i in patchReq.positions) {
          drawn.push(card)
          if (drawn.length == patchReq.positions.length)
            break
        } else 
          remain.push(card)
      }

    } else {
      // Draw with position
      let selectedIdx: number[] = []
      let idxs: number[] = Array.from({ length: game.piles[srcPile].cards.length }, (_, i) => i)
      switch (patchReq.location) {
        case 'bottom':
          const start = game.piles[srcPile].cards.length - patchReq.count
          selectedIdx = idxs.slice(start, start + patchReq.count)
          break
        case 'random':
          shuffle(idxs)
        case 'top':
        default:
          selectedIdx = idxs.slice(0, patchReq.count)
      }

      // Select cards from pile
      for (let i = 0; i < game.piles[srcPile].cards.length; i++) {
        const card = game.piles[srcPile].cards[i]
        if (i in selectedIdx)
          drawn.push(card)
        else 
          remain.push(card)
      }
    }
    
    // Only replace cards from pile[0-9]+
    if (fromPile && game.replacement) {
      remain = game.piles[srcPile].cards
      shuffle(remain)
    }

    const updated = await this.gamesRepo.updatePiles(gameId, srcPile, remain, dstPile, drawn)
    if (!updated)
      return Promise.reject(`Cannot update game ${gameId}`)

    return { pileName: srcPile, remaining: remain.length, drawn }
  }
}
