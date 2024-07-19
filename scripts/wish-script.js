let wishlistArray = localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')) : []
const mainEl = document.getElementById("main")

fetchWishlist()

document.addEventListener("click", function(e) {
    if(e.target.dataset && e.target.dataset.imdb){
        const imdbId = e.target.dataset.imdb
        const movieDiv = document.querySelector(`#movie-${imdbId}`)

        const index = wishlistArray.findIndex(movie => movie.imdbId === imdbId)
        wishlistArray.splice(index, 1)

        fetchWishlist()

        localStorage.setItem('wishlist', JSON.stringify(wishlistArray))
    }
})


function fetchWishlist() {
    if (wishlistArray.length === 0) {
        mainEl.innerHTML = `<h3>Your watchlist is looking a little empty...</h3>
            <h3><a href="/index.html "><img src="/img/icons/add.svg" alt="add-icon" />&nbsp;&nbsp;Let’s add some movies!</a></h2>`
        mainEl.style.flexDirection = "column"
    }
    else {
        let htmlMovies = wishlistArray.map( function(movie){
            const id = movie.imdbId
            const title = movie.title
            const rating = movie.rating
            const runtime = movie.runtime
            const genre = movie.genre
            const plot = movie.plot
            const poster = movie.poster
            const addNumber = "1"
            const addLoc = "/img/icons/remove.svg"
            const addText = "Remove"

            return `
                    <div class="movie" id="movie-${id}">
                        <div class="div1">
                            <img src="${poster}" alt="${title}">
                        </div>
                        <div class="div2">
                            <h5>${title}&nbsp;&nbsp;&nbsp;<span><img src="/img/icons/star.svg" />&nbsp;${rating}<span></h5>
                            <h6>${runtime}&nbsp;&nbsp;&nbsp;&nbsp;${genre}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span data-imdb="${id}" data-add=${addNumber}><img src=${addLoc} alt="remove icon" style="height:0.95rem;" />&nbsp;${addText}</span></h6>
                            <p>${plot}</p>
                        </div>
                    </div>`
        })

        mainEl.innerHTML = htmlMovies.join("")
    }
}

