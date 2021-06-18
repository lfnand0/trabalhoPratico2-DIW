const TMDB_ENDPOINT = "https://api.themoviedb.org/3";
const APIKEY = "8094a8a26480a9c829b7ff014b4f366b";
const IMG_PREFIX = "https://image.tmdb.org/t/p/w500";
var xhr, listaGeneros;

function carregaFilmes() {
  sessionStorage.clear();
  xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    TMDB_ENDPOINT + "/movie/popular" + "?api_key=" + APIKEY,
    true
  );
  xhr.onload = () => {
    let data = JSON.parse(xhr.responseText);
    let textoHTML = "";

    for (let i = 0; i < 3; i++) {
      let nomeFilme = data.results[i].title;
      // let sinopse = data.results[i].overview;
      let imagem = IMG_PREFIX + data.results[i].poster_path;

      textoHTML += `<div class="card col-md-4">
              <img src="${imagem}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h5 class="card-title">${nomeFilme}</h5>
                  <button id="${
                    "inicial-" + i
                  }"onclick="abrirFilme(this.id)" class="btn btn-dark">Saber Mais</button>
              </div>
          </div>`;
    }

    document.getElementById("div-index").style.display = "inline";
    document.getElementById("lancamentos").innerHTML = textoHTML;
  };
  xhr.send();
}

function pesquisaFilmes() {
  xhr = new XMLHttpRequest();

  query = document.getElementById("input-pesquisa").value;

  xhr.open(
    "GET",
    TMDB_ENDPOINT + "/search/movie" + "?api_key=" + APIKEY + "&query=" + query,
    true
  );
  xhr.onload = () => {
    let data = JSON.parse(xhr.responseText);
    let textoHTML = "";

    for (let i = 0; i < data.results.length; i++) {
      let nomeFilme = data.results[i].title;
      // let sinopse = data.results[i].overview;
      let imagem = IMG_PREFIX + data.results[i].poster_path;
      textoHTML += `<div class="card col-md-4">
              <img src="${imagem}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h5 class="card-title">${nomeFilme}</h5>
                  <button id="${
                    "pesquisa-" + i
                  }"onclick="abrirFilme(this.id)" class="btn btn-dark">Saber Mais</button>
              </div>
          </div>`;
    }

    document.getElementById("div-index").style.display = "none";
    document.getElementById("div-pesquisa").innerHTML = textoHTML;
  };
  xhr.send();
}

function abrirFilme(id) {
  let indice = id.slice(-1);
  let data = JSON.parse(xhr.responseText);
  let resultante = data.results[indice];
  window.location.href = "filme.html";
  sessionStorage.setItem("abrir-filme", JSON.stringify(resultante));

  document.getElementById("nomeFilme").innerHTML = resultante.title;
  document.getElementById("sinopseFilme").innerHTML = resultante.overview;
}

function renderizarPaginaFilme() {
  let filme = JSON.parse(sessionStorage.getItem("abrir-filme"));
  if (!filme) {
    window.location.href = "index.html";
  } else {
    document.getElementById("nomeFilme").innerHTML = filme.title;
    document.getElementById("sinopseFilme").innerHTML = filme.overview;

    let imagem = IMG_PREFIX + filme.backdrop_path;
    console.log(filme);
    document.getElementById("imagemFilme").src = imagem;

    xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      TMDB_ENDPOINT + "/genre/movie/list" + "?api_key=" + APIKEY,
      true
    );
    xhr.onload = () => {
      listaGeneros = JSON.parse(xhr.responseText);
      console.log(listaGeneros);
      let textoHTML = "";
      for (i = 0; i < filme.genre_ids.length; i++) {
        for (j = 0; j < listaGeneros.genres.length; j++) {
          if (filme.genre_ids[i] == listaGeneros.genres[j].id) {
            textoHTML += listaGeneros.genres[j].name + `, `;
          }
        }
      }

      textoHTML = textoHTML.substring(0, textoHTML.length - 2);
      console.log("listarGeneros: ", textoHTML);
      document.getElementById("generosFilme").innerHTML = textoHTML;
    };
    xhr.send();

    let dataLancamento = filme.release_date;
    let anoLancamento = dataLancamento.substring(0, 4);
    let mesLancamento = dataLancamento.substring(5, 7);
    let diaLancamento = dataLancamento.substring(8, 10);
    dataLancamento = diaLancamento + "/" + mesLancamento + "/" + anoLancamento;
    document.getElementById("lancamentoFilme").innerHTML = dataLancamento;
  }
}
