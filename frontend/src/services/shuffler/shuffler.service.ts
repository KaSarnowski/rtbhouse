import { Injectable } from "@angular/core";
import * as seedrandom from 'seedrandom';

@Injectable({
  providedIn: 'root',
})
export class ShufflerService {

  public shuffleSeed<T>(array:T[], seed: string): T[] {
    const rng: seedrandom.PRNG = seedrandom(seed);
    const tempArray: Array<{key: number, data: T}> = [];

    for (const singleRow of array) {
      tempArray.push({
        key: rng(),
        data: singleRow,
      });
    }

    return tempArray.sort((a, b) => a.key - b.key).map((singleRow) => singleRow.data);
  }
}
