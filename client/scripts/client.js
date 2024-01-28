/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('send').addEventListener('click', () => {
    const feed = 'feed.html';
    window.location.href = `/${feed}`;
  });

  document.getElementById('loginForm').addEventListener('send', async (event) => {
    event.preventDefault();

    const LoginUsername = document.getElementById('loginUsername').value;
    const LoginPassword = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('http://localhost:4200/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ LoginPassword, LoginUsername }),
      });

      if (response.ok) {
        const result = await response.json();
        const { token } = result;
        console.log('Login erfolgreich.');
        localStorage.setItem('Token', token);
        const feed = 'feed/feed.html';
        window.location.href = `/${feed}`;
      } else {
        console.error('Fehler beim Login:', response.statusText);
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
    }
  });
});