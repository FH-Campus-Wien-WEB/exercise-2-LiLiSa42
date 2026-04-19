window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const bodyElement = document.querySelector("body");
    if (xhr.status == 200) {
      const movies = JSON.parse(xhr.responseText);
      const list = document.createElement("ol");
      bodyElement.append(list);
      for (const movie of movies) {
        const movieElement = document.createElement("li");
        movieElement.id = movie.imdbID;
        const poster = document.createElement("img");
        poster.classList.add("movie-poster");

        if (movie.Poster && movie.Poster !== "N/A") {
          poster.src = movie.Poster;
        } 

        poster.alt = "Poster von " + movie.Title;
        movieElement.appendChild(poster);

        const movieText = document.createElement("div");
        movieText.classList.add("movie-text");

        const title = document.createElement("h2");
        title.textContent = movie.Title;

        const data = document.createElement("div");
        data.innerHTML = `
          Genres: ${movie.Genres.join(", ")}<br>
          Directors: ${movie.Directors.join(", ")}<br>
          Writers: ${movie.Writers.join(", ")}<br>
          Actors: ${movie.Actors.join(", ")}<br>
          Plot: ${Array.isArray(movie.Plot) ? movie.Plot.join(". ") : movie.Plot}<br>
          Released: ${movie.Released}<br>
          Runtime: ${movie.Runtime}${typeof movie.Runtime === "number" ? " min" : ""}<br>
          Metascore: ${movie.Metascore}<br>
          IMDB Rating: ${movie.imdbRating}
        `;

        movieText.appendChild(title);
        movieText.appendChild(data);
        movieElement.appendChild(movieText);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function() {
          location.href = 'edit.html?imdbID=' + movie.imdbID;
        };
        movieText.appendChild(editButton);
        list.append(movieElement);
      }
    } else {
      bodyElement.append(
        "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText
      );
    }
  };
  xhr.open("GET", "/movies");
  xhr.send();
};
