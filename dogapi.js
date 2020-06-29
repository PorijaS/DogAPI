//GLOBAL VARIABLES
const dogList = document.getElementById("doggoDropDown");
const listButton = document.querySelector(".list");
//spinner

//EVENT LISTENERS
// window load
window.addEventListener("load", populateList);
//click and change
dogList.addEventListener("change", getBreedImage);
listButton.addEventListener("click", getBreedImage);


//populate List
function populateList() {
  fetch("https://dog.ceo/api/breeds/list/all")
    .then(checkStatus)
    .then((response) => response.json())
    .then((data) => createListItems(data.message))
    .catch((error) => notifyUser(error));
}

//getBreedImage
function getBreedImage() {
  //get list value
  var selectedBreed = dogList.options[dogList.selectedIndex].value;
  //build url
  var url = `https://dog.ceo/api/breed/${selectedBreed}/images`;
  //fetch call
  fetch(url)
    .then(checkStatus)
    .then((response) => response.json())
    .then((data) => getImageURL(data.message))
    .catch((error) => console.log(error));
}


//HELPER FUNCTIONS
//checkStatus
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}



//getImageURL
function getImageURL(data) {
  //get random number
  var randomNumberURL = data[Math.floor(Math.random() * data.length) + 1];
  listImageContainer.innerHTML = `<img src="${randomNumberURL}" alt="${extractBreedName(
    data
  )}"/>`;
}

//createListItems
function createListItems(data) {
  var output = "";
  Object.keys(data).forEach(
    (key) => (output += `<option value="${key}">${fixBreed(key)}</option>`)
  );
  document.getElementById("doggoDropDown").innerHTML = output;
}

//notifyUser
function notifyUser(error) {
  const errorContainer = document.querySelector(".alert");
  errorContainer.innerHTML = `There was an error with the server request (${error}). <br> Click the button again.`;
  errorContainer.style.display = "block";
  setTimeout(() => {
    errorContainer.innerHTML = "";
    errorContainer.style.display = "none";
  }, 4000);
}

//fixBreed
function fixBreed(breedName) {
  if (breedName === "germanshepherd") {
    return "German Shepherd";
  } else if (breedName === "mexicanhairless") {
    return "Mexican Hairless";
  } else if (breedName === "stbernard") {
    return "St. Bernard";
  } else if (breedName === "african") {
    return "African Wild Dog";
  } else if (breedName === "bullterrier") {
    return "Bull Terier";
  }
  return capitalize(breedName);
}

//capitalize breed name
function capitalize(breedName) {
  return breedName
    .replace(/\-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

//extract breed name
function extractBreedName(data) {
  var regex = /https:\/\/images\.dog\.ceo\/breeds\/(\w+-?\w+)\/\w+\.\w+/g;
  var match = regex.exec(data);
  return fixBreed(match[1]);
}
