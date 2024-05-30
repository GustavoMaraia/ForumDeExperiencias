document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const postForm = document.getElementById('post-form');
    const userName = document.getElementById('user-name');
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');
    const postCategory = document.getElementById('post-category');
    const searchInput = document.getElementById('search');

    function loadPosts(query = '') {
        fetch('/posts')
            .then(response => response.json())
            .then(data => {
                postList.innerHTML = '';
                data.posts
                    .filter(post => post.content.includes(query) || post.title.includes(query) || post.category.includes(query))
                    .forEach(post => {
                        const postItem = document.createElement('div');
                        postItem.className = 'post-item';
                        postItem.innerHTML = `
                            <h4>${post.title}</h4>
                            <p>${post.content}</p>
                            <small><strong>${post.user || 'Anônimo'}</strong> - ${post.category}</small>
                            <div class="comment-section">
                                <input type="text" class="form-control mb-2" placeholder="Escreva um comentário...">
                                <button class="btn btn-secondary btn-sm">Comentar</button>
                                <div class="comment-list">
                                    <!-- Comentários serão carregados aqui -->
                                </div>
                            </div>
                        `;
                        postList.appendChild(postItem);
                    });
            });
    }

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                user: userName.value,
                title: postTitle.value,
                content: postContent.value,
                category: postCategory.value
            })
        })
        .then(response => response.json())
        .then(() => {
            userName.value = '';
            postTitle.value = '';
            postContent.value = '';
            postCategory.value = '';
            loadPosts();
        });
    });

    searchInput.addEventListener('input', (e) => {
        loadPosts(e.target.value);
    });

    loadPosts();
});
