import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon-interface';

@Component({
  selector: 'pokemon-card',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  public pokemon = input.required<Pokemon>();

  public readonly pokemonImage = computed(
    () =>
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        this.pokemon().id
      }.png`
  );
}
