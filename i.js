const apiUrl = "http://www.omdbapi.com/?apikey=d122fec8";
const body = document.querySelector("body");
const welcomePage = document.getElementById("welcome-page"); 
const movieConNav = document.getElementById("movie-con-nav"); //
const movieCon = document.getElementById("movie-con"); //
const movieListCon = document.getElementById("movie-list");
const highRatedCon = document.getElementById("high-rated");
const myListContainer = document.getElementById("my-list-con");
const searchSec = document.getElementById("search");
const newPopularSec = document.getElementById("new-popular");
const ratingsSec = document.getElementById("ratings");
const myListSec = document.getElementById("my-list");
const signInSec = document.getElementById("sign-in");
const signOutSec = document.getElementById("sign-out");
const loginButton = document.getElementById("login-button");
const myListHeading = document.getElementById("mylist-heading");
const clearListButton = document.getElementById("clear-list");
const searchContainer = document.getElementById('search-container')
let signedIn = false;
let dataValue;
let localDataIds;


async function fetchData(name) {
  const response = await fetch(apiUrl + "&s=" + name);
  const data = await response.json();
  const search = data.Search;
  return search;
}
newPopularSec.addEventListener("click", () => {
  movieListCon.scrollIntoView({ behavior: "smooth" });
});
ratingsSec.addEventListener("click", () => {
  highRatedCon.scrollIntoView({ behavior: "smooth" });
});
myListSec.addEventListener("click", () => {
  myListHeading.scrollIntoView({ behavior: "smooth" });
});
signInSec.addEventListener("click", () => {
  welcomePage.style.display = "block";
});
loginButton.addEventListener("click", () => {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  const inputValues = emailInput + passwordInput;
  if (emailInput && passwordInput) {
    signedIn = true;
    myListHeading.style.display = "unset";
    signInSec.style.display = "none";
    signOutSec.style.display = "unset";
    dataValue = inputValues;
    welcomePage.style.display = "none";
    movieConNav.style.display = "flex";
    movieCon.style.display = "block";
    fetchForRecommend();

    let myListIdArray = localStorage.getItem(dataValue);
    myListIdArray = JSON.parse(myListIdArray);
    if (myListIdArray) {
      myListIdArray.forEach((item) => {
        idAppender(item);
      });
    }
  }
});
signOutSec.addEventListener("click", () => {
  location.reload();
});
clearListButton.addEventListener("click", () => {
  localStorage.removeItem(dataValue);
  myListContainer.innerHTML = ``;
});

async function idAppender(id) {
  let myListIdArray = localStorage.getItem(dataValue);
  myListIdArray = JSON.parse(myListIdArray);
  const response = await fetch(apiUrl + "&i=" + id);
  const data = await response.json();
  const listCard = document.createElement("div");
  listCard.classList.add("single-movie-con");
  const listCardImage = document.createElement("img");
  listCardImage.src = data.Poster;
  const listCardYear = document.createElement("div");
  listCardYear.textContent = data.Year;
  const listCardTitle = document.createElement("div");
  listCardTitle.textContent = data.Title;
  listCardImage.classList.add("card-image");

  listCard.appendChild(listCardImage);
  listCard.appendChild(listCardTitle);
  listCard.appendChild(listCardYear);
  myListContainer.appendChild(listCard);
  listCardImage.addEventListener("click", () => {
    searchAppender(data);
  });
}
async function searchAppender(data) {
  const innerHtml = `
          <button id='goback-btn'>Go Back</button>
          <div class='showroom-container'>
            <img src='${data.Poster}'>
            <div class='info-container'>
              <h3>${data.Title}</h3>
              <p>Genre:${data.Genre}</p>
              <p>Writer:${data.Writer}</p>
              <p>Runtime:${data.Runtime}</p>
              <p>Release Date:${data.Released}</p>
              <p>IMDB Rating:${data.imdbRating}</p>
              <p>IMDB Votes${data.imdbVotes}</p>
              <button id='add-fav-btn' class='all-button'>add to fav</button>
            </div>
          </div>

        `;
  movieCon.style.display = 'none'
  movieConNav.style.display = 'none'
  searchContainer.innerHTML = innerHtml;
  const goBackButton = document.getElementById("goback-btn");
  goBackButton.addEventListener("click", () => {
    movieCon.style.display = 'block'
    movieConNav.style.display = 'flex'
    searchContainer.innerHTML = '';
  });
  document.getElementById("add-fav-btn").addEventListener("click", () => {
    if(JSON.parse(localStorage.getItem(dataValue))){
      localDataIds = JSON.parse(localStorage.getItem(dataValue))
    }else{
      localDataIds = [];
    }
    localDataIds.push(data.imdbID)
    localStorage.setItem(dataValue,JSON.stringify(localDataIds))
    idAppender(data.imdbID)
  });
}

