import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { Pokemon } from '../../pokemons/interfaces/pokemon-interface';

@Component({
  selector: 'app-pokemons-page',
  standalone: true,
  imports: [CommonModule, PokemonListComponent, PokemonListSkeletonComponent],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit {
  private pokemonsService = inject(PokemonsService);
  public pokemons = signal<Pokemon[]>([]);

  ngOnInit(): void {
    this.loadPokemons();
  }

  public loadPokemons(nextPage: number = 0) {
    this.pokemonsService.loadPage(nextPage).subscribe(this.pokemons.set);
  }
}
