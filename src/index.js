import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

let page = 1;

async function fetchPhotos(currPage) {
  return await axios.get(
    `https://pixabay.com/api/?key=30059252-fce911be355cbdd889b3b7d8d&q=${searchInput.value
      .trim()
      .split(' ')
      .join(
        '+'
      )}&image_type=photo&orientation=horizontal&safesearch=true&page=${currPage}&per_page=40`
  );
}

function renderGallery(response) {
  if (!response.data.total) {
    return '';
  }

  return response.data.hits
    .map(
      photo => `<div class="photo-card">
<img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
<div class="info">
  <p class="info-item">
    <b>Likes</b><span>${photo.likes}</span>
  </p>
  <p class="info-item">
    <b>Views</b><span>${photo.views}</span>
  </p>
  <p class="info-item">
    <b>Comments</b><span>${photo.comments}</span>
  </p>
  <p class="info-item">
    <b>Downloads</b><span>${photo.downloads}</span>
  </p>
</div>
</div>`
    )
    .join('');
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    moreBtn.classList.add('visually-hidden');
    page = 1;
    const response = await fetchPhotos(page);
    page += 1;
    const markup = renderGallery(response);
    if (!markup) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML = markup;
    moreBtn.classList.remove('visually-hidden');
  } catch (error) {
    console.log(error);
  }
});

moreBtn.addEventListener('click', async () => {
  try {
    moreBtn.classList.add('visually-hidden');
    const response = await fetchPhotos(page);
    const markup = renderGallery(response);
    gallery.insertAdjacentHTML('beforeend', markup);
    if (page > Math.floor(response.data.totalHits / 40)) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
    moreBtn.classList.remove('visually-hidden');
    page += 1;
  } catch (error) {
    console.log(error);
  }
});
