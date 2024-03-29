import {Injectable} from "@nestjs/common";
import {Collection, MongoClient} from "mongodb";
import {Deck} from "src/models/deck";

@Injectable()
export class DecksService {

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
}
