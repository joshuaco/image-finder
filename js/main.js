const $form = document.querySelector("#search-form");

$form.addEventListener("submit", getImages);

async function getImages(event) {
  event.preventDefault();
  const $input = document.querySelector("#search");

  if ($input.value === "") {
    alert("Please enter a search term");
    return;
  }

  const url = `https://pixabay.com/api/?key=41783426-796452a40e4a9900db65b9de1&q=${$input.value}&per_page=100&image_type=photo`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.hits.length === 0) {
    alert("No images found");
    return;
  }

  console.log(data);

  displayImages(data.hits);
}

function displayImages(images) {
  cleanHTML();
  const $section = document.querySelector("section");

  images.forEach((image) => {
    const $img = document.createElement("img");
    $img.src = image.webformatURL;
    $img.alt = image.tags;
    $section.appendChild($img);
  });
}

function cleanHTML() {
  const $section = document.querySelector("section");
  while ($section.firstChild) {
    $section.removeChild($section.firstChild);
  }
}
