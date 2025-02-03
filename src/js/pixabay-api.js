// pixabay-api.js

export const fetchImages = async (query, page = 1, perPage = 40) => {
  const API_KEY = '48615456-7478b61ba219341e00e1cbdfc'; // ключ API

  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  
  console.log(URL); // Вивести URL для перевірки
    
  try {
    // Використовуємо axios для отримання даних
    const response = await axios.get(URL);

    // Виводимо загальний розмір колекції
    console.log(`Total images found: ${response.data.totalHits}`);
  
       // Перевіряємо, чи є необхідні дані
       if (!response.data.hits || response.data.hits.length === 0) {
        console.log(`No images found for query: ${query}`); // Додаткове логування
        throw new Error('No images found for the given search query.');
      }
      console.log(`Found ${response.data.totalHits} images.`); // Логування кількості знайдених зображень
    // Повертаємо масив зображень і загальну кількість
    return {
      images: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error(error.message); // Перекидаємо помилку далі
  }
};