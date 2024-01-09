const pokedexContainer = document.getElementById("pokedex");
const loadMoreButton = document.getElementById("loadMore");

let offset = 0;
const maxPokemonNumber = 151;
let loadedPokemonCount = 0;

async function fetchPokemons() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    const data = await response.json();

    let loadedThisBatch = 0;

    for (const pokemon of data.results) {
        const pokemonData = await fetch(pokemon.url).then(response => response.json());

        if (pokemonData.id <= maxPokemonNumber) {
            // Exibe apenas Pokémon da primeira geração
            displayPokemon(pokemonData);
            loadedThisBatch += 1;
        }
    }

    loadedPokemonCount += loadedThisBatch;

    if (loadedPokemonCount >= maxPokemonNumber) {
        loadMoreButton.disabled = true;
    }
}


loadMoreButton.addEventListener("click", () => {
    if (offset < maxPokemonNumber) {
        offset += 20;
        fetchPokemons();
    }
});

function displayPokemon(pokemon) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);

    card.innerHTML = `
    <div class="textContainer">
        <h3 class="name">${pokemon.name}</h3>
        <p class="type">${pokemon.types.map(type => type.type.name).join(" / ")}</p>
    </div>
    <div class="imgContainer">
        <img class="image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p class="id">#${pokemon.id}</p>
    </div>

    `;

    pokedexContainer.appendChild(card);
}

function getTypeColor(type) {
    const typeColors = {
        "grass": "#9bcc50",
        "fire": "#fd7d24",
        "poison": "#b97fc9",
        "water": "#4592c4",
        "bug": "#729f3f",
        "normal": "#a4acaf",
        "flying": "#bdb9b8",
        "electric": "#eed535",
        "ground": "#ab9842",
        "fairy": "#fdb9e9",
        "fighting": "#d56723",
        "psychic": "#f366b9",
        "rock": "#a38c21",
        "steel": "#9eb7b8",
        "ghost": "#7b62a3",
        "ice": "#51c4e7",
        "dragon": "#f16e57",
    };

    return typeColors[type] || "#A8A878";
}


fetchPokemons();
