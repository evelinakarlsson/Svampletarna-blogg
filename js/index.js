// Startar hämtningen av JSON-filen direkt när skriptet körs, init väntar sedan på svaret
let mushroomsJSON = fetch("./json/svampar.json")
    .then(r => r.json());

// Visar alla svampar och gör att "Markera som hittad" sparar svampen i localStorage
async function init() {
    mushroomsJSON = await mushroomsJSON;
    let mushrooms = mushroomsJSON.svampar;

    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    // Skapar ett kort för varje svamp och döljer knappen på de som redan är hittade
    mushrooms.forEach(mushroom => {
        const mushroomElement = createMushroomElement(mushroom);
        const button = mushroomElement.querySelector(".btn-find");

        if (savedMushrooms.includes(mushroom.svenskt_namn)) {
            button.hidden = true;
        }
    });

    const findButtons = document.querySelectorAll(".btn-find");

    // Sparar svampen i localStorage när användaren klickar och döljer sedan knappen
    findButtons.forEach(btnFind => {
        btnFind.addEventListener("click", e => {
            const mushroomId = e.currentTarget.dataset.svampId;

            const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

            // Lägger bara till svampen om den inte redan finns i listan
            if (!savedMushrooms.includes(mushroomId)) {
                savedMushrooms.push(mushroomId);
            }

            localStorage.setItem("mushrooms", JSON.stringify(savedMushrooms));

            btnFind.hidden = true;
        });
    });
}

// Startar sidan när den har laddats
window.onload = init;
