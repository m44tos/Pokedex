const pokedexContainer = document.getElementById("pokedex");
const loadMoreButton = document.getElementById("loadMore");

let offset = 0;
const maxPokemonNumber = 151;
let loadedPokemonCount = 0;

// Busca os Pokémons da API
async function fetchPokemons() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        const data = await response.json();

        let loadedPokemons = 0;

        // Itera sobre os resultados e exibe os Pokémons
        for (const pokemon of data.results) {
            const pokemonData = await fetch(pokemon.url).then(response => response.json());

            // Verifica se o ID do Pokémon está dentro do limite
            if (pokemonData.id <= maxPokemonNumber) {
                displayPokemon(pokemonData);
                loadedPokemons += 1;
            }
        }

        // Atualiza a contagem total de Pokémons carregados
        loadedPokemonCount += loadedThisBatch;

        // Desabilita o botão se atingir o número máximo de Pokémons
        if (loadedPokemonCount >= maxPokemonNumber) {
            loadMoreButton.disabled = true;
        }
    } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
    }
}

// Adiciona um evento ao botão "Carregar Mais"
loadMoreButton.addEventListener("click", () => {
    // Verifica se ainda há Pokémon para carregar
    if (offset < maxPokemonNumber) {
        offset += 20;
        fetchPokemons();
    }
});

// Exibe informações dos Pokémons
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

    // Adiciona o card ao contêiner da Pokédex
    pokedexContainer.appendChild(card);
}

// Obtem cor do tipo do Pokémon
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

// Inicia o carregamento dos Pokémons
fetchPokemons();
