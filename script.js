const APIURL = "";
const poke_container = document.getElementById("poke-container");
const loadBtn = document.getElementById("loadMoreBtn");

const pokemon_count = 50;

var currentNoOfPokemons = pokemon_count;

const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

prepareModal();
fetchPokemons();

async function fetchPokemons() {
  for (let i = 1; i <= pokemon_count; i++) {
    await getPokemon(i);
  }
}

loadBtn.addEventListener("click", async () => {
  for (let i = currentNoOfPokemons + 1; i <= currentNoOfPokemons + 50; i++) {
    await getPokemon(i);
  }
  currentNoOfPokemons += 50;
});

async function getPokemon(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  const url2 = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const res2 = await fetch(url2);
  const data2 = await res2.json();

  var chineseName = "";
  data2.names.forEach((lan) => {
    if (lan.language.name === "zh-Hans") {
      chineseName = lan.name;
    }
  });

  if (id === 1) {
    console.log("data :>> ", data);
    console.log("data2 :>> ", data2);
    console.log("chineseName :>> ", chineseName);
  }

  createPokemonCard(data, chineseName, id);
}

function stat(name, value, tooltip) {
  const maxValue = 150;
  var valueCalc = Math.min((value / maxValue) * 100, 100);
  var html = "";
  html = `<div title="${tooltip}" class="stat">
        <div class="stat-name">${name}</div>
        <div class="stat-value-back"><div class="stat-value-bar stat-${name}" style="width:${valueCalc}%;"></div></div>
        <div class="stat-value">${value}</div>
    </div>`;
  return html;
}

function createPokemonCard(pokemon, chineseName, idNo) {
  const card = document.createElement("div");
  card.classList.add("pokemon");
  card.id = `Pokemon${idNo}`;

  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id.toString().padStart(3, "0");
  const poke_types = pokemon.types.map((type) => type.type.name);
  const color = colors[poke_types[0]];
  //console.log('poke_types :>> ', poke_types);
  //console.log('color :>> ', color);
  card.style.backgroundColor = color;

  const imageUrl =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  // const imageUrl = 'https://pokeres.bastionbot.org/images/pokemon/'
  card.innerHTML = `
    <div class="fix-number">#${id}</div>
    <div class="img-container">
    <img class="img" src="${imageUrl}${pokemon.id}.png" alt="">
    </div>
    <div class="info">
    <h3 class="name">${name}</h3>
    <h3 class="nameCN">${chineseName}</h3>
    <div class="stats hide">
    ${stat("HP", pokemon.stats[0].base_stat, "Hitpoints")}
    ${stat("AT", pokemon.stats[1].base_stat, "Attack")}
    ${stat("DE", pokemon.stats[2].base_stat, "Defense")}
    ${stat("SA", pokemon.stats[3].base_stat, "Special attack")}
    ${stat("SD", pokemon.stats[4].base_stat, "Special defense")}
    ${stat("SP", pokemon.stats[5].base_stat, "Speed")}
    </div>
    <small class="type">Type: <span>${poke_types[0]}</span></small>
    </div>`;
  // <span class="number">#${id}</span>

  poke_container.appendChild(card);

  card.addEventListener("click", (e) => {
    openPokemonDetails(e, idNo);
  });
}

function openPokemonDetails(e, idNo) {
  console.log("You have clicked - " + idNo);

  //get pokemon data and apply to modal

  const pokemonElement = document.getElementById(`Pokemon${idNo}`);
  document.getElementById("modal-id").innerText = "#" + idNo.toString().padStart(3, "0");
  document.getElementById("modal-img").src = pokemonElement.querySelector(".img").src;
  document.querySelector(".poke-card").setAttribute("style", pokemonElement.getAttribute("style"));
  // document.getElementById('modal-name').innerText = pokemonElement.querySelector('.name').innerText;
  // document.getElementById('modal-chineseName').innerText = pokemonElement.querySelector('.nameCN').innerText;
  document.getElementById("modal-info").innerHTML = pokemonElement.querySelector(".info").innerHTML;
  document.querySelector("#modal-info > .stats").classList.remove("hide");
  //feed modal data

  const goToDBBtn = document.createElement("a");
  goToDBBtn.innerText = "Open Pokemon Wiki";
  goToDBBtn.classList.add("open-pokeDB-btn");
  goToDBBtn.href = `https://pokemon.fandom.com/wiki/${
    pokemonElement.querySelector(".info").querySelector(".name").innerText
  }`;
  goToDBBtn.target = "_blank";
  document.getElementById("modal-info").append(goToDBBtn);

  //display modal
  document.getElementById("modal-details").classList.remove("hide");
}

function prepareModal() {
  document.querySelector(".modal-backdrop").addEventListener("click", () => {
    document.getElementById("modal-details").classList.add("hide");
  });
}
/* <div class="pokemon" style="background-color: rgb(222,253,224);">
<div class="img-container">
  <img src="https://pokeres.bastionbot.org/images/pokemon/1.png" alt="">
</div>
<div class="info">
  <span class="number">#001</span>
  <h3 class="name">Buldasaur</h3>
  <small class="type">Type: <span>grass</span></small>
</div>
</div> */
