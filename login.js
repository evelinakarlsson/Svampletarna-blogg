// Deklarerar konstanter för rätt namn och rätt lösenord vid inloggning
const anvandareNamn = ["Kalle", "Lisa", "Olle"];
const anvandareLosenord = ["qwe123", "abc123", "losen123"];

// Hämtar HTML-elementen
const namnInput = document.querySelector("#namn");
const losenordInput = document.querySelector("#losenord");
const msgElem = document.querySelector("#message");
const loginForm = document.querySelector("form");
const logoutBtn = document.querySelector("#logoutBtn");

// Kontrollerar om någon redan är inloggad
const inloggadAnvandare = localStorage.getItem("inloggadAnvandare");

if (inloggadAnvandare !== null) {
    visaInloggad(inloggadAnvandare);
} else {
    loginForm.hidden = false;
    logoutBtn.hidden = true;
}   

// Kopplar funktioner till knapparna, så att något händer när man klickar på dem. När logga in-knappen klickas körs
// funktionen loggaIn och när logga ut-knappen klickas körs loggaUt
loginForm.addEventListener("submit", loggaIn);
logoutBtn.addEventListener("click", loggaUt);

// Funktion som körs när man klickar på logga in-knappen. Kontrollerar inloggningsuppgifterna när formuläret skickas
function loggaIn(event) {
    // Förhindrar att formuläret laddar om sidan
    event.preventDefault();

    const namn = namnInput.value;
    const losenord = losenordInput.value;

    // Hittar positionen för det inskrivna användarnamnet
    const index = anvandareNamn.indexOf(namn);

    // Kontrollerar att namnet finns och att lösenordet på samma position stämmer
    if (index !== -1 && anvandareLosenord[index] === losenord) {
        localStorage.setItem("inloggadAnvandare", namn);

        visaInloggad(namn);
        losenordInput.value = "";
    } else {
        msgElem.textContent = "Felaktiga inloggningsuppgifter";
        msgElem.style.color = "red";
    }
}

// Visar inloggat läge, både vid inloggning och när sidan öppnas igen
function visaInloggad(namn) {
    msgElem.textContent = "Välkommen " + namn + ", du är nu inloggad";
        msgElem.style.color = ""; // Återställer textfärgen om man testat att logga in och uppgivit felaktiga uppgifter,
                                  // för då blir texten röd, och behöver därför nollställas för att välkomsttexten inte också ska bli röd

        // När man är inloggad göms inloggningsformuläret och logga ut-knappen visas
        loginForm.hidden = true;
        logoutBtn.hidden = false;
}

// Denna funktion körs när man klickar på logga ut-knappen
function loggaUt() {
    localStorage.removeItem("inloggadAnvandare");

    // Visar inloggningsformuläret igen, logga ut-knappen döljs, meddelandefältet töms
    loginForm.hidden = false;
    logoutBtn.hidden = true;
    msgElem.textContent = "";

    // Tömmer formulärets inmatningsfält
    loginForm.reset();
}