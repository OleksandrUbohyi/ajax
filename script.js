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

function http() {
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

const myHttp = http();
myHttp.post('https://jsonplaceholder.typicode.com/posts', {
    id: 101,
    title: 'foo',
    body: 'bar',
    userId: 1
}, {
    'Content-Type': 'application/json', 'x-auth': 'ajsfjlkf934398043'
}, (err, res) => {
    console.log(err, res);
})