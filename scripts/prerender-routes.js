const TOTAL_POKEMONS = 10;
const TOTAL_PAGES = 5;

(async () => {
  const fs = require("fs");

  const pokemonIds = Array.from({ length: TOTAL_POKEMONS }, (_, i) => i + 1);
  let fileContent = pokemonIds.map((id) => `/pokemons/${id}`).join("\n");

  for (let i = 1; i <= TOTAL_PAGES; i++) {
    fileContent += `\n/pokemons/page/${i}`;
  }

  fs.writeFileSync("routes.txt", fileContent);
})();
