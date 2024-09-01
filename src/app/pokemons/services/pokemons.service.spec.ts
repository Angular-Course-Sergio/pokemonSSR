import { TestBed } from '@angular/core/testing';
import { PokemonsService } from './pokemons.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Pokemon, PokemonApiResponse } from '../interfaces';
import { catchError } from 'rxjs';

const mockPokemonResponse: PokemonApiResponse = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: '',
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
    },
  ],
};

const expectedPokemons: Pokemon[] = [
  { id: '1', name: 'bulbasaur' },
  { id: '2', name: 'ivysaur' },
];

const mockPokemon = {
  id: 25,
  name: 'pikachu',
};

describe('PokemonsService', () => {
  let service: PokemonsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokemonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load a page of Pokemon', () => {
    service.loadPage(1).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const request = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockPokemonResponse);
  });

  it('should load page 5 of Pokemons', () => {
    service.loadPage(5).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const request = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon?offset=80&limit=20'
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockPokemonResponse);
  });

  it('should load a Pokemon by ID', () => {
    const pokemonId = '25';

    service.loadPokemon(pokemonId).subscribe((pokemon: any) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const request = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockPokemon);
  });

  it('should load a Pokemon by Name', () => {
    const pokemonName = 'pikachu';

    service.loadPokemon(pokemonName).subscribe((pokemon: any) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const request = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockPokemon);
  });

  it('should catch error if pokemon not found', () => {
    const pokemonName = 'yo-no-existo';

    service
      .loadPokemon(pokemonName)

      .pipe(
        catchError((err) => {
          expect(err.message).toContain('Pokemon not found');
          return [];
        })
      )
      .subscribe((pokemon: any) => {
        expect(pokemon).toEqual(mockPokemon);
      });

    const request = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    expect(request.request.method).toBe('GET');

    request.flush('Pokemon not found', {
      status: 404,
      statusText: 'Not Found',
    });
  });
});
