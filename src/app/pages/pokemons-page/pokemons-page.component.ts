import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { Pokemon } from '../../pokemons/interfaces/pokemon-interface';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';

@Component({
  selector: 'app-pokemons-page',
  standalone: true,
  imports: [
    CommonModule,
    PokemonListComponent,
    PokemonListSkeletonComponent,
    RouterLink,
  ],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent {
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private pokemonsService = inject(PokemonsService);

  public pokemons = signal<Pokemon[]>([]);
  public currentPage = toSignal<number>(
    this.route.params.pipe(
      map((params) => params['page'] ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  public loadOnPageChanged = effect(
    () => {
      this.loadPokemons(this.currentPage());
    },
    {
      allowSignalWrites: true,
    }
  );

  public loadPokemons(page: number = 0) {
    const pageToLoad = page;

    this.pokemonsService
      .loadPage(pageToLoad)
      .pipe(tap(() => this.title.setTitle(`Pokemons SSR - Page ${pageToLoad}`)))
      .subscribe(this.pokemons.set);
  }
}
