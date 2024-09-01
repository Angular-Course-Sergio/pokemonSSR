import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Pokemon, PokemonApiResponse, PokemonResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private http = inject(HttpClient);

  public loadPage(page: number): Observable<Pokemon[]> {
    if (page !== 0) --page;

    page = Math.max(0, page);

    return this.http
      .get<PokemonApiResponse>(
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

  public loadPokemon(id: string): Observable<PokemonResponse> {
    return this.http
      .get<PokemonResponse>(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) console.log('An error ocurred: ', error.error);
    else
      console.log(
        `Backend returned code ${error.status}, body: ${error.error}`
      );

    const errorMenssage = error.error ?? 'An error occurred';
    return throwError(() => new Error(errorMenssage));
  }
}
