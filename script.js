//HAMBURGER MENU

const menu = document.querySelector('.menu')
const menuItems = document.querySelectorAll('.menuItem')
const hamburger = document.querySelector('.hamburger')
const closeIcon = document.querySelector('.closeIcon')
const menuIcon = document.querySelector('.menuIcon')

let toggleMenu = () => {
    if (menu.classList.contains('showMenu')) {
        menu.classList.remove('showMenu')
        closeIcon.style.display = 'none'
        menuIcon.style.display = 'block'
    } else {
        menu.classList.add('showMenu')
        closeIcon.style.display = 'block'
        menuIcon.style.display = 'none'
    }
}

function highlightMenu(event) {
    event.target.classList.add('highlighted')
}

function removeHighlight(event) {
    event.target.classList.remove('highlighted')
}


menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', toggleMenu)
    menuItem.addEventListener('mouseover', highlightMenu)
    menuItem.addEventListener('mouseout', removeHighlight)
})

hamburger.addEventListener('click', toggleMenu)



//FETCHING LIQUOR DATA


const ingredientInfo = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?i='
const drinksList = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='

let drinksDiv = document.querySelector('.drinksDiv')
let liquorDiv = document.querySelector('.liquorDiv')


function displayLiquor(content) {
    let htmlTemplate = `
        <div class='liquorInfo'>
            <h2>${content.strIngredient}</h2>
            <img src='https://www.thecocktaildb.com/images/ingredients/${content.strIngredient}-Medium.png'>
            <p class='abv'>Alcohol By Volume: ${content.strABV}% (${Number(content.strABV)*2} proof)</p>
            <p class='description'>Description: ${content.strDescription}</p>
        </div>
    `
    liquorDiv.innerHTML = htmlTemplate
}


async function fetchLiquors(event) {
    let response = await axios(ingredientInfo + event.target.name)
    displayLiquor(response.data.ingredients[0])
}


//FETCHING DRINKS FUNCTIONS


function displayDrinks(content) {
    let currentDrinks = document.querySelectorAll('.drink')
    currentDrinks.forEach((element) => {
        element.remove()
    })
    content.forEach((drink) => {
        let htmlTemplate = `
            <div class='drink'
                 id='${drink.idDrink}'
                 style='background-image: url(${drink.strDrinkThumb})'>
                <h3>${drink.strDrink}</h3>
            </div>
        `
        drinksDiv.insertAdjacentHTML('beforeend', htmlTemplate)
    })
}

async function fetchDrinks(event) {
    let response = await axios(drinksList + event.target.name)
    displayDrinks(response.data.drinks)
    let modalOpen = document.querySelectorAll('.drink')
    modalOpen.forEach((drink)  => {
        drink.addEventListener('click', fetchModal)
        drink.addEventListener('click', () => {
            modal.classList.toggle('closed')
            modalOverlay.classList.toggle('closed')
        })
    })
}

menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', fetchLiquors)
    menuItem.addEventListener('click', fetchDrinks)
})


//MODAL FUNCTIONALITY


let modal = document.querySelector('#modal')
let modalOverlay = document.querySelector('#modal-overlay')
let modalClose = document.querySelector('.modal-close')
let modalGuts = document.querySelector('.modal-guts')

modalClose.addEventListener('click', () => {
    modal.classList.toggle('closed')
    modalOverlay.classList.toggle('closed')
})




//FETCHING MODAL INFORMATION

let drinksInfo = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='


function displayModal (content) {
    modalGuts.innerHTML = ''
    let htmlTemplate = `
        <img src = '${content.strDrinkThumb}' height='400px' width='350px'>
        <h2>${content.strDrink}</h2>
        <p>${content.strInstructions}</p>
    `
    modalGuts.innerHTML = htmlTemplate
    

    let ingredients = []
    let measurements = []

    let contentData = Object.entries(content)
    contentData.forEach((entry) => {
        if (entry[0].includes('strIngredient')) {
            ingredients.push(entry)        
        }
        if  (entry[0].includes('strMeasure')) {
            measurements.push(entry)
        }
    })

    console.log(ingredients, measurements)
    let ingredientList = document.createElement('ul')
    
    for (let i=0; i<14; i++) {
        if (ingredients[i][1] && measurements[i][1]) {
            let newString = document.createElement('li')
            newString.innerText = `${measurements[i][1]}  ${ingredients[i][1]}`
            ingredientList.append(newString)
        } else if (ingredients[i][1]) {
            let newString = document.createElement('li')
            newString.innerText = ingredients[i][1]
            ingredientList.append(newString)
        } 
    }
    modalGuts.append(ingredientList)
}


async function fetchModal (event) {
    let response = await axios(drinksInfo + event.target.id)
    displayModal(response.data.drinks[0])
}



