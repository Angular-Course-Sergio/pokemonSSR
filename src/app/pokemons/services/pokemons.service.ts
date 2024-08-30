import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Pokemon, PokemonAPiResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private http = inject(HttpClient);

  public loadPage(page: number): Observable<Pokemon[]> {
    if (page !== 0) --page;

    page = Math.max(0, page);

    return this.http
      .get<PokemonAPiResponse>(
        `https://pokeapi.co/api/v2/pokemon?offset=${page * 20}&limit=20`
      )
      .pipe(
        map((resp) => {
          const pokemons = resp.results.map((pokemon) => ({
            id: pokemon.url.split('/').at(-2) ?? '',
            name: pokemon.name,
          }));

          return pokemons;
        })
      );
  }
}
