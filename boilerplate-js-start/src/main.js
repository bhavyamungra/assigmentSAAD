document.addEventListener("DOMContentLoaded", function () {
    const main = document.getElementById("s-mainsection");
    const overlay = document.getElementById("overlay");
    const header = document.querySelector("header");
    let i = 1; // Reset for each batch of jokes displayed

    // Function to fetch jokes from the API
    function fetchJokes(attempt = 1) {
        if (attempt > 5) {
            console.error("Failed to fetch sufficient valid jokes after several attempts.");
            overlay.style.display = "none";
            return;
        }

        overlay.style.display = "block";
        fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&amount=10") // Fetch more to have a 
            .then(response => response.json())
            .then(data => {
                if (data.jokes && data.jokes.length) {
                    displayJokes(data.jokes, attempt);
                } else {
                    throw new Error("No jokes received.");
                }
            })
            .catch(error => {
                console.error("Error fetching jokes:", error);
                overlay.style.display = "none";
            });
    }

    function displayJokes(jokes, attempt) {
        let displayedJokes = 0;
        jokes.forEach(joke => {
            if (displayedJokes == 5) return; // Stop if we've displayed 5 jokes
            if (joke.setup && joke.delivery) {
                const section = document.createElement("div");
                section.classList.add("section");
                section.innerHTML = `
                    <h3>Joke ${i}</h3>
                    <p>${joke.setup}</p>
                    <p>${joke.delivery}</p>
                    <p>Category: ${joke.category}</p>
                `;
                main.appendChild(section);
                overlay.style.display = "none";
                displayedJokes++;
                i++;
            }
        });

        if (displayedJokes < 5) { // If not enough valid jokes were displayed, fetch again
            main.innerHTML = ""; // Clear out potentially partial content
            i = 1; // Reset joke numbering
            fetchJokes(attempt + 1); // Attempt to fetch again
        }
    }

    // Initial load of jokes
    fetchJokes();

    // Event listener for clicking the header to fetch new jokes
    header.addEventListener("click", () => {
        main.innerHTML = ""; // Clear existing jokes
        i = 1; // Reset joke numbering
        fetchJokes();
    });
});
