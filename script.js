const accessKey = 'OlsbF_XehP1fPrg7CTPpG1mLShKKAcPaSl5JgJP2VFA';
let page = 1;
let isLoading = false;

document.addEventListener('DOMContentLoaded', function () {
    fetchRandomImages();
});

document.getElementById('search-button').addEventListener('click', function () {
    const query = document.getElementById('search-bar').value;
    if (query) {
        page = 1; // Reset to the first page for a new search
        document.getElementById('image-gallery').innerHTML = ''; // Clear previous results
        searchImages(query);
    }
});

window.addEventListener('scroll', debounce(function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        page++;
        const query = document.getElementById('search-bar').value;
        if (query) {
            searchImages(query);
        } else {
            fetchRandomImages();
        }
    }
}, 200));

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function fetchRandomImages() {
    const url = `https://api.unsplash.com/photos?client_id=${accessKey}&page=${page}&per_page=30`;
    document.getElementById('loading-indicator').classList.remove('hidden');
    isLoading = true;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading-indicator').classList.add('hidden');
            displayImages(data);
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching random images:', error);
            isLoading = false;
        });
}

function searchImages(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&page=${page}&per_page=30`;
    document.getElementById('loading-indicator').classList.remove('hidden');
    isLoading = true;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading-indicator').classList.add('hidden');
            displayImages(data.results);
            isLoading = false;
        })
        .catch(error => {
            console.error('Error searching images:', error);
            isLoading = false;
        });
}

function displayImages(images) {
    const gallery = document.getElementById('image-gallery');
    images.forEach(image => {
        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');
        imageCard.innerHTML = `<img src="${image.urls.small}" alt="${image.alt_description}">`;
        imageCard.addEventListener('click', () => showImageDetails(image));
        gallery.appendChild(imageCard);
    });
}

function showImageDetails(image) {
    document.getElementById('details-image').src = image.urls.regular;
    document.getElementById('details-author').innerText = `Author: ${image.user.name}`;
    document.getElementById('details-description').innerText = `Description: ${image.alt_description}`;
    document.getElementById('details-likes').innerText = `Likes: ${image.likes}`;
    
    document.getElementById('content-wrapper').classList.add('blurred');
    document.getElementById('image-details').classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');

    document.body.style.overflow = 'hidden';

    document.getElementById('modal-overlay').addEventListener('click', closeImageDetails);
    document.getElementById('close-detail').addEventListener('click', closeImageDetails);
}

function closeImageDetails() {
    document.getElementById('image-details').classList.add('hidden');
    document.getElementById('content-wrapper').classList.remove('blurred');
    document.getElementById('modal-overlay').classList.add('hidden');
    
    document.body.style.overflow = 'auto';

    document.getElementById('modal-overlay').removeEventListener('click', closeImageDetails);
}
