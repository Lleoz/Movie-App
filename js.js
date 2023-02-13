const apiKey = "?api_key=e7ef6a2a37b409fd5985792e478957ac";
const url = "https://api.themoviedb.org/3/";
const urlImagen = 'http://image.tmdb.org/t/p/w500/';


let listMovies = [];

const getDataMovie = async (id, type) =>{
    try {
        const response = await fetch( url + `${type}/` + id + apiKey);
        return await response.json();
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

const getImages = async (id, type) => {
    try {
        const response = await fetch( url + `${type}/` + `${id}/images` + apiKey);
        return await response.json();
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

const getListGenres = async () => {
    try{
        const response = await fetch( url + 'genre/movie/list' + apiKey );
        return await response.json();
    } catch (error){
        console.error("An error occurred:", error);
    }
}

const getLisTrend = async () =>{
    try{
        const response = await fetch( url + '/trending/all/day' + apiKey );
        return await response.json();
    } catch (error){
        console.error("An error occurred:", error);
    }
}

const getListMoviesGenre = async ( genreId ) => {
    try {
        const response = await fetch( url + 'discover/movie' + apiKey + '&with_genres=' + genreId);
        return await response.json();
    } catch(error) {
        console.error("An error occurred:", error);
    }
}

const getListMovieKeyword = async ( query ) => {
    try {
        const response = await fetch( url + '/search/movie' + apiKey + '&query=' + query);
        return await response.json();
    } catch(error) {
        console.error("An error occurred:", error);
    }
}

const createMenuGenres = async () =>{
    const listGenres = await getListGenres();
    const menu = document.getElementById('menu');
    const list = document.createElement('ul');
    list.className = "ul-list";
    const titleGenre = document.createElement('h2');
    titleGenre.className = 'title_genre';
    titleGenre.textContent = 'Genre';
    menu.appendChild(titleGenre);
    listGenres.genres.forEach(({name, id}) => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.textContent = name;
        a.onclick = () => { showMoviesGenre(name, id); };
        li.appendChild(a);
        list.appendChild(li);
    });
    menu.appendChild(list)
}

const createTrendsMovies = async () => {
    listMovies = await getLisTrend();
    createGridMovies('Trending Movies', listMovies.results);
} 

const createGridMovies = async (title, listMovie ) => {
    
    const main = document.getElementById('main');
    main.textContent = '';
    
    const divTrendsMovies = document.createElement('div');
    divTrendsMovies.className = 'divTrendsMovies';
    const titleTrends = document.createElement('h1');
    titleTrends.textContent = title;
    divTrendsMovies.appendChild(titleTrends);
    const galleryPoster = document.createElement('div');
    galleryPoster.className = 'gallery';
    listMovie.forEach(({id, poster_path, title, first_air_date, original_name, release_date, media_type}) => {
        const figure = document.createElement('figure');
        figure.className = 'gallery_item';
        figure.onclick = () => viewOneMovie(id, media_type);
        const img = document.createElement('img');
        img.className = 'gallery_img'
        img.src = poster_path ? urlImagen + poster_path : 'no-img.png';
        const titleMovie = document.createElement('div');
        titleMovie.textContent = title || original_name;
        titleMovie.className = 'title_movie';
        const dateRelease = document.createElement('div');
        dateRelease.textContent = release_date || first_air_date;
        figure.appendChild(img);
        figure.appendChild(titleMovie);
        figure.appendChild(dateRelease);
        galleryPoster.appendChild(figure);
    })
    divTrendsMovies.appendChild(galleryPoster);
    main.appendChild(divTrendsMovies);
}

const showMoviesGenre = async (name, id) => {
    listMovies = await getListMoviesGenre(id);
    createGridMovies(`Movies Genre ${name}`, listMovies.results)
}

const search = async () => {
    const search = document.getElementById('search-input').value;
    listMovies = await getListMovieKeyword(search);
    createGridMovies(`Search:  ${search}`, listMovies.results)
}

const viewOneMovie = async ( id, media_type = 'movie' ) => {
    const movie = await getDataMovie(id, media_type);
    
    const main = document.getElementById('main');
    main.textContent = '';
    const returnButton = document.createElement('button');
    returnButton.className = 'returnButton';
    returnButton.textContent = "Return to List"
    returnButton.onclick = () => createGridMovies( '', listMovies.results);
    
    main.appendChild(returnButton);
    
    const titleMovie = document.createElement('h1');
    titleMovie.className = 'title_movie';
    titleMovie.textContent = movie.title || movie.original_name;
    main.appendChild(titleMovie);
    
    const poster_img = document.createElement('img');
    poster_img.className = 'poster_img';
    poster_img.src = movie.backdrop_path ? urlImagen + movie.backdrop_path : 'no-img.png';
    
    main.appendChild(poster_img);
    
    const overviewTitle = document.createElement('h2');
    overviewTitle.textContent = 'Overview';
    main.appendChild(overviewTitle);
    const overview = document.createElement('p');
    overview.textContent = movie.overview;
    
    main.appendChild(overview);
    
    const img = await getImages(id, media_type);
    
    const galleryPoster = document.createElement('div');
    galleryPoster.className = 'gallery';
    const imageTitle = document.createElement('h2');
    imageTitle.textContent = 'Images'
    main.appendChild(imageTitle)
    
    img.backdrops.forEach(({file_path}) => {
        const figure = document.createElement('figure');
        figure.className = 'gallery_item';
        const img = document.createElement('img');
        img.className = 'gallery_img'
        img.src = urlImagen + file_path;
        figure.appendChild(img);
        galleryPoster.appendChild(figure);
    })
    
    main.appendChild(galleryPoster);
    
    
}

createMenuGenres();
createTrendsMovies();



