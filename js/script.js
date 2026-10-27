// Hämtar templaten för ett svampkort och listan som korten ska läggas i
const templateEl = document.querySelector("template");

const mushroomList = document.querySelector(".svamp-lista > ul");
mushroomList.removeChild(templateEl);

// Skapar ett svampkort utifrån en svamp i JSON-filen, lägger till det i listan och returnerar det
function createMushroomElement({
    svenskt_namn,
    latinskt_namn,
    ätlig,
    bild,
    fyndplats,
    beskrivning,
}) {
    // Skapar en kopia av <li> i templaten
    const listElement = templateEl.content.firstElementChild.cloneNode(true);
    const contentElements = listElement.firstElementChild.children;

    // Byter "./" i bildens sökväg till vår bildmapp
    contentElements[0].src = bild.replace("./", "img/");
    contentElements[0].alt = svenskt_namn;
    contentElements[1].textContent = svenskt_namn;
    contentElements[2].textContent = latinskt_namn;
    // Bara statusen ("Ätlig", "Giftig" ...) syns, hela texten visas när man trycker på texten eller "?"
    const ätbarStatus = ätlig.split(" – ")[0];
    contentElements[3].querySelector("summary").textContent = ätbarStatus;
    contentElements[3].querySelector("p").textContent = ätlig;

    const status = ätbarStatus.toLowerCase();
    // "oätlig" kontrolleras först eftersom ordet också innehåller "ätlig"
    if (status.includes("oätlig")) {
        contentElements[3].classList.add("yellow");
    } else if (status.includes("ätlig")) {
        contentElements[3].classList.add("green");
    } else if (status.includes("giftig")) {
        contentElements[3].classList.add("red");
    }

    contentElements[4].textContent = beskrivning;
    contentElements[5].textContent = fyndplats;
    // Svenska namnet används som id när svampen sparas i localStorage
    contentElements[6].dataset.svampId = svenskt_namn;

    mushroomList.appendChild(listElement);
    return listElement;
}
