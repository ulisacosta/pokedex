
const container = document.getElementById('container');
const buttonAnimated = document.getElementById('buttonAnimated')
const buscarPokemon = document.getElementById('buscarPokemon');
let mostrandoPokemon = false;
let busquedaActiva = false;

function removeChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function removeDivs() {
    const divsPokemonBuscados = document.querySelectorAll(".divPokemonBuscado");
    divsPokemonBuscados.forEach(div => div.remove());
}

let limitePokemon = 100;


const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    default: '#2A1A1F',
    fairy: '#FFFFFF',
    dark: '#FFFFFF'
};

//llamamos a la API para conseguir los datos
async function addPokemon(id) {

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/?language=es/`)
        const data = await response.json()
        createPokemon(data)
    }
    catch (error) {
        console.error(error);
    }
}

//iteramos entre los pokemones llamando a la funcion con los datos 
async function pokemon(limitePokemon) {
    for (let i = 0; i <= limitePokemon; i++) {
        if (busquedaActiva) {
            break;
        }
        await addPokemon(i)
    }
}

/* imgPokemon.src = poke['sprites']['versions']['generation-v']['black-white']['animated']['front_default']; */



function createPokemon(poke) {

    //creamos el container en el que van a estar los pokemones
    const card = document.createElement('div')
    card.classList.add('card');

    //creamos el div para la imagen    
    const divImg = document.createElement('div')
    divImg.classList.add('divImg');

    //integramos el div con la imagen al caontainer 
    card.appendChild(divImg);

    //agregamos la imagen del pokemon
    const imgPokemon = document.createElement('img');
    imgPokemon.classList.add('imgPoke')
    imgPokemon.src = poke.sprites.front_default;
    imgPokemon.onmouseenter = function () {
        imgPokemon.src = poke.sprites.back_default;
        if (poke.sprites.back_default === null) {
            imgPokemon.src = poke.sprites.front_default;
        }
    }
    imgPokemon.onmouseout = function () {
        imgPokemon.src = poke.sprites.front_default;
    }

    /* imgPokemon.src = poke.sprites.other.home.front_default;*/
    /* imgPokemon.src = poke.sprites.other.dream_world.front_default;*/

    //integramos la imagen del pokemon al div
    divImg.appendChild(imgPokemon)

    const card2 = document.createElement('div')
    card2.classList.add('card2');

    card.appendChild(card2)

    //Se agrega el ID del pokemon
    const idPokemon = document.createElement("p");
    idPokemon.classList.add('idPokemon')
    idPokemon.textContent = `#${poke.id.toString().padStart(3, 0)}`;

    //creamos el elemento en el cual va a estar el nombre
    const name = document.createElement("p")
    name.classList.add('name');
    name.textContent = poke.name;


    //Agrego el elemento del ID del pokemon al card
    card2.appendChild(idPokemon)

    //integramos el nombre al container
    card2.appendChild(name);

    const divTypes = document.createElement('div')
    divTypes.classList.add('divTypes')
    //integramos los o el tipo del pokemon
    poke.types.forEach(type => {

        const typePoke = document.createElement("p")
        typePoke.classList.add("typePoke");
        typePoke.textContent = type.type.name;
        typePoke.style.background = typeColors[type.type.name];

        card2.appendChild(divTypes)
        card2.appendChild(typePoke)
        divTypes.appendChild(typePoke)
    })



    //integramos el container que va a tener los elementos del pokemon en el container principal
    container.appendChild(card)

}


//Buscador de pokemones //

