
document.getElementById('loginButton').addEventListener('click', function () {
  window.open('http://localhost:3001/', '_blank')
});

// Search button functionality
document
  .getElementById('searchButton')
  .addEventListener('click', searchConversation);

async function searchConversation() {
  const searchQuery = document.getElementById('searchQuery').value;

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
    displayError('An error occurred while searching for conversations.');
  }
}

// Function to display the search results
function displayResults(result) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (Array.isArray(result)) {
    if (result.length === 0) resultsDiv.innerHTML = '<p>No results found.</p>';
    else
      result.forEach(
        (item) =>
          (resultsDiv.innerHTML += `<p>Name:${item.name}, Link:${item.link}</p>`)
      );
  } else
    resultsDiv.innerHTML += `<p>Name:${result.name}, Link:${result.link}</p>`;
}

// Function to display error messages
function displayError(message) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p class="error">${message}</p>`;
}
