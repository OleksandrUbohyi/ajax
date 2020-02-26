const btn = document.querySelector('.get-posts-btn');
const btnAddPost = document.querySelector('.add-post-btn');
const container = document.querySelector('.container .row');

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

function createPost(body, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts');
    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        console.log(response)
        callback(response);
    })

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")

    xhr.addEventListener('error', () => { // если общение с сервером произошло неуспешно (путь/файл не найден)
        console.log('error');
    })

    xhr.send(JSON.stringify(body));
}

function renderPosts(response) {
    let fragment = '';

    response.forEach(post => {

        let markup = `
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

        fragment += markup;
    });

    container.innerHTML = fragment;
}

btn.addEventListener('click', e => {
    getPosts(renderPosts);
})

btnAddPost.addEventListener('click', e => {
    let newPost = {
        title: "Олександр",
        body: "Біла Церква",
        userId: 1
    };

    createPost(newPost, response => {
        console.log(1);
    });
})