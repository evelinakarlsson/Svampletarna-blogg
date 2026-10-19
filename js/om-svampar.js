// Startar hämtningen av information
function init() {
    hamtaData();
}

// Hämtar informationen från JSON-filerna
async function hamtaData() {
    try {
        const jamforelseResponse = await fetch("json/speciellaEgenskaper.json");
        const svampResponse = await fetch("json/svampar.json");

        // Kontrollerar att båda filerna kunde hämtas
        if (!jamforelseResponse.ok || !svampResponse.ok) {
            throw new Error("Det gick inte att hämta JSON-filerna");
        }

        // Omvandlar innehållet från JSON till data som JavaScript kan använda
        const jamforelseData = await jamforelseResponse.json();
        const svampData = await svampResponse.json();

        // Skickar jämförelserna och svamparna vidare för att visas på sidan
        visaJamforelser(
            jamforelseData.särskiljande_egenskaper,
            svampData.svampar
        );

    } catch (error) {
        // Skriver felet i konsolen och visar ett meddelande på sidan
        console.error("Fel:", error);
        document.getElementById("jamforelselista").textContent = "Informationen kunde inte laddas.";
    }
}

// SKapar och visar alla jämförelser
function visaJamforelser(jamforelser, svampar) {
    const jamforelselista = document.getElementById("jamforelselista");
    jamforelselista.textContent = "";

    // Skapar en artikel för varje jämförelse och lägger till den på sidan
    jamforelser.forEach(jamforelse => {
        const artikel = skapaArtikel(jamforelse, svampar);
        jamforelselista.appendChild(artikel);
    });
}

// Skapar en artikel med rubrik, risktext, bilder och punktlista
function skapaArtikel(jamforelse, svampar) {
    const artikel = document.createElement("article");
    artikel.className = "jamforelse";

    const rubrik = document.createElement("h3");
    rubrik.textContent = jamforelse.par;

    const risk = document.createElement("details");
    const kortText = document.createElement("summary");
    const langText = document.createElement("p");
    risk.className = "risk";
    const riskFaktor = jamforelse.risk.split(" – ")[0];
    kortText.textContent = "Risk: " + riskFaktor;
    const riskBeskrivning = jamforelse.risk;
    langText.textContent = riskBeskrivning;
    risk.appendChild(kortText);
    risk.appendChild(langText);


    // Väljer färg på riskrutan utifrån risktexten
    if (jamforelse.risk.includes("Låg")) {
        risk.classList.add("green");
    } else if (jamforelse.risk.includes("Oätlig")) {
        risk.classList.add("yellow");
    } else {
        risk.classList.add("red");
    }

    // Använder funktionerna för att skapa bilderna och punktlistan
    const bildcontainer = skapaBilder(jamforelse, svampar);
    const punktlista = skapaPunktlista(jamforelse.särskiljande);

    // Samlar bilderna och punktlistan i en gemensam div
    const innehall = document.createElement("div");
    innehall.className = "jamforelse-innehall";
    innehall.append(bildcontainer, punktlista);

    // Lägger till allt innehåll i artikeln och returnerar den
    artikel.append(rubrik, risk, innehall);

    return artikel;
}

// Hittar svampar som nämns i rubriken och skapar deras bilder
function skapaBilder(jamforelse, svampar) {
    const bildcontainer = document.createElement("div");
    bildcontainer.className = "jamforelse-bilder";

    svampar.forEach(svamp => {
        const rubrik = jamforelse.par;
        const namn = svamp.svenskt_namn;

        if (rubrik.includes(namn)) {
            const figur = document.createElement("figure");

            const bild = document.createElement("img");

            // Byter "./" i bildens sökväg till vår bildmapp
            bild.src = svamp.bild.replace("./", "img/");
            bild.alt = svamp.svenskt_namn;

            const bildtext = document.createElement("figcaption");
            bildtext.textContent = svamp.svenskt_namn;

            figur.append(bild, bildtext);
            bildcontainer.appendChild(figur);
        }
    });

    return bildcontainer;
}

// Skapar en punktlista med de särskiljande egenskaperna
function skapaPunktlista(egenskaper) {
    const punktlista = document.createElement("ul");

    // Skapar en punkt för varje egenskap och lägger till den i listan
    egenskaper.forEach(egenskap => {
        const punkt = document.createElement("li");
        punkt.textContent = egenskap;

        punktlista.appendChild(punkt);
    });

    return punktlista;
}
// Startar sidan när den har laddats
window.onload = init;