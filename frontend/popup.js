document.addEventListener('DOMContentLoaded',function() {
  const loginButton=document.getElementById('loginButton');
  const searchButton=document.getElementById('searchButton');
  const resultsDiv=document.getElementById('results');
  const username=document.getElementById('username');

  // Verify JWT with background.js
  chrome.runtime.sendMessage({action: 'verifyJWT'},(authResponse) => {
    if(authResponse) {
      if(authResponse.isLoggedIn) {
        console.log('User logged in:',authResponse.user);
        if(loginButton) loginButton.style.display='none';

        console.log("Message successfully processed by background.js:",authResponse);
        username.innerHTML=`<p>${authResponse.user.username}</p>`;

      } else {
        if(loginButton) loginButton.style.display='block';
        console.warn(authResponse.error||'Login required');
        alert('Redirecting to login.');
        window.open('https://authenticationsfinal.vercel.app');
      }
    } else {
      console.error('No response received from background script');
    }
  });

  // Add click event listener for search button if present
  if(searchButton) {
    searchButton.addEventListener('click',() => searchConversation(authResponse));
  }

  // Define the search function with authResponse as a parameter
  async function searchConversation(authResponse) {
    const searchQueryElement=document.getElementById('searchQuery');
    if(!searchQueryElement) {
      displayError('Search input field not found.');
      return;
    }

    const searchQuery=searchQueryElement.value;
    if(!searchQuery) {
      alert('Please enter a search term.');
      return;
    }

    try {
      // Ensure the JWT token is available for authorization
      const token=authResponse&&authResponse.user&&authResponse.user.token;
      if(!token) {
        console.error("JWT token missing");
        displayError("Authentication token is missing.");
        return;
      }

      // Send the search request to the server
      const searchResponse=await fetch(
        'https://refined-genuinely-husky.ngrok-free.app/api/v1/conversations/findConversations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({query: searchQuery}),
        }
      );

      // Handle server response
      if(!searchResponse.ok) {
        displayError(`Error: ${searchResponse.statusText}`);
      } else {
        const data=await searchResponse.json();
        displayResults(data);
      }
    } catch(error) {
      console.error("Error occurred during search:",error.message);
      displayError("An error occurred while searching.");
    }
  }

  // Display search results in the resultsDiv
  function displayResults(result) {
    if(!resultsDiv) return;

    resultsDiv.innerHTML='';

    if(Array.isArray(result)) {
      if(result.length===0) {
        resultsDiv.innerHTML='<p>No results found.</p>';
      } else {
        result.forEach((item) => {
          resultsDiv.innerHTML+=`<p>Name: ${item.name}, Link: <a href="${item.link}" target="_blank">${item.link}</a></p>`;
        });
      }
    } else {
      resultsDiv.innerHTML=`<p>Name: ${result.name}, Link: <a href="${result.link}" target="_blank">${result.link}</a></p>`;
    }
  }

  function displayError(message) {
    if(resultsDiv) {
      resultsDiv.innerHTML=`<p class="error">${message}</p>`;
    }
  }
});