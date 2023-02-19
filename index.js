
const container = document.getElementById('container');
const buttonAnimated = document.getElementById('buttonAnimated')

let limitePokemon = 1000;

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
async function addPokemon(id){
    try{
const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/?language=es/`)
const data = await response.json() 
    createPokemon(data)
}
catch(error){
    console.error(error);
} 
}


//iteramos entre los pokemones llamando a la funcion con los datos 
async function pokemon(limitePokemon){
    for(let i = 0; i<=limitePokemon; i++){
    await addPokemon(i)
    }
}

/* imgPokemon.src = poke['sprites']['versions']['generation-v']['black-white']['animated']['front_default']; */



function createPokemon(poke){

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
    imgPokemon.onmouseenter = function(){
        imgPokemon.src = poke.sprites.back_default;
        if(poke.sprites.back_default === null){
            imgPokemon.src = poke.sprites.front_default;
        }
    }
    imgPokemon.onmouseout = function(){
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
        divTypes.classList.add('divTypes' )
    //integramos los o el tipo del pokemon
    poke.types.forEach(type =>{
        

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

pokemon(limitePokemon)


/* buttonAnimated.onclick = (e) => {
    e.preventDefault()
    createPokemonAnimated(pokemon(1));
    
} */
