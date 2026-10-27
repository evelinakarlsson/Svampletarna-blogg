// Startar hämtningen av information
function init() {
    fetchData();
}

// Hämtar informationen från JSON-filerna
async function fetchData() {
    try {
        const comparisonResponse = await fetch("json/speciellaEgenskaper.json");
        const mushroomsResponse = await fetch("json/svampar.json");

        // Kontrollerar att båda filerna kunde hämtas
        if (!comparisonResponse.ok || !mushroomsResponse.ok) {
            throw new Error("Det gick inte att hämta JSON-filerna");
        }

        // Omvandlar innehållet från JSON till data som JavaScript kan använda
        const comparisonJSON = await comparisonResponse.json();
        const mushroomsJSON = await mushroomsResponse.json();

        // Skickar jämförelserna och svamparna vidare för att visas på sidan
        displayComparisons(
            comparisonJSON.särskiljande_egenskaper,
            mushroomsJSON.svampar
        );

    } catch (error) {
        // Skriver felet i konsolen och visar ett meddelande på sidan
        console.error("Fel:", error);
        document.getElementById("jamforelselista").textContent = "Informationen kunde inte laddas.";
    }
}

// Skapar och visar alla jämförelser
function displayComparisons(comparisons, mushrooms) {
    const comparisonList = document.getElementById("jamforelselista");
    comparisonList.textContent = "";

    // Skapar en artikel för varje jämförelse och lägger till den på sidan
    comparisons.forEach(comparison => {
        const comparisonElement = createComparisonElement(comparison, mushrooms);
        comparisonList.appendChild(comparisonElement);
    });
}

// Skapar en artikel med rubrik, risktext, bilder och punktlista
function createComparisonElement(comparison, mushrooms) {
    const comparisonElement = document.createElement("article");
    comparisonElement.className = "jamforelse";

    const heading = document.createElement("h3");
    heading.textContent = comparison.par;

    const risk = document.createElement("details");
    const riskSummary = document.createElement("summary");
    const riskText = document.createElement("p");

    risk.className = "risk";

    const riskLevel = comparison.risk.split(" – ")[0];
    riskSummary.textContent = "Risk: " + riskLevel;

    const riskDescription = comparison.risk;
    riskText.textContent = riskDescription;

    risk.appendChild(riskSummary);
    risk.appendChild(riskText);

    // Väljer färg på riskrutan utifrån risktexten
    if (comparison.risk.includes("Låg")) {
        risk.classList.add("green");
    } else if (comparison.risk.includes("Oätlig")) {
        risk.classList.add("yellow");
    } else {
        risk.classList.add("red");
    }

    // Använder funktionerna för att skapa bilderna och punktlistan
    const imageContainer = createMushroomImages(comparison, mushrooms);
    const featureList = createFeatureList(comparison.särskiljande);

    // Samlar bilderna och punktlistan i en gemensam div
    const content = document.createElement("div");
    content.className = "jamforelse-innehall";
    content.append(imageContainer, featureList);

    // Lägger till allt innehåll i artikeln och returnerar den
    comparisonElement.append(heading, risk, content);

    return comparisonElement;
}

// Hittar svampar som nämns i rubriken och skapar deras bilder
function createMushroomImages(comparison, mushrooms) {
    const imageContainer = document.createElement("div");
    imageContainer.className = "jamforelse-bilder";

    mushrooms.forEach(mushroom => {
        const heading = comparison.par;
        const name = mushroom.svenskt_namn;

        if (heading.includes(name)) {
            const figure = document.createElement("figure");

            const image = document.createElement("img");

            // Byter "./" i bildens sökväg till vår bildmapp
            image.src = mushroom.bild.replace("./", "img/");
            image.alt = mushroom.svenskt_namn;

            const caption = document.createElement("figcaption");
            caption.textContent = mushroom.svenskt_namn;

            figure.append(image, caption);
            imageContainer.appendChild(figure);
        }
    });

    return imageContainer;
}

// Skapar en punktlista med de särskiljande egenskaperna
function createFeatureList(features) {
    const featureList = document.createElement("ul");

    // Skapar en punkt för varje egenskap och lägger till den i listan
    features.forEach(feature => {
        const listItem = document.createElement("li");
        listItem.textContent = feature;

        featureList.appendChild(listItem);
    });

    return featureList;
}

// Startar sidan när den har laddats
window.onload = init;
