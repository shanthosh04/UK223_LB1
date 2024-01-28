document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send');
    const tweetInput = document.getElementById('tweetInput');

    sendButton.addEventListener('click', async () => {
        await postNewTweet();
    });

    loadAndDisplayTweets();
});

async function loadAndDisplayTweets() {
    try {
        const response = await fetch('http://localhost:4200/tweets');
        if (response.ok) {
            const tweets = await response.json();
            const tweetsContainer = document.getElementById('tweetsContainer');
            tweetsContainer.innerHTML = '';
            tweets.forEach(tweet => {
                const tweetElement = document.createElement('div');
                tweetElement.innerHTML = `
                    <p><strong>${tweet.username}:</strong> ${tweet.content}</p>
                    <button onclick="updateTweet(${tweet.id})">Bearbeiten</button>
                    <button onclick="removeTweet(${tweet.id})">Löschen</button>
                `;
                tweetsContainer.appendChild(tweetElement);
            });
        }
    } catch (error) {
        console.error('Fehler bei der Anzeige der Tweets', error);
    }
}

async function postNewTweet() {
    const tweetContent = tweetInput.value;
    if (!tweetContent) {
        alert('Bitte geben Sie einen Tweet ein.');
        return;
    }

    try {
        const response = await fetch('http://localhost:4200/tweet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: tweetContent })
        });

        if (response.ok) {
            tweetInput.value = '';
            await loadAndDisplayTweets();
        } else {
            console.error('Fehler beim Senden des Tweets');
        }
    } catch (error) {
        console.error('Fehler beim Senden des Tweets', error);
    }
}

async function updateTweet(tweetId) {
    const newContent = prompt('Tweet bearbeiten:');
    if (newContent) {
        try {
            const response = await fetch(`http://localhost:4200/tweet/${tweetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newContent })
            });

            if (response.ok) {
                await loadAndDisplayTweets();
            } else {
                console.error('Fehler beim Bearbeiten des Tweets');
            }
        } catch (error) {
            console.error('Fehler beim Bearbeiten des Tweets', error);
        }
    }
}

async function removeTweet(tweetId) {
    try {
        const response = await fetch(`http://localhost:4200/tweet/${tweetId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadAndDisplayTweets();
        } else {
            console.error('Fehler beim Löschen des Tweets');
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Tweets', error);
    }
}