async function fetchForRecommend() {
  const recommendedfilms = [
    "yellowstone",
    "loki",
    "fair play",
    "saw x",
    // "loki"
  ];
  const highRatedMovies = [
    "the shawshank",
    "interstellar",
    "the dark knight",
    "Pulp Fiction",
    // "interstellar"
  ];

  const recommendedCon = document.createElement("div");
  const highCon = document.createElement("div");

  recommendedCon.classList.add("recommended-con");
  highCon.classList.add("high-con");

  movieListCon.appendChild(recommendedCon);
  highRatedCon.appendChild(highCon);

  const recommend = [];
  const high = [];
  await Promise.all(
    recommendedfilms.map(async (film) => {
      const response = await fetchData(film);
      if (response) {
        recommend.push(response[0]);
      }
    })
  );
  await Promise.all(
    highRatedMovies.map(async (film) => {
      const response = await fetchData(film);
      if (response) {
        high.push(response[0]);
      }
    })
  );

  const cardIds = [];
  const cardImages = [];
  

  recommend.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("single-movie-con");
    const cardImdbId = item.imdbID;
    const cardImage = document.createElement("img");
    cardImage.classList.add("card-image");
    cardImage.src = item.Poster;
    const cardYear = document.createElement("div");
    cardYear.textContent = item.Year;
    const cardTitle = document.createElement("div");
    cardTitle.textContent = item.Title;
    const addButton = document.createElement("button");
    addButton.innerHTML = "add to fav";
    addButton.classList.add("all-button");

    card.appendChild(cardImage);
    card.appendChild(cardTitle);
    card.appendChild(cardYear);
    card.appendChild(addButton);
    recommendedCon.appendChild(card);
    movieListCon.appendChild(recommendedCon);
    cardIds.push(cardImdbId);
    cardImages.push(cardImage);

    addButton.addEventListener("click", () => {
      if(JSON.parse(localStorage.getItem(dataValue))){
        localDataIds = JSON.parse(localStorage.getItem(dataValue))
      }else{
        localDataIds = [];
      }
      localDataIds.push(cardImdbId)
      localStorage.setItem(dataValue,JSON.stringify(localDataIds))
      idAppender(cardImdbId)
    });
  });

  high.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("single-movie-con");
    const cardImdbId = item.imdbID;
    const cardImage = document.createElement("img");
    cardImage.classList.add("card-image");
    cardImage.src = item.Poster;
    const cardYear = document.createElement("div");
    cardYear.textContent = item.Year;
    const cardTitle = document.createElement("div");
    cardTitle.textContent = item.Title;
    const addButton = document.createElement("button");
    addButton.innerHTML = "add to fav";
    addButton.classList.add("all-button");

    card.appendChild(cardImage);
    card.appendChild(cardTitle);
    card.appendChild(cardYear);
    card.appendChild(addButton);
    highCon.appendChild(card);
    highRatedCon.appendChild(highCon);
    cardIds.push(cardImdbId);
    cardImages.push(cardImage);

    addButton.addEventListener("click", () => {
      if(JSON.parse(localStorage.getItem(dataValue))){
        localDataIds = JSON.parse(localStorage.getItem(dataValue))
      }else{
        localDataIds = [];
      }
      localDataIds.push(cardImdbId)
      localStorage.setItem(dataValue,JSON.stringify(localDataIds))
      idAppender(cardImdbId)
    });
  });
  cardImages.forEach((item, index) => {
    item.addEventListener("click", async () => {
      const idResponse = await fetch(apiUrl + "&i=" + cardIds[index]);
      const idData = await idResponse.json();
      searchAppender(idData);
    });
  });

  const demoName = document.getElementById("demo-name");
  const demoPara = document.getElementById("demo-para");
  const overviewRes = await fetchData("Dead Reckoning Part One");
  const idRes = await fetch(apiUrl + "&i=" + overviewRes[0].imdbID);
  const idResData = await idRes.json();
  demoName.textContent = idResData.Title;
  demoPara.textContent = idResData.Plot;
}

