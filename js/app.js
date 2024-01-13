// Variables and selectors
const $result = document.querySelector("#resultado");
const $form = document.querySelector("#formulario");
const $pagination = document.querySelector("#paginacion");

const imagesPerPage = 30;
let totalPages = 0;
let actualPage = 1;

// On load
window.addEventListener("load", () => {
  $form.addEventListener("submit", validateForm);
});

// Functions
function validateForm(e) {
  e.preventDefault();
  const input = document.querySelector("#termino").value;
  actualPage = 1;

  if (input.trim() === "") {
    showError("Ingresa un término de búsqueda");
    return;
  }

  searchImages();
}

function showError(msg) {
  if (document.querySelector(".alert")) {
    return;
  }

  const $alert = document.createElement("p");

  $alert.classList.add(
    "bg-red-200",
    "border-red-500",
    "text-red-700",
    "px-4",
    "py-3",
    "rounded",
    "max-w-lg",
    "mx-auto",
    "mt-6",
    "text-center",
    "alert"
  );

  $alert.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block sm:inline">${msg}</span>
  `;

  $form.appendChild($alert);

  setTimeout(() => {
    $alert.remove();
  }, 2000);
}

function searchImages() {
  const input = document.querySelector("#termino").value;

  const API_KEY = "41783426-796452a40e4a9900db65b9de1";
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${input}&per_page=${imagesPerPage}&page=${actualPage}`;

  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      totalPages = getTotalPages(data.totalHits);
      showImages(data.hits);
    });
}

function showImages(images) {
  console.log(images);

  // Clean HTML
  while ($result.firstChild) {
    $result.removeChild($result.firstChild);
  }

  if (images.length === 0) {
    showError("No hay resultados");
    return;
  }

  images.forEach((image) => {
    const { previewURL, largeImageURL, likes } = image;

    $result.innerHTML += `
      <div class="w-1/2 md:w-1/3 lg:w-1/5 p-3">
        <div class="bg-white">
          <img
          src="${previewURL}"
          class="w-full"
          />
          <div class="p-4">
            <p class="font-bold text-center">${likes} Me Gusta</p>
            <a class="block w-full bg-blue-800 hover:bg-blue-700 text-white uppercase font-bold text-center rounded" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
        </div>
      </div>
    `;
  });

  showPager();
}

function getTotalPages(total) {
  return Math.ceil(total / imagesPerPage);
}

// Generator function that register the elements amount per page.
function* createPager(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function showPager() {
  cleanPaginator();
  const iterator = createPager(totalPages);

  while (true) {
    const { done, value } = iterator.next();

    if (done) return;

    const $btn = document.createElement("a");

    $btn.textContent = value;
    $btn.href = "#";
    $btn.dataset.page = value;
    $btn.textContent = value;
    $btn.classList.add(
      "siguiente",
      "bg-blue-400",
      "mx-1",
      "px-3",
      "p-1",
      "rounded",
      "text-white",
      "mb-5"
    );

    if (value === actualPage) {
      $btn.classList.add("bg-blue-700");
    }

    $btn.onclick = (e) => {
      actualPage = value;

      searchImages();
    };

    $pagination.appendChild($btn);
  }
}

function cleanPaginator() {
  while ($pagination.firstChild) {
    $pagination.removeChild($pagination.firstChild);
  }
}
