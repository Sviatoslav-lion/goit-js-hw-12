import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery, showNoResultsMessage, showLoadingIndicator, hideLoadingIndicator, showEndOfResultsMessage } from './js/render-functions.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('.search-input');
const loader = document.querySelector('.loader'); // Отримуємо індикатор завантаження
const gallery = document.querySelector('.gallery'); // Галерея
const loadMoreButton = document.querySelector('#load-more'); // Кнопка Load more
let currentPage = 1;
let query = ''; // Для збереження запиту користувача
let totalHits = 0; // Загальна кількість зображень

console.log(iziToast);  // iziToast, якщо бібліотека підключена

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log('Search button clicked');
  query = input.value.trim();

  if (query === '') return;

  currentPage = 1; // Скидаємо сторінку на 1 при новому запиті

  // Показуємо loader
  showLoadingIndicator('search');

  //loader.style.display = 'block'; // Показуємо індикатор завантаження
  loadMoreButton.style.display = 'none'; // Ховаємо кнопку "Load more" при новому запиті

  // Очищаємо галерею перед новим пошуком
  gallery.innerHTML = '';

  try {
    const { images, totalHits: fetchedTotalHits } = await fetchImages(query, currentPage);

    hideLoadingIndicator(); // Приховуємо індикатор завантаження
    totalHits = fetchedTotalHits;

    if (images.length > 0) {
      renderImages(images); // Відображаємо зображення
      if (images.length < totalHits) {
        loadMoreButton.style.display = 'block'; // Показуємо кнопку "Load more", якщо є ще зображення
      } else {
        showEndOfResultsMessage(); // Якщо зображення закінчились
      }
    } else {
      showNoResultsMessage(); // Якщо немає результатів
    }
  } catch (error) {
    hideLoadingIndicator(); // Приховуємо індикатор у разі помилки
    iziToast.error({
      title: 'Sorry',
      message: 'An error occurred while fetching the images.',
    });
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage += 1; // Збільшуємо номер сторінки

   // Показуємо loader під кнопкою
   showLoadingIndicator('loadMore');

  // Затримка перед відображенням галереї (можна змінити 1500 на бажану кількість мілісекунд)
  setTimeout(() => {
  }, 5500); // Затримка в 1.5 секунди (можна змінити)
  try {
   
    const { images } = await fetchImages(query, currentPage);

    hideLoadingIndicator(); // Приховуємо індикатор завантаження
    
    if (images.length > 0) {
  
      renderImages(images); // Додаємо нові зображення
    
      if (gallery.children.length >= totalHits) {
        loadMoreButton.style.display = 'none'; // Ховаємо кнопку, якщо всі зображення завантажено
        showEndOfResultsMessage(); // Показуємо повідомлення про кінець колекції
      }
            // Додавання цієї частини в функцію loadImages після renderImages()
            scrollToNextImages();
    } else {
      loadMoreButton.style.display = 'none'; // Ховаємо кнопку, якщо зображення більше не доступні
      showEndOfResultsMessage();
    }
  } catch (error) {
    hideLoadingIndicator(); // Приховуємо індикатор у разі помилки
    iziToast.error({
      title: 'Sorry',
      message: 'An error occurred while fetching the images.',
    });
  }

});

// Функція для прокручування сторінки
const scrollToNextImages = () => {
  // Отримуємо висоту однієї картки галереї
  const galleryItem = document.querySelector('.gallery-item');
  const galleryItemHeight = galleryItem.getBoundingClientRect().height;

  // Плавно прокручуємо сторінку на дві висоти картки
  window.scrollBy({
    top: 2 * galleryItemHeight,  // Прокручуємо на дві висоти картки
    behavior: 'smooth'  // Плавна прокрутка
  });
};