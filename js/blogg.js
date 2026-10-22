"use strict";
// skapar en tom array för att samla blogginläggen
const inlagg = [];
// Hämtar sektionen med formuläret och inloggningsmeddelandet
const skrivInlagg = document.querySelector("#skriv-inlagg");
const meddelande = document.querySelector("#inloggningsmeddelande");
// Hämtar formuläret och dess inmatningsfält
const bloggformular = document.querySelector("#bloggformular");
const titelInput = document.querySelector("#titel");
const textInput = document.querySelector("#text");
// Returnerar den inloggade användaren, eller null om ingen är inloggad
function hamtaInloggadAnvandare() {
    return localStorage.getItem("inloggadAnvandare");
}
// Returnerar dagens datum som text
function hamtaDatum() {
    return new Date().toLocaleDateString("sv-SE");
}
// Startar sidan
function init() {
    kontrolleraInloggning();
    // Kör funktionen när formuläret skickas
    if (bloggformular !== null) {
        bloggformular.addEventListener("submit", publiceraInlagg);
    }
    hamtaInlagg();
    visaInlagg();
}
// Visar formuläret eller meddelandet beroende på inloggningen
function kontrolleraInloggning() {
    const inloggadAnvandare = hamtaInloggadAnvandare();
    if (skrivInlagg === null || meddelande === null) {
        return;
    }
    if (inloggadAnvandare !== null) {
        skrivInlagg.hidden = false;
        meddelande.hidden = true;
    }
    else {
        skrivInlagg.hidden = true;
        meddelande.hidden = false;
    }
}
// Skapar ett blogginlägg av informationen i formuläret
function publiceraInlagg(event) {
    // Förhindrar att sidan laddas om
    event.preventDefault();
    const inloggadAnvandare = hamtaInloggadAnvandare();
    // Avbryter om fälten saknas eller användaren inte är inloggad
    if (titelInput === null || textInput === null || inloggadAnvandare === null) {
        return;
    }
    const titel = titelInput.value.trim();
    const text = textInput.value.trim();
    // Avbryter om något fält är tomt eller bara innehåller mellanslag
    if (titel === "" || text === "") {
        return;
    }
    const nyttInlagg = {
        titel: titel,
        anvandare: inloggadAnvandare,
        text: text,
        datum: hamtaDatum(),
        kommentarer: []
    };
    inlagg.push(nyttInlagg);
    sparaInlagg();
    // Uppdaterar sidan och tömmer formuläret
    visaInlagg();
    if (bloggformular !== null) {
        bloggformular.reset();
    }
}
// Visar blogginläggen på sidan
function visaInlagg() {
    const behallare = document.querySelector("#blogginlagg");
    if (behallare === null) {
        return;
    }
    // Tömmer behållaren så att samma inlägg inte visas flera gånger
    behallare.textContent = "";
    for (const inlaggObjekt of inlagg) {
        behallare.appendChild(skapaArtikel(inlaggObjekt));
    }
}
// Skapar och returnerar en artikel med inlägg, kommentarer och formulär
function skapaArtikel(inlaggObjekt) {
    const artikel = document.createElement("article");
    const rubrik = document.createElement("h3");
    rubrik.textContent = inlaggObjekt.titel;
    const information = document.createElement("p");
    information.textContent = inlaggObjekt.anvandare + " | " + inlaggObjekt.datum;
    const text = document.createElement("p");
    text.textContent = inlaggObjekt.text;
    const kommentarsrubrik = document.createElement("h4");
    kommentarsrubrik.textContent = "Kommentarer";
    artikel.append(rubrik, information, text, kommentarsrubrik);
    // Visar kommentarerna som hör till inlägget
    visaKommentarer(inlaggObjekt, artikel);
    // Visar kommentarsformuläret för inloggade användare
    if (hamtaInloggadAnvandare() !== null) {
        artikel.appendChild(skapaKommentarsformular(inlaggObjekt));
    }
    return artikel;
}
// Skapar en ruta för varje kommentar och lägger den i artikeln
function visaKommentarer(inlaggObjekt, artikel) {
    for (const kommentar of inlaggObjekt.kommentarer) {
        const kommentarsruta = document.createElement("div");
        kommentarsruta.className = "kommentar";
        const kommentarInfo = document.createElement("p");
        kommentarInfo.textContent = kommentar.anvandare + " | " + kommentar.datum;
        const kommentarText = document.createElement("p");
        kommentarText.textContent = kommentar.text;
        kommentarsruta.append(kommentarInfo, kommentarText);
        artikel.appendChild(kommentarsruta);
    }
}
// Skapar ett kommentarsformulär som hör till ett visst inlägg
function skapaKommentarsformular(inlaggObjekt) {
    const kommentarForm = document.createElement("form");
    const etikett = document.createElement("label");
    etikett.textContent = "Skriv en kommentar";
    const kommentarInput = document.createElement("textarea");
    kommentarInput.required = true;
    kommentarInput.rows = 2;
    // Etiketten omsluter fältet så att de hör ihop
    etikett.appendChild(kommentarInput);
    const knapp = document.createElement("button");
    knapp.type = "submit";
    knapp.textContent = "Kommentera";
    kommentarForm.append(etikett, knapp);
    // Sparar kommentaren när formuläret skickas
    kommentarForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const inloggadAnvandare = hamtaInloggadAnvandare();
        if (inloggadAnvandare === null) {
            return;
        }
        const kommentarText = kommentarInput.value.trim();
        if (kommentarText === "") {
            return;
        }
        const nyKommentar = {
            anvandare: inloggadAnvandare,
            text: kommentarText,
            datum: hamtaDatum()
        };
        inlaggObjekt.kommentarer.push(nyKommentar);
        sparaInlagg();
        visaInlagg();
    });
    return kommentarForm;
}
// Sparar blogginläggen i webbläsaren
function sparaInlagg() {
    localStorage.setItem("blogginlagg", JSON.stringify(inlagg));
}
// Hämtar tidigare sparade inlägg från webbläsaren
function hamtaInlagg() {
    const sparadeInlagg = localStorage.getItem("blogginlagg");
    if (sparadeInlagg === null) {
        return;
    }
    try {
        const hamtadeInlagg = JSON.parse(sparadeInlagg);
        for (const inlaggObjekt of hamtadeInlagg) {
            // Ger äldre inlägg en tom kommentarsarray om den saknas
            if (inlaggObjekt.kommentarer === undefined) {
                inlaggObjekt.kommentarer = [];
            }
            inlagg.push(inlaggObjekt);
        }
    }
    catch (error) {
        console.error("Det gick inte att läsa sparade blogginlägg:", error);
    }
}
init();
