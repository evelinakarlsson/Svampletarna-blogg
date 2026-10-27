"use strict";
// skapar en tom array som används för att lagra blogginläggen medan sidan är igång
const inlagg = [];
// Hämtar HTML-element som innehåller formuläret för att skriva inlägg
// <HTMLElement> anger vilken sorts HTML-element vi förväntar oss. querySelector returnerar null om elementet inte finns.
const skrivInlagg = document.querySelector("#skriv-inlagg");
// Hämtar elementet som visar ett meddelande om användaren inte är inloggad.
const meddelande = document.querySelector("#inloggningsmeddelande");
// Hämtar formuläret där användaren skriver ett nytt blogginlägg
const bloggformular = document.querySelector("#bloggformular");
// Hämtar inmatningsfältet där användaren skriver inläggets titel.
const titelInput = document.querySelector("#titel");
// Hämtar textområdet där användaren skriver inläggets innehåll.
const textInput = document.querySelector("#text");
// Hämtar namnet på den inloggade användaren från localStorage. Returnerar användarnamnet som en sträng om någon är inloggad,
// annars returneras null.
function hamtaInloggadAnvandare() {
    return localStorage.getItem("inloggadAnvandare");
}
// Skapar dagens datum och formaterar det enligt svensk standard.
// Datumet returneras som en sträng, exempelvis "2026-10-26".
function hamtaDatum() {
    return new Date().toLocaleDateString("sv-SE");
}
// Startfunktion som förbereder sidan när JavaScript-koden körs. Den kontrollerar inloggningen, 
// kopplar formulärets händelse och hämtar samt visar tidigare sparade blogginlägg.
function init() {
    // Kontrollerar om användaren är inloggad och visar rätt innehåll.
    kontrolleraInloggning();
    // Kontrollerar att formuläret finns innan addEventListener läggs till.
    // När användaren skickar formuläret körs funktionen publiceraInlagg.
    if (bloggformular !== null) {
        bloggformular.addEventListener("submit", publiceraInlagg);
    }
    // Hämtar tidigare sparade blogginlägg från webbläsaren.
    hamtaInlagg();
    // Visar de hämtade blogginläggen på sidan.
    visaInlagg();
}
// Visar eller döljer formuläret beroende på om användaren är inloggad.
function kontrolleraInloggning() {
    // Hämtar den inloggade användarens namn.
    const inloggadAnvandare = hamtaInloggadAnvandare();
    // Avbryter funktionen om något av HTML-elementen saknas. Detta förhindrar att koden 
    // försöker ändra element som inte finns.
    if (skrivInlagg === null || meddelande === null) {
        return;
    }
    // Om användaren är inloggad visas formuläret och meddelandet döljs.
    if (inloggadAnvandare !== null) {
        skrivInlagg.hidden = false;
        meddelande.hidden = true;
    }
    else {
        // Om användaren inte är inloggad döljs formuläret och ett meddelande om inloggning visas.
        skrivInlagg.hidden = true;
        meddelande.hidden = false;
    }
}
// Läser formulärets innehåll och skapar ett nytt blogginlägg.
function publiceraInlagg(event) {
    // Förhindrar webbläsarens standardbeteende att ladda om sidan när formuläret skickas.
    event.preventDefault();
    const inloggadAnvandare = hamtaInloggadAnvandare();
    // Avbryter om något inmatningsfält saknas eller om ingen användare är inloggad.
    if (titelInput === null || textInput === null || inloggadAnvandare === null) {
        return;
    }
    // Hämtar texten från formuläret och tar bort mellanslag i början och slutet av texten.
    const titel = titelInput.value.trim();
    const text = textInput.value.trim();
    // Kontrollerar att både titeln och texten innehåller något. Om något fält är tomt avbryts publiceringen.
    if (titel === "" || text === "") {
        return;
    }
    // Skapar ett nytt objekt som följer typen Blogginlagg. Användaren hämtas från inloggningen, datumet från funktionen
    // hamtaDatum() och kommentarerna börjar som en tom array.
    const nyttInlagg = {
        titel: titel,
        anvandare: inloggadAnvandare,
        text: text,
        datum: hamtaDatum(),
        kommentarer: []
    };
    // Lägger det nya inlägget först i arrayen så att det visas överst på sidan.
    inlagg.unshift(nyttInlagg);
    // Sparar den uppdaterade arrayen i webbläsarens localStorage.
    sparaInlagg();
    // Uppdaterar visningen så att det nya inlägget syns på sidan.
    visaInlagg();
    // Tömmer formulärets fält efter att inlägget har publicerats.
    if (bloggformular !== null) {
        bloggformular.reset();
    }
}
// Visar alla blogginlägg som finns i arrayen på sidan.
function visaInlagg() {
    const behallare = document.querySelector("#blogginlagg");
    // Avslutar funktionen om behållaren inte finns på sidan.
    if (behallare === null) {
        return;
    }
    // Tömmer behållaren innan inläggen visas på nytt. Det förhindrar att samma inlägg läggs till flera gånger
    // när funktionen körs igen.
    behallare.textContent = "";
    // Skapar en artikel för varje inlägg och lägger in den i behållaren
    for (const inlaggObjekt of inlagg) {
        behallare.appendChild(skapaArtikel(inlaggObjekt));
    }
}
// Skapar en HTML-artikel för ett blogginlägg. Artikeln innehåller rubrik, information om författaren,
// inläggstext, kommentarer och eventuellt ett kommentarsformulär.
function skapaArtikel(inlaggObjekt) {
    const artikel = document.createElement("article");
    // Skapar en rubrik och fyller den med inläggets titel.
    const rubrik = document.createElement("h3");
    rubrik.textContent = inlaggObjekt.titel;
    // Rad som visar vem som skrev inlägget och vilket datum det publicerades.
    const information = document.createElement("p");
    information.textContent = inlaggObjekt.anvandare + " | " + inlaggObjekt.datum;
    // Skapar ett stycke som visar själva inläggstexten. textContent gör att innehållet behandlas som vanlig text.
    const text = document.createElement("p");
    text.textContent = inlaggObjekt.text;
    // Skapar en underrubrik för kommentarerna
    const kommentarsrubrik = document.createElement("h4");
    kommentarsrubrik.textContent = "Kommentarer";
    // Lägger till elementen i artikeln i den ordning de ska visas. 
    artikel.append(rubrik, information, text, kommentarsrubrik);
    // Hämtar och visar alla kommentarer som hör till inlägget
    visaKommentarer(inlaggObjekt, artikel);
    // Om en användare är inloggad visas ett formulär där användaren kan skriva en kommentar.
    if (hamtaInloggadAnvandare() !== null) {
        artikel.appendChild(skapaKommentarsformular(inlaggObjekt));
    }
    // Skickar tillbaka den färdiga artikeln till funktionen som anropade skapaArtikel.
    return artikel;
}
// Visar alla kommentarer som tillhör ett visst blogginlägg.
function visaKommentarer(inlaggObjekt, artikel) {
    // Går igenom varje kommentar som finns i inläggets kommentarsarray.
    for (const kommentar of inlaggObjekt.kommentarer) {
        // Skapar en div som fungerar som behållare för kommentaren och ger den en CSS-klass så att den kan stylas med CSS.
        const kommentarsruta = document.createElement("div");
        kommentarsruta.className = "kommentar";
        // Skapar ett stycke som visar kommentarens författare och datum.
        const kommentarInfo = document.createElement("p");
        kommentarInfo.textContent = kommentar.anvandare + " | " + kommentar.datum;
        // Skapar ett stycke som visar själva kommentaren.
        const kommentarText = document.createElement("p");
        kommentarText.textContent = kommentar.text;
        // Lägger till informationen och texten i kommentarsrutan, och placerar sedan kommentarsrutan i i blogginläggets artikel.
        kommentarsruta.append(kommentarInfo, kommentarText);
        artikel.appendChild(kommentarsruta);
    }
}
// Skapar ett formulär som gör det möjligt att kommentera ett blogginlägg.
// Funktionen tar emot inlägget så att kommentaren sparas på rätt ställe.
function skapaKommentarsformular(inlaggObjekt) {
    const kommentarForm = document.createElement("form");
    // Skapar en etikett som beskriver vad användaren ska skriva.
    const etikett = document.createElement("label");
    etikett.textContent = "Skriv en kommentar";
    // Skapar en textruta där användaren kan skriva sin kommentar. Fältet är obligatoriskt så att formuläret inte skickas tomt.
    // rows anger textrutans synliga höjd i antal textrader.
    const kommentarInput = document.createElement("textarea");
    kommentarInput.required = true;
    kommentarInput.rows = 2;
    // Placerar textrutan inuti etiketten så att de kopplas ihop. 
    etikett.appendChild(kommentarInput);
    // Skapar en knapp som skickar kommentarsformuläret.
    const knapp = document.createElement("button");
    knapp.type = "submit";
    knapp.textContent = "Kommentera";
    // Lägger till etiketten och knappen i formuläret.
    kommentarForm.append(etikett, knapp);
    // Kör funktionen när användaren skickar kommentarsformuläret.
    kommentarForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const inloggadAnvandare = hamtaInloggadAnvandare();
        // Avbryter om användaren inte längre är inloggad.
        if (inloggadAnvandare === null) {
            return;
        }
        // Hämtar kommentaren och tar bort blanktecken i början och slutet.
        const kommentarText = kommentarInput.value.trim();
        // Avbryter om kommentaren är tom eller bara innehåller mellanslag.
        if (kommentarText === "") {
            return;
        }
        // Skapar ett nytt kommentarobjekt med användarens namn, kommentarens text och dagens datum.
        const nyKommentar = {
            anvandare: inloggadAnvandare,
            text: kommentarText,
            datum: hamtaDatum()
        };
        // Lägger till kommentaren i det aktuella blogginläggets array.
        inlaggObjekt.kommentarer.push(nyKommentar);
        // Sparar alla blogginlägg inklusive den nya kommentaren och uppdaterar sidan så att den nya kommentaren visas.
        sparaInlagg();
        visaInlagg();
    });
    return kommentarForm;
}
// Sparar alla blogginlägg i webbläsarens localStorage. JSON.stringify omvandlar arrayen från JavaScript till en textsträng,
// eftersom localStorage bara kan lagra värden som strängar. Informationen finns kvar efter att sidan laddats om.
function sparaInlagg() {
    localStorage.setItem("blogginlagg", JSON.stringify(inlagg));
}
// Hämtar tidigare sparade blogginlägg från webbläsarens localStorage.
function hamtaInlagg() {
    const sparadeInlagg = localStorage.getItem("blogginlagg");
    // Om det inte finns några sparade inlägg avslutas funktionen.
    if (sparadeInlagg === null) {
        return;
    }
    // try/catch fångar felet om den sparade texten inte är giltig JSON, så att hela sidan inte kraschar
    try {
        // Omvandlar JSON-texten till en array med blogginlägg.
        const hamtadeInlagg = JSON.parse(sparadeInlagg);
        for (const inlaggObjekt of hamtadeInlagg) {
            inlagg.push(inlaggObjekt);
        }
    }
    catch (error) {
        // Skriver ett felmeddelande i webbläsarens konsol om inläsningen misslyckas.
        console.error("Det gick inte att läsa sparade blogginlägg:", error);
    }
}
// Anropar startfunktionen när skriptet körs. 
init();
