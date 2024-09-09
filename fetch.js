document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://newsapi.org/v2/everything';
    const apiKey = '0ffa3c6bdd9d44b8957ef9f7decd7f77';
    const newsList = document.getElementById('news-list');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const paginationDiv = document.getElementById('pagination');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    let newsArticles = [];
    let currentPage = 1;
    const itemsPerPage = 6;

 
    function fetchNews(query = 'tesla', sortBy = 'publishedAt') {
        const params = new URLSearchParams({
            q: query,
            from: '2024-08-09',
            sortBy: sortBy,
            apiKey: apiKey
        });
        const url = `${apiUrl}?${params.toString()}`;

        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                newsArticles = data.articles.map(article => ({
                    title: article.title,
                    author: article.author,
                    description: article.description,
                    date: article.publishedAt
                }));
                displayNews();
                setupPagination();
            })
            .catch(error => {
                errorDiv.style.display = 'block';
                console.error('Error fetching news:', error);
            })
            .finally(() => {
                loadingDiv.style.display = 'none';
            });
    }

   
    function displayNews() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedNews = newsArticles.slice(startIndex, endIndex);

        newsList.innerHTML = '';
        paginatedNews.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.innerHTML = `
                <h2>${article.title}</h2>
                <p>By ${article.author}</p>
                <p>${article.description}</p>
                <p>Published on ${article.date}</p>
            `;
            newsList.appendChild(newsItem);
        });
    }

    
    function setupPagination() {
        const totalPages = Math.ceil(newsArticles.length / itemsPerPage);
        paginationDiv.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayNews();
            });
            paginationDiv.appendChild(pageButton);
        }
    }

    
    fetchNews();

    
    searchInput.addEventListener('input', () => {
        fetchNews(searchInput.value);
    });

  
    sortSelect.addEventListener('change', () => {
        fetchNews('tesla', sortSelect.value);
    });
});