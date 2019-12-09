let div = document.querySelectorAll(".burrowList_modelsSplit");
//let burrowID = div.getAttribute("burrow-id");

function showDetails(id) {
    //  var burrowID = id.getAttribute("data-animal-type");
    window.location.href = "burrow/view/" + id;
}

//div[0].addEventListener("click", () => window.location.href = "burrow/view/" + burrowID);