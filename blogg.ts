// Beskriver vilken information en kommentar ska innehålla
type Kommentar = {
    anvandare: string;
    text: string;
    datum: string;
};

type Blogginlagg = {
    titel: string;
    anvandare: string;
    text: string;
    datum: string;
    kommentarer: Kommentar[];
}

// skapar en tom array för att samla blogginläggen
const inlagg: Blogginlagg[] = [];

// Kontrollerar om någon är inloggad
const anvandare = localStorage.getItem("inloggadAnvandare");

// Hämtar sektionen med formuläret och inloggningsmeddelandet
const skrivInlagg = document.querySelector<HTMLElement>("#skriv-inlagg");
const meddelande = document.querySelector<HTMLElement>("#inloggningsmeddelande");

// Kontrollerar att båda elementen finns
if (skrivInlagg !== null && meddelande !== null) {
    if (anvandare !== null) {
        skrivInlagg.hidden = false;
        meddelande.hidden = true;
    } else {
        skrivInlagg.hidden = true;
        meddelande.hidden = false;
    }
}
// Hämtar formuläret och dess inmatningsfält
const bloggformular = document.querySelector<HTMLFormElement>("#bloggformular");
const titelInput = document.querySelector<HTMLInputElement>("#titel");
const textInput = document.querySelector<HTMLTextAreaElement>("#text");

// Kör funktionen när formuläret skickas
if (bloggformular !== null) {
    bloggformular.addEventListener("submit", publiceraInlagg);
}

// Skapar ett blogginlägg av informationen i formuläret
function publiceraInlagg(event: Event) {
    // Förhindrar att sidan laddas om
    event.preventDefault();

    const anvandare = localStorage.getItem("inloggadAnvandare");

    // Avbryter om fälten saknas eller användaren inte är inloggad
    if (titelInput === null || textInput === null || anvandare === null) {
        return;
    }

    const titel = titelInput.value.trim();
    const text = textInput.value.trim();

    // Avbryter om något fält är tomt eller bara innehåller mellanslag
    if (titel === "" || text === "") {
        return;
    }

    const nyttInlagg: Blogginlagg = {
        titel: titel,
        anvandare: anvandare,
        text: text,
        datum: new Date().toLocaleDateString("sv-SE"),
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
        const artikel = document.createElement("article");

        const rubrik = document.createElement("h3");
        rubrik.textContent = inlaggObjekt.titel;

        const information = document.createElement("p");
        information.textContent =
        inlaggObjekt.anvandare + " | " + inlaggObjekt.datum;

        const text = document.createElement("p");
        text.textContent = inlaggObjekt.text;

            artikel.append(rubrik, information, text);

            const kommentarsrubrik = document.createElement("h4");
            kommentarsrubrik.textContent = "Kommentarer";
            artikel.appendChild(kommentarsrubrik);

            // Visar kommentarerna som hör till inlägget
            for (const kommentar of inlaggObjekt.kommentarer) {
                const kommentarInfo = document.createElement("p");
                kommentarInfo.textContent =
                    kommentar.anvandare + " | " + kommentar.datum;

                const kommentarText = document.createElement("p");
                kommentarText.textContent = kommentar.text;

                artikel.append(kommentarInfo, kommentarText);
            }

            // Visar kommentarsformuläret för inloggade användare
            if (anvandare !== null) {
                const kommentarForm = document.createElement("form");

                const etikett = document.createElement("label");
                etikett.textContent = "Skriv en kommentar";

                const kommentarInput = document.createElement("textarea");
                kommentarInput.required = true;
                kommentarInput.rows = 3;

                // Etiketten omsluter fältet så att de hör ihop
                etikett.appendChild(kommentarInput);

                const knapp = document.createElement("button");
                knapp.type = "submit";
                knapp.textContent = "Kommentera";

                kommentarForm.append(etikett, knapp);

                kommentarForm.addEventListener("submit", (event) => {
                    event.preventDefault();

                    // Kontrollerar inloggningen igen när kommentaren skickas
                    const aktuellAnvandare =
                        localStorage.getItem("inloggadAnvandare");

                    if (aktuellAnvandare === null) {
                        return;
                    }

                    const kommentarText = kommentarInput.value.trim();

                    if (kommentarText === "") {
                        return;
                    }

                    const nyKommentar: Kommentar = {
                        anvandare: aktuellAnvandare,
                        text: kommentarText,
                        datum: new Date().toLocaleDateString("sv-SE")
                    };

                    inlaggObjekt.kommentarer.push(nyKommentar);
                    sparaInlagg();
                    visaInlagg();
                });

                artikel.appendChild(kommentarForm);
            }

            behallare.appendChild(artikel);
    }
}
// Sparar blogginläggen i webbläsaren
function sparaInlagg() {
    localStorage.setItem("blogginlagg", JSON.stringify(inlagg));
}
// Hämtar tidigare sparade inlägg när sidan öppnas
const sparadeInlagg = localStorage.getItem("blogginlagg");

if (sparadeInlagg !== null) {
    const hamtadeInlagg: Blogginlagg[] = JSON.parse(sparadeInlagg);

    // Ger äldre inlägg en tom kommentarsarray om den saknas
    for (const inlaggObjekt of hamtadeInlagg) {
        if (inlaggObjekt.kommentarer === undefined) {
            inlaggObjekt.kommentarer = [];
        }

        inlagg.push(inlaggObjekt);
    }
}

visaInlagg();