
const container = document.getElementById('container');

//llamamos a la API para conseguir los datos
function addPokemon(id){
fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
.then(res => res.json())
.then(data => 
    createPokemon(data))
}

//iteramos entre los pokemones llamando a la funcion con los datos 
function pokemon(num){
    for(let i = 0; i<=num; i++){
    addPokemon(i)
    }
}

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
    imgPokemon.src = poke.sprites.other.home.front_default;

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

    //integramos el container que va a tener los elementos del pokemon en el container principal
    container.appendChild(card)
    
}

pokemon(100)