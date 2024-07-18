const baseUrl = "https://www.omdbapi.com/?&apikey=370610da"

const searchInput = document.getElementById("s-input")
const suggestionsContainer = document.getElementById("suggestions")
const btnEl = document.getElementById("s-btn")
const mainEl = document.getElementById("main")
const loadingModal = document.getElementById('loadingModal')


searchInput.addEventListener("input", async () => {
    const query = searchInput.value
    if (query.length > 0) {
        const suggestions = await fetchSuggestions(query)
        displaySuggestions(suggestions.slice(0, 5))
    } else {
        suggestionsContainer.style.display = "none"
    }
})

btnEl.addEventListener("click", () => {
    const query = searchInput.value
    suggestionsContainer.style.display = "none"
    loadingModal.style.display = 'flex'
    fetchMovies(query)
})

suggestionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("suggestion-item")) {
        searchInput.value = e.target.textContent
        suggestionsContainer.style.display = "none"
        loadingModal.style.display = 'flex'
        fetchMovies(e.target.textContent)
    }
})

async function fetchSuggestions(query) {
    const response = await fetch(`${baseUrl}&s=${query}`)
    const data = await response.json()
    return data.Search || []
}

async function fetchMovies(query) {
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
            
            if (mov.Poster === "N/A") {
                return " "
            }

            return `
                    <div class="movie">
                        <div class="div1">
                            <img src="${poster}" alt="${title}">
                        </div>
                        <div class="div2">
                            <h5>${title}&nbsp;&nbsp;&nbsp;<span><img src="../img/icons/star.svg" />&nbsp;${rating}<span></h5>
                            <h6>${runtime}&nbsp;&nbsp;&nbsp;${genre}</h6>
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


