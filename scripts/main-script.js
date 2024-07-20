const baseUrl = "https://www.omdbapi.com/?&apikey=370610da"
let watchlistArray = localStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : []


const searchInput = document.getElementById("s-input")
const suggestionsContainer = document.getElementById("suggestions")
const btnEl = document.getElementById("s-btn")
const mainEl = document.getElementById("main")
const loadingModal = document.getElementById('loadingModal')


document.addEventListener("click", function (e) {
    if (e.target.dataset && e.target.dataset.imdb && e.target.dataset.add === "0") {
        const imdbId = e.target.dataset.imdb
        const movieDiv = document.querySelector(`#movie-${imdbId}`)

        const addToWatchListEl = movieDiv.querySelector('.div2 h6').childNodes[1]
        addToWatchListEl.innerHTML = `<img src="/img/icons/added.svg" alt="added icon" />&nbsp;Added`
        addToWatchListEl.dataset.imdb = imdbId
        addToWatchListEl.dataset.add = "1"

        const poster = movieDiv.querySelector('.div1 img').src
        const title = movieDiv.querySelector('.div2 h5').childNodes[0].textContent.trim()
        const rating = movieDiv.querySelector('.div2 h5 span').textContent.trim()
        const runtime = movieDiv.querySelector('.div2 h6').textContent.split(/\s{2,}/)[0].trim()
        const genre = movieDiv.querySelector('.div2 h6').textContent.split(/\s{2,}/)[1].trim()
        const plot = movieDiv.querySelector('.div2 p').textContent.trim()

        const movieData = {
            imdbId,
            poster,
            title,
            rating,
            runtime,
            genre,
            plot
        }

        watchlistArray.push(movieData)

        localStorage.setItem('watchlist', JSON.stringify(watchlistArray))

    }
})


searchInput.addEventListener("input", async () => {
    suggestionsContainer.style.display = "none"
    const query = searchInput.value
    if (query.length > 0) {
        const suggestions = await fetchSuggestions(query)
        displaySuggestions(suggestions.slice(0, 5))
    }
})

btnEl.addEventListener("click", () => {
    const query = searchInput.value
    suggestionsContainer.style.display = "none"
    if (query.length > 2) {
        loadingModal.style.display = 'flex'
        fetchMovies(query)
    }
    else if (query.length > 0) {
        mainEl.innerHTML = `<h3>Search query must be at least 3 characters long</h3>`
    }
    suggestionsContainer.style.display = "none"
})

searchInput.addEventListener('keydown', (event) => {
    if (searchInput.value.length > 0 && event.key === 'Enter') {
        const query = searchInput.value
        suggestionsContainer.style.display = "none"
        if (query.length > 2) {
            loadingModal.style.display = 'flex'
            fetchMovies(query)
        }
        else if (query.length > 0) {
            mainEl.innerHTML = `<h3>Search query must be at least 3 characters long</h3>`
        }
        suggestionsContainer.style.display = "none"
    }
})


suggestionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("suggestion-item")) {
        searchInput.value = e.target.textContent
        suggestionsContainer.style.display = "none"
        loadingModal.style.display = 'flex'
        fetchMovies(e.target.textContent)
        suggestionsContainer.style.display = "none"
    }
})

async function fetchSuggestions(query) {
    const response = await fetch(`${baseUrl}&s=${query}`)
    const data = await response.json()
    return data.Search || []
}

async function fetchMovies(query) {
    suggestionsContainer.style.display = "none"
    const response = await fetch(`${baseUrl}&s=${query}`)
    const data = await response.json()
    if (data.Response === "False") {
        mainEl.innerHTML = `<h3>Unable to find what you’re looking for. Please try another search</h2>`
        loadingModal.style.display = 'none'
        return
    }
    else {
        const movies = data.Search

        const htmlMovies = await Promise.all(movies.map(async (movie) => {
            const id = movie.imdbID
            const res = await fetch(`${baseUrl}&i=${id}`)
            const mov = await res.json()

            const title = mov.Title
            const rating = mov.imdbRating
            const runtime = mov.Runtime
            const genre = mov.Genre
            const plot = mov.Plot
            const poster = mov.Poster

            const addValue = watchlistArray.some(movie => movie.imdbId === id)

            const addNumber = addValue ? "1" : "0"
            const addLoc = addValue ? "/img/icons/added.svg" : "/img/icons/add.svg"
            const addText = addValue ? "Added" : "Watchlist"

            if (mov.Poster === "N/A") {
                return " "
            }

            return `
                    <div class="movie" id="movie-${id}">
                        <div class="div1">
                            <img src="${poster}" alt="${title}">
                        </div>
                        <div class="div2">
                            <h5>${title}&nbsp;&nbsp;&nbsp;<span><img src="/img/icons/star.svg" />&nbsp;${rating}<span></h5>
                            <h6>${runtime}&nbsp;&nbsp;&nbsp;&nbsp;${genre}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span data-imdb="${id}" data-add=${addNumber}><img src=${addLoc} alt="watchlist icon" />&nbsp;${addText}</span></h6>
                            <p>${plot}</p>
                        </div>
                    </div>`
        }))

        mainEl.innerHTML = htmlMovies.join("")
        loadingModal.style.display = 'none'
    }
}

function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";
    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement("div")
            suggestionItem.classList.add("suggestion-item")
            suggestionItem.textContent = suggestion.Title
            suggestionsContainer.appendChild(suggestionItem)
        });
        suggestionsContainer.style.display = "block"
    }
    else {
        suggestionsContainer.style.display = "none"
    }
}


