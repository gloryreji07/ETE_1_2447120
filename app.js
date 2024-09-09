document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const pagination = document.getElementById('pagination');
    
    let newsData = [];
    let currentPage = 1;
    const itemsPerPage = 2;
  
    
  
    const fetchNews = async () => {
      const response = await fetch('news.json');
      newsData = await response.json();
      displayNews();
    };
  
    const displayNews = () => {
      let filteredNews = newsData.filter(item => 
        item.title.toLowerCase().includes(searchInput.value.toLowerCase()) || 
        item.author.toLowerCase().includes(searchInput.value.toLowerCase())
      );
      
      if (sortSelect.value === 'author') {
        filteredNews.sort((a, b) => a.author.localeCompare(b.author));
      } else {
        filteredNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      }
  
      const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
      const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
      newsContainer.innerHTML = paginatedNews.map(newsItem => `
        <div class="news-item">
          <h3>${newsItem.title}</h3>
          <p><strong>${newsItem.author}</strong> - ${new Date(newsItem.publishedAt).toLocaleDateString()}</p>
          <img src="${newsItem.urlToImage}" alt="${newsItem.title}">
          <p>${newsItem.description}</p>
          <a href="${newsItem.url}" target="_blank">Read more</a>
        </div>
      `).join('');
  
      pagination.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => {
          currentPage = i;
          displayNews();
        });
        pagination.appendChild(button);
      }
    };
  
    searchInput.addEventListener('input', displayNews);
    sortSelect.addEventListener('change', displayNews);
    fetchNews();
  });