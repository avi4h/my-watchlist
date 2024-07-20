let watchlistArray = localStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : []
const mainEl = document.getElementById("main")

fetchWatchlist()

document.addEventListener("click", function(e) {
    if(e.target.dataset && e.target.dataset.imdb){
        const imdbId = e.target.dataset.imdb

        const index = watchlistArray.findIndex(movie => movie.imdbId === imdbId)
        watchlistArray.splice(index, 1)

        fetchWatchlist()

        localStorage.setItem('watchlist', JSON.stringify(watchlistArray))
    }
})


function fetchWatchlist() {
    if (watchlistArray.length === 0) {
        mainEl.innerHTML = `<h3>Your watchlist is looking a little empty...</h3>
            <h3><a href="/index.html "><img src="/img/icons/add.svg" alt="add-icon" />&nbsp;&nbsp;Let’s add some movies!</a></h2>`
    }
    else {
        let htmlMovies = watchlistArray.map( function(movie){
            const id = movie.imdbId
            const title = movie.title
            const rating = movie.rating
            const runtime = movie.runtime
            const genre = movie.genre
            const plot = movie.plot
            const poster = movie.poster

            return `
                    <div class="movie" id="movie-${id}">
                        <div class="div1">
                            <img src="${poster}" alt="${title}">
                        </div>
                        <div class="div2">
                            <h5>${title}&nbsp;&nbsp;&nbsp;<span><img src="/img/icons/star.svg" />&nbsp;${rating}<span></h5>
                            <h6>${runtime}&nbsp;&nbsp;&nbsp;&nbsp;${genre}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span data-imdb="${id}" data-add="1" ><img src="/img/icons/remove.svg" alt="remove icon" />&nbsp;Remove</span></h6>
                            <p>${plot}</p>
                        </div>
                    </div>`
        })

        mainEl.innerHTML = htmlMovies.join("")
    }
}

