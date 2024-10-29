document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('loginButton');
  const searchButton = document.getElementById('searchButton');
  const resultsDiv = document.getElementById('results');

  // Automatically verify JWT on popup load
  chrome.runtime.sendMessage({ action: 'verifyJWT' }, (response) => {
    if (response) {
      if (response.isLoggedIn) {
        loginButton.style.display = 'none'; // Hide login button if logged in
      } else {
        loginButton.style.display = 'block'; // Show login button if not logged in
        console.error(response.error || 'Login required');
        window.open('http://localhost:3001/')
      }
    } else {
      console.error('No response received from background script');
    }
  });

  // Search button functionality
  if (searchButton) {
    searchButton.addEventListener('click', searchConversation);
  }

  async function searchConversation() {
    const searchQueryElement = document.getElementById('searchQuery');
    if (!searchQueryElement) {
      displayError('Search input field not found.');
      return;
    }

    const searchQuery = searchQueryElement.value;
    if (!searchQuery) {
      alert('Please enter a search term.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/conversations/search?name=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (response.ok) {
        const result = await response.json();
        displayResults(result);
      } else {
        const error = await response.json();
        displayError(error.message || 'Unknown error occurred');
      }
    } catch (err) {
      console.error(err);
      displayError('An error occurred while searching for conversations.');
    }
  }

  function displayResults(result) {
    if (!resultsDiv) return;

    resultsDiv.innerHTML = '';

    if (Array.isArray(result)) {
      if (result.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
      } else {
        result.forEach((item) => {
          resultsDiv.innerHTML += `<p>Name: ${item.name}, Link: <a href="${item.link}" target="_blank">${item.link}</a></p>`;
        });
      }
    } else {
      resultsDiv.innerHTML = `<p>Name: ${result.name}, Link: <a href="${result.link}" target="_blank">${result.link}</a></p>`;
    }
  }

  function displayError(message) {
    if (resultsDiv) {
      resultsDiv.innerHTML = `<p class="error">${message}</p>`;
    }
  }
});