searchSec.addEventListener("click", () => {
  const innerHtml = `
    <button id='goback-btn'>Go Back</button>
    <div id='search-page-container'>
        <input type="text" form="search-button" id='search-input'>
        <button id="search-button" class='all-button'>Search</button>
    </div>
    `;
  movieCon.style.display = 'none'
  movieConNav.style.display = 'none'
  searchContainer.innerHTML = innerHtml;
  const goBackButton = document.getElementById("goback-btn");
  goBackButton.addEventListener("click", () => {
    movieCon.style.display = 'block'
    movieConNav.style.display = 'flex'
    searchContainer.innerHTML = '';
  });
  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", async () => {
    const searchInput = document.getElementById("search-input").value;
    const searchTerms = searchInput.split(",");
    const searchPromises = searchTerms.map(async (prom) => {
      return fetchData(prom);
    });
    try {
      const searchResults = await Promise.all(searchPromises);
      const searchResult = searchResults[0];
      movieCon.style.display = 'none'
      movieConNav.style.display = 'none'
      searchContainer.innerHTML = `
                <button id='goback-btn'>Go Back</button>
                <div id='show-result-con'></div>
             `;
      const goBackButton = document.getElementById("goback-btn");
      goBackButton.addEventListener("click", () => {
        movieCon.style.display = 'block'
        movieConNav.style.display = 'flex'
        searchContainer.innerHTML = '';
      });
      const cardIds = [];
      const cardImages = [];
      searchResult.forEach((result) => {
        const showCard = document.createElement("div");
        showCard.classList.add("single-movie-con");
        const cardImdbId = result.imdbID;
        const showImage = document.createElement("img");
        showImage.classList.add("card-image");
        showImage.src = result.Poster;
        const showYear = document.createElement("p");
        showYear.textContent = result.Year;
        const showTitle = document.createElement("p");
        showTitle.textContent = result.Title;
        const addButton = document.createElement("button");
        addButton.innerHTML = "add to fav";
        addButton.classList.add("all-button");
        
        cardIds.push(cardImdbId);
        cardImages.push(showImage);
        showCard.appendChild(showImage);
        showCard.appendChild(showYear);
        showCard.appendChild(showTitle);
        showCard.appendChild(addButton);
        document.getElementById("show-result-con").appendChild(showCard);
        addButton.addEventListener("click", () => {
          if(JSON.parse(localStorage.getItem(dataValue))){
            localDataIds = JSON.parse(localStorage.getItem(dataValue))
          }else{
            localDataIds = [];
          }
          localDataIds.push(cardImdbId)
          localStorage.setItem(dataValue,JSON.stringify(localDataIds))
          idAppender(cardImdbId)
        });
      });
      

      cardImages.forEach((item, index) => {
        item.addEventListener("click", async () => {
          const idResponse = await fetch(apiUrl + "&i=" + cardIds[index]);
          const idData = await idResponse.json();
          searchAppender(idData);
        });
      });
    } catch (error) {
      console.error(error);
    }
  });
});









