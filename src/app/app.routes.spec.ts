import { TestBed } from '@angular/core/testing';
import { routes } from './app.routes';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to "About" redirects to "/about"', async () => {
    await router.navigate(['about']);
    expect(location.path()).toBe('/about');
  });

  it('should navigate to "Pricing" redirects to "/pricing"', async () => {
    await router.navigate(['pricing']);
    expect(location.path()).toBe('/pricing');
  });

  it('should navigate to "Contact" redirects to "/contact"', async () => {
    await router.navigate(['contact']);
    expect(location.path()).toBe('/contact');
  });

  it('should navigate to "Pokemons" redirects to "/pokemons/page/1"', async () => {
    await router.navigate(['pokemons/page/1']);
    expect(location.path()).toBe('/pokemons/page/1');
  });

  it('should navigate to "Pokemons"  by id redirects to "/pokemons/1"', async () => {
    await router.navigate(['pokemons/1']);
    expect(location.path()).toBe('/pokemons/1');
  });

  it('should redirect to "About" if route does not exist', async () => {
    await router.navigate(['unknown']);
    expect(location.path()).toBe('/about');
  });

  it('should load the proper component', async () => {
    const aboutRoute = routes.find((route) => route.path === 'about')!;
    expect(aboutRoute).toBeDefined();

    const aboutComponent = (await aboutRoute.loadComponent!()) as any;
    expect(aboutComponent.default.name).toBe('AboutPageComponent');

    const pokemonPageRoute = routes.find(
      (route) => route.path === 'pokemons/page/:page'
    )!;
    expect(pokemonPageRoute).toBeDefined();

    const pokemonPage = (await pokemonPageRoute.loadComponent!()) as any;
    expect(pokemonPage.default.name).toBe('PokemonsPageComponent');
  });
});
