const baseUrl = "https://www.omdbapi.com/?&apikey=370610da"


const searchInput = document.getElementById("s-input")
const suggestionsContainer = document.getElementById("suggestions")
const btnEl = document.getElementById("s-btn")
const mainEl = document.getElementById("main")

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
    fetchMovies(query)
    suggestionsContainer.style.display = "none"
})

suggestionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("suggestion-item")) {
        searchInput.value = e.target.textContent
        suggestionsContainer.style.display = "none"
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
        return
    }
    else {
        const movies = data.Search

        const htmlMovies = await Promise.all(movies.map(async (movie) => {
            const id = movie.imdbID
            const res = await fetch(`${baseUrl}&i=${id}`)
            const mov = await res.json()

            return `
                    <div class="movie">
                        <div class="div1">
                            <img src="${mov.Poster}" alt="${mov.Title}">
                        </div>
                        <div class="div2">
                            <h5>${mov.Title}&nbsp;&nbsp;&nbsp;<span><img src="../img/icons/star.svg" />&nbsp;${mov.imdbRating}<span></h5>
                            <h6>${mov.Runtime}&nbsp;&nbsp;&nbsp;${mov.Genre}</h6>
                            <p>${mov.Plot}</p>
                        </div>
                    </div>`
        }))

        mainEl.innerHTML = htmlMovies.join("")
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



