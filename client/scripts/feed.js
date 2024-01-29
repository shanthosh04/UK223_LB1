document.addEventListener('DOMContentLoaded', () => {
    const postWindow = document.getElementById('Feedwindow');

    // Function to show posts
    const showTweets = async () => {
        try {
            const response = await fetch('http://localhost:4200/getPost', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                postWindow.innerHTML = ''; // Clear existing posts
                result.allpost.forEach(post => {
                    postWindow.innerHTML += `
                        <div class="post">
                            <div>
                                <span class="username">${post.username}</span>
                                <p class="content">${post.content}</p>
                            </div>
                            <div class="actions">
                                <button class="edit" data-post-id="${post.id}">Edit</button>
                                <button class="delete" data-post-id="${post.id}">Delete</button>
                            </div>
                        </div>`;
                });
            } else {
                console.error('Error fetching posts:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    // Function to handle post creation
    document.getElementById('postButton').addEventListener('click', async (event) => {
        event.preventDefault();
        const postMessage = document.getElementById('postTextarea').value;
        const jwtToken = localStorage.getItem('Token');

        try {
            const response = await fetch('http://localhost:4200/createPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postMessage, jwtToken }),
            });

            if (response.ok) {
                console.log('Post created successfully');
                showTweets(); // Reload the posts
            } else {
                console.error('Error creating post:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    });

    // Event delegation for edit and delete actions
    postWindow.addEventListener('click', async (event) => {
        const postId = event.target.getAttribute('data-post-id');

        if (event.target.classList.contains('delete')) {
            const jwtToken = localStorage.getItem('Token');

            try {
                const response = await fetch('http://localhost:4200/deletePost', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId, jwtToken }),
                });

                if (response.ok) {
                    console.log('Post deleted successfully');
                    showTweets(); // Reload the posts
                } else {
                    console.error('Error deleting post:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        }

        // Handling for edit action...
        // TODO: Implement edit functionality
    });

    // Initial loading of tweets
    showTweets();
});
