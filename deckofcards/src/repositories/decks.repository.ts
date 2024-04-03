import {HttpException, Injectable} from "@nestjs/common";
import {Collection, MongoClient} from "mongodb";
import { Deck, DeckSummary} from "common/models/deck";

@Injectable()
export class DecksRepository {

  private decks: Collection<Deck>

  set client(_client: MongoClient) {
    this.decks = _client.db().collection<Deck>('decks')
  }

  drop(): Promise<boolean> {
    return this.decks.drop()
  }

  load(decks: Deck[]): Promise<any> {
    const _decks = decks.map(deck => ({ ...deck, _id: deck.metadata.id }))
    return this.decks.insertMany(_decks)
  }

  countDecks(): Promise<number> {
    return this.decks.countDocuments()
  }

  getDecksSummary(): Promise<DeckSummary[]> {
    return this.decks.find({})
      .project({ 'metadata.name': 1, 'metadata.description': 1 })
      .toArray()
      .then(results => 
        results.map(d => ({
          deckId: d['_id'],
          name: d['metadata']['name'],
          description: d['metadata']['description']
        } as DeckSummary))
      )
  }

  findDeckById(deckId: string, ex: HttpException = null): Promise<Deck | null> {
    return this.decks.findOne<Deck>({ _id: deckId })
      .then(result => {
        if (null == result) {
          if (!!ex) throw ex
          return null
        }
        return result
      })
  }

  findDeckByName(name: string, ex: HttpException): Promise<Deck | null> {
    return this.decks.findOne<Deck>({ 'metadata.name': { $regex: name, $options: 'i' }  })
      .then(result => {
        if (null == result) {
          if (!!ex) throw ex
          return null
        }
        return result
      })
  }

  getBackImageById(deckId: string, ex: HttpException = null): Promise<string | null> {
    return this.findDeckById(deckId, ex)
      .then(result => result.spec.backImage)

  }
}
