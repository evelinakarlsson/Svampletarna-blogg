let mushroomsJSON = fetch("./json/svampar.json")
    .then(r => r.json());


async function init() {
    mushroomsJSON = await mushroomsJSON;
    let mushrooms = mushroomsJSON.svampar;

    const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

    mushrooms.forEach(mushroom => {
        const mushroomElement = createMushroomElement(mushroom);
        const button = mushroomElement.querySelector(".btn-find");

        if (savedMushrooms.includes(mushroom.svenskt_namn)) {
            button.hidden = true;
        }
    });

    const btnFind = document.querySelectorAll(".btn-find");

    btnFind.forEach(btnFind => {
        btnFind.addEventListener("click", e => {
            const mushroomId = e.currentTarget.dataset.svampId;

            const savedMushrooms = JSON.parse(localStorage.getItem("mushrooms")) || [];

            if (!savedMushrooms.includes(mushroomId)) {
                savedMushrooms.push(mushroomId);
            }

            localStorage.setItem("mushrooms", JSON.stringify(savedMushrooms)
            )

            btnFind.hidden = true;
        })
    })
}

window.onload = init;