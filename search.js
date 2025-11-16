const searchScreen = document.querySelector('#search-screen')


document.querySelector('#search-button').addEventListener('click', () => {
    searchScreen.removeAttribute('hidden')
})

searchScreen.addEventListener('click', (e) => {
    const screen = document.querySelector('#search-popup')
    
    if (!screen.matches(':hover')) {
        searchScreen.setAttribute('hidden', true)
    }
})