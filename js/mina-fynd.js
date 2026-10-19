//deklarerar clearHistoryBtn till "Rensa alla fynd- knappen
const clearHistoryBtn = document.getElementById('clear-history-btn');

//Init funktion som hämtar in json-filen, filtrerar efter sparade svampar i local storage och bygger HTML-element utifrån de sparade svamparnas information.
//och även lyssnar efter om användaren klickar på antingen "Rensa alla fynd" eller "Ta bort"
//"Rensa alla fynd"-knappen gör så att local storage töms på "mushrooms" och även att listan (ul) som svamparna ligger i töms. Dessutom skickar den värdet 0 till funktionen changeAmount
//"Ta bort"-knappen uppdaterar listan för sparade svampar, raderar li som svampen ligger i och skickar längden på den uppdaterade listan till funktionen changeAmount
async function init(){
    const response = await fetch("./json/svampar.json");
    const mushroomsJSON = await response.json();
    const mushrooms = mushroomsJSON.svampar;

    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    const foundMushrooms = mushrooms.filter(mushroom =>
        savedMushrooms.includes(mushroom.svenskt_namn)
    );

    changeAmount(foundMushrooms.length);

    foundMushrooms.forEach(mushroom => {
        createMushroomElement(mushroom);
    });

    const removeMushroomBtn = document.querySelectorAll('.remove-mushroom-btn');

    removeMushroomBtn.forEach(button => {
        button.addEventListener("click", e => {
            const mushroomId = e.currentTarget.dataset.svampId;

            const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

            const updatedMushrooms = savedMushrooms.filter(savedId =>
                savedId !== mushroomId
            );

            localStorage.setItem("mushrooms", JSON.stringify(updatedMushrooms));

            e.currentTarget.closest("li").remove();

            changeAmount(updatedMushrooms.length);
        });
    });

    clearHistoryBtn.addEventListener("click", e => {
        localStorage.removeItem("mushrooms");
        document.querySelector("ul").innerHTML = "";

        changeAmount(0);
    });
}

//Denna funktion uppdaterar antalet för hittade svampar och ändrar slutet på "svamp" till "svampar" på antalet 0 och fler än 1
//Dessutom döljer den knappen för "Rensa alla fynd" om antalet är 0 (alltså att inga svampar är sparade)
function changeAmount(amount){
    const showAmount = document.getElementById("amount-found");
    const textAmount = document.getElementById("text-amount-found");

    if (amount === 0) {
        clearHistoryBtn.hidden = true;
        textAmount.textContent = "ar";
        showAmount.textContent = amount;
    }
    else {
        textAmount.textContent = "ar";
        showAmount.textContent = amount;

        if (amount === 1) {
            textAmount.textContent = "";
        }

        clearHistoryBtn.hidden = false;
    }
}

window.onload = init;