buscarPokemon.addEventListener("input", async function () {

    const valorBusqueda = buscarPokemon.value.trim().toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon?limit=800&offset=0`

    mostrandoPokemon = false;

    if (valorBusqueda.length < 2) {
        busquedaActiva = true;
        removeChildNodes(container)
    }
    if (valorBusqueda.length === 0) {
        busquedaActiva = false;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => mostrarResultadosBusqueda(data, valorBusqueda))
        .catch(error => console.error(error));
});



async function mostrarResultadosBusqueda(data, valorBusqueda) {

    if (valorBusqueda.trim() === "" || valorBusqueda.trim().length === 1) {
        removeDivs();
        mostrandoPokemon = false;
        pokemon(limitePokemon)
        return;
    }

    const pokemones = data.results;

    const pokemonesFiltrados = pokemones.filter(pokemon => pokemon.name.startsWith(valorBusqueda));


    removeChildNodes(container)

    if (pokemonesFiltrados.length === 0) {
       
        removeDivs();

        const divMensaje = document.createElement("div")
        divMensaje.classList.add("divMensaje");
        divMensaje.classList.add("animate__animated");
        divMensaje.classList.add("animate__swing");
        
        const mensaje = document.createElement("p");
        mensaje.textContent = "No se encontraron resultados para la busqueda";
        mensaje.classList.add("mensaje")

        container.appendChild(divMensaje);
        divMensaje.appendChild(mensaje);
        return;
    }

    else if (pokemonesFiltrados.length === 1) {
        
        const primerPokemonFiltrados = pokemonesFiltrados[0];
        const url = primerPokemonFiltrados.url;

        if (!mostrandoPokemon) {
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    mostrarPokemon(data);
                    
                    mostrandoPokemon = true;
                })
                .catch(error => console.error(error));

        }
    }



    else {
       
        mostrandoPokemon = false;

        removeDivs()

        pokemonesFiltrados.forEach(pokemon => {
            const url = pokemon.url;
            fetch(url)
                .then(response => response.json())
                .then(data => createPokemon(data))
                .catch(error => console.error(error));
        });

    }
}




//Muestra el pokemon cuando coincide con uno solo en la búsqueda
function mostrarPokemon(pokemon) {


    const nombre = pokemon.name;
    const imagenAnimated = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    const imagenDefault = pokemon.sprites.front_default;
    removeDivs()

    //div para la carta del pokemon
    const divPokemonBuscado = document.createElement("div");
    divPokemonBuscado.classList.add('divPokemonBuscado')
    divPokemonBuscado.classList.add("animate__animated");
    divPokemonBuscado.classList.add("animate__zoomInDown");
    

    const divImgBuscado = document.createElement('div')
    divImgBuscado.classList.add('divImgBuscado');

    //imagen del pokemon 
    const imgPokemonBuscado = document.createElement('img')
    imgPokemonBuscado.classList.add('imgPokemonBuscado')
    if (imagenAnimated === null) {
        imgPokemonBuscado.src = imagenDefault;
        imgPokemonBuscado.onmouseenter = function () {
            imgPokemonBuscado.src = pokemon.sprites.back_default;
            if (pokemon.sprites.back_default === null) {
                imgPokemonBuscado.src = imagenDefault;
            }
        }
        imgPokemonBuscado.onmouseout = function () {
            imgPokemonBuscado.src = imagenDefault;
        }
    }
    else {
        imgPokemonBuscado.src = imagenAnimated;
    }

    if (imagenAnimated != null) {
        imgPokemonBuscado.onmouseenter = function () {

            imgPokemonBuscado.src = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['back_default'];

            if (pokemon['sprites']['versions']['generation-v']['black-white']['animated']['back_default'] === null) {
                imgPokemonBuscado.src = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
            }
        }

        imgPokemonBuscado.onmouseout = function () {
            imgPokemonBuscado.src = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        }
    }



    divImgBuscado.appendChild(imgPokemonBuscado)

    //creamos div para el nombre del pokemon 
    const detallePokemonBuscado = document.createElement("div");
    detallePokemonBuscado.classList.add('detallePokemonBuscado')

    //creamos div para las propiedades del pokemon
    const propiedadesPokemonBuscado = document.createElement("div");
    propiedadesPokemonBuscado.classList.add('propiedadesPokemonBuscado')

     //AGREGA EL ID DEL POKEMON BUSCADO AL PRIMER DIV
     const idPokemonBuscado = document.createElement("p");
     idPokemonBuscado.classList.add('idPokemonBuscado')
     idPokemonBuscado.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

     detallePokemonBuscado.appendChild(idPokemonBuscado);

    //AGREGA EL NOMBRE DEL POKEMON BUSCADO AL PRIMER DIV
    const nombrePokemon = document.createElement("p")
    nombrePokemon.classList.add("nombrePokemon")
    nombrePokemon.textContent = nombre;
    detallePokemonBuscado.appendChild(nombrePokemon);

    const divTypes = document.createElement('div')
    divTypes.classList.add('divTypes')

    //integramos los o el tipo del pokemon
    pokemon.types.forEach(type => {
        const typePoke = document.createElement("p")
        typePoke.classList.add("typePoke");
        typePoke.textContent = type.type.name;
        typePoke.style.background = typeColors[type.type.name];

        detallePokemonBuscado.appendChild(divTypes)
        detallePokemonBuscado.appendChild(typePoke)
        divTypes.appendChild(typePoke)
    })

    if (pokemon.types.length === 1) {
        detallePokemonBuscado.style.background = `rgba(31, 33, 34, 0.8);`
        propiedadesPokemonBuscado.style.background = `${typeColors[pokemon.types[0].type.name]}`
    }
    else {
        detallePokemonBuscado.style.background = `rgba(31, 33, 34, 0.8);`;
        propiedadesPokemonBuscado.style.background = `linear-gradient(to top,${typeColors[pokemon.types[0].type.name]},${typeColors[pokemon.types[1].type.name]})`;

    }

    
    
    const divContainerPropiedades = document.createElement("div")
    divContainerPropiedades.classList.add("divContainerPropiedades")
    
    const divTamaño = document.createElement("div")
    divTamaño.classList.add("divTamaño")


    const titleTamaño = document.createElement("p")
    titleTamaño.classList.add("titleTamaño")
    titleTamaño.textContent="SIZES"
    
    const peso = document.createElement("p")
    peso.classList.add("peso");
    peso.textContent = "WEIGHT :" + " " +pokemon.weight;
    
    const altura = document.createElement("p")
    altura.classList.add("altura");
    altura.textContent = "HEIGHT :" +" " + pokemon.height;
    
    divTamaño.appendChild(titleTamaño)
    divTamaño.appendChild(peso)
    divTamaño.appendChild(altura)

    const divStats = document.createElement("div")
    divStats.classList.add("divStats")


    /* ELEMENTO PARA MOSTRAR EL TITULO DE LAS ESTADISTICAS */
    const titleStats = document.createElement("p");
    titleStats.classList.add("titleStats");
    titleStats.textContent = "STATS";

    divStats.appendChild(titleStats);


    pokemon.stats.forEach(stat =>{
    const stats = document.createElement("p")
    stats.classList.add("stats")
    stats.textContent = `${stat.stat.name}:${stat.base_stat}`;
    divStats.appendChild(stats)
})

    const divMove = document.createElement("div")
    divMove.classList.add("divMove")

    /* ELEMENTO PARA MOSTRAR EL TITULO DE LOS MOVIMIENTOS */
    const titleMove = document.createElement("p");
    titleMove.classList.add("titleMove");
    titleMove.textContent = "SOME MOVES";

    divMove.appendChild(titleMove);

    for (let i = 0; i < 4; i++) {
        const move = pokemon.moves[i];
    const moves = document.createElement("p")
    moves.classList.add("move")
    moves.textContent = move.move.name;
    divMove.appendChild(moves)
}

    propiedadesPokemonBuscado.appendChild(divContainerPropiedades)
    
    divContainerPropiedades.appendChild(divTamaño)
    divContainerPropiedades.appendChild(divStats)
    divContainerPropiedades.appendChild(divMove)

    divPokemonBuscado.appendChild(divImgBuscado)
    divPokemonBuscado.appendChild(detallePokemonBuscado)
    divPokemonBuscado.appendChild(propiedadesPokemonBuscado)
    //integramos el div en el body 
    document.body.appendChild(divPokemonBuscado);
}






pokemon(limitePokemon)