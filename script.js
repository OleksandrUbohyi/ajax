const btn = document.querySelector('.get-posts-btn');
const btnAddPost = document.querySelector('.add-post-btn');
const container = document.querySelector('.container .row');

//ф-я GEt запроса
function getPosts(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts');
    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        callback(response);
        // console.log(xhr.responseText);
    })

    xhr.addEventListener('error', () => { // если общение с сервером произошло неуспешно (путь/файл не найден)
        console.log('error');
    })

    xhr.send();
}


//ф-я POST запроса
function createPost(body, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts');
    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        console.log(response)
        callback(response);
    })

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.addEventListener('error', () => { // если общение с сервером произошло неуспешно (путь/файл не найден)
        console.log('error');
    })

    xhr.send(JSON.stringify(body));
}

function markupTemplate(post) {
    const markup = `
    <div class="col-sm-6 col-lg-4 mb-3">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
                <a href="#" class="btn btn-primary">Переход куда-нибудь</a>
            </div>
        </div>
    </div>
    `;
    return markup;
}

function renderPosts(response) {
    let fragment = '';

    response.forEach(post => {
        const markup = markupTemplate(post);
        fragment += markup;
    });

    container.innerHTML = fragment;
}

btn.addEventListener('click', e => {
    getPosts(renderPosts);
})

btnAddPost.addEventListener('click', e => {
    let postBody = {
        id: 101,
        title: 'Post title',
        body: 'Post body',
        userId: 1
    };

    createPost(postBody, response => {
        const card = markupTemplate(response);
        container.insertAdjacentHTML('afterbegin', card)
    });
})

function myHttpRequest({
    method,
    url
} = {}, callback) { //деструктурируем объект, дефолтное значение пустое

    try { // try - для отлова синхронных ошибок (ошибки в рамках кода) - когда не передали аргументы/допустили ошибку - выпадет ошибка от try, которая попадёт аргументом в catch
        // const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.addEventListener('load', () => {
            if (Math.floor(xhr.status / 100) !== 2) {
                //обрабатываем АСИНХРОННЫЕ ошибки, когда нам ответит сервер

                //коллбэк ошибки должен принимать в качестве параметров первым - объект ошибки (ошибку), а вторым - ответ от сервера
                callback(`Ошибка. Код статуса: ${xhr.status}`, xhr);
                //в колбеке вторым параметром отправляем xhr для более подробной информации ответа
                return;
            }
            const response = JSON.parse(xhr.responseText);
            callback(null, response); // null - объекта ошибки нету, так как мы не попали в is с ошибкой (!==200);

            // console.log(xhr.responseText);
        })

        xhr.addEventListener('error', () => { // если общение с сервером произошло неуспешно (путь/файл не найден)
            callback(`Ошибка. Код статуса: ${xhr.status}`, xhr);
            //тот же коллбэк, что и в if(xhr.status !==200);
        })

        xhr.send();
    } catch (error) {
        callback(error);
    }
}

// myHttpRequest({
//     method: 'GET',
//     url: 'https://jsonplaceholder.typicode.com/posts'
// }, (err, res) => {
//     if (err) {
//         console.log(`Ошибка - ${err}`);
//         return;
//     }
//     console.log(res);
// });

function customHttp() {
    return {
        get({ url } = {}, callback) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        callback(`Ошибка. Код статуса: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    callback(null, response);

                })

                xhr.addEventListener('error', () => {
                    callback(`Ошибка. Код статуса: ${xhr.status}`, xhr);
                })

                xhr.send();
            } catch (error) {
                callback(error);
            }
        },
        post(url, body, headers, callback) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        callback(`Ошибка. Код статуса: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    callback(null, response);

                })

                xhr.addEventListener('error', () => {
                    callback(`Ошибка. Код статуса: ${xhr.status}`, xhr);
                })

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    })
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                callback(error);
            }
        }
    }
}

const http = customHttp();

// http.post('https://jsonplaceholder.typicode.com/posts', {
//     id: 101,
//     title: 'foo',
//     body: 'bar',
//     userId: 1
// }, {
//     'Content-Type': 'application/json', 'x-auth': 'ajsfjlkf934398043'
// }, (err, res) => {
//     console.log(err, res);
// })


const newsService = (function () {
    const apiKey = '47a87bd0ab604b76834b0e6d2fc9b5f7';
    const apiUrl = 'https://newsapi.org/v2';

    return {
        topHeadlines(country = 'ua', callback) {
            http.get({
                url: `${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`
            }, callback)
        },
        everything(query, callback) {
            //реализовать выбор категории
            http.get({ url: `${apiUrl}/everything?q=${query}&apiKey=${apiKey}` }, callback);
        }
    }
})();

//Elements UI
const form = document.forms['news-form'];//получаем форму по имени
const countrySelect = form.elements['country-select'];
const searchInput = form.elements['query-input'];
const preloader = document.querySelector('.preloader');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    loadNews();
})

// document.addEventListener('DOMContentLoaded', function () {
//     loadNews();
// })

function loadNews() {
    showPreloader(preloader);
    const country = countrySelect.value;
    const searchText = searchInput.value;

    if (!searchText) {
        newsService.topHeadlines(country, onGetResponse);
    } else {
        newsService.everything(searchText, onGetResponse);
        searchInput.value = '';
    }
}


// function onGetResponse(err, {articles}) { //можем деструктурировать response
function onGetResponse(err, res) {
    // if (err) {
    //     showAlert(err, 'error-msg');
    //     return; 
    // }
    hidePreloader(preloader);

    if (!res.articles.length) {
        // alert('нема новин');
        document.querySelector('.news-container .row').innerHTML = 'За вашим запитом новин не знайдено';
        //showEmptyMessage
    }

    renderNews(res.articles);

}

function renderNews(news) {
    const newsContainer = document.querySelector('.news-container .row');

    if (newsContainer.children.length) {
        clearContainer(newsContainer);
    }

    let fragment = '';

    news.forEach(newsItem => {
        const el = newsTemplate(newsItem);
        fragment += el;
    })
    newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

function newsTemplate({ urlToImage, title, url, description }) {
    return `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 m-0">
            <img src="${urlToImage}" class="card-img-top" alt="${title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${title || 'Заголовка нету :('}</h5>
                <p class="card-text">${description}</p>
                <a href="${url}" class="btn btn-primary mt-auto">Прочитати всю новину</a>
            </div>
            <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </div>
    </div>
    `
}

// function showAlert(msg, type = "success") {
//     M.toast({
//         html: msg,
//         classes: type
//     })
// }

function clearContainer(container) {
    container.innerHTML = '';
}

function showPreloader(el) {
    el.style.display = 'flex';
}

function hidePreloader(el) {
    el.style.display = 'none';
}