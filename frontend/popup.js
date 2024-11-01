document.addEventListener('DOMContentLoaded',function() {
  const loginButton=document.getElementById('loginButton');
  const logoutButton=document.getElementById('logoutButton');
  const searchButton=document.getElementById('searchButton');
  const resultsDiv=document.getElementById('results');
  const username=document.getElementById('username');
  const searchQueryTextField=document.getElementById('searchQuery');

  // Verify JWT
  chrome.runtime.sendMessage({action: 'verifyJWT'},(authResponse) => {
    if(authResponse) {
      if(authResponse.isLoggedIn) {
        if(loginButton) loginButton.style.display='none';

        username.innerHTML=`<p>Hi, ${authResponse.user.fullName}</p>`;

        if(searchButton) {

          if(!searchQueryTextField) {
            console.error("You must enter the search query");
            return;
          }

          searchButton.addEventListener('click',async () => {
            const searchQuery=searchQueryTextField.value;

            try {
              const fetchedSearchResponse=await fetch("https://refined-genuinely-husky.ngrok-free.app/api/v1/conversations/findConversations",{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({searchQuery: searchQuery,user: authResponse.user})
              });

              if(!fetchedSearchResponse.ok) {
                console.error('Fetching unsuccessful!',fetchedSearchResponse.statusText);
                displayError('Fetching unsuccessful. Please try again later.');
                return;
              }

              const data=await fetchedSearchResponse.json();
              displayResults(data);
            } catch(error) {
              console.error("Error fetching data:",error);
              displayError("Error fetching data. Please check your connection.");
            }
          });
        }


        if(logoutButton) {
          document.getElementById('logoutButton').addEventListener('click',async () => {
            try {
              const logoutResponse=await fetch('https://refined-genuinely-husky.ngrok-free.app/api/v1/users/logoutUser',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: authResponse.user})
              })

              if(!logoutResponse.ok) {
                console.log('Response from the logout controller is not ok!!!');
              }

              const data=await logoutResponse.json();
              console.log(data);

              resultsDiv.innerHTML=`
                <p>Status Code: ${data.statuscode}</p>
                <p>Success: ${data.success}</p>
                <p>Message: ${data.data}</p>
              `;

            } catch(error) {
              displayError('Error in fetching the data',error)
            }
          })
        }
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

  // Display search results in the resultsDiv
  function displayResults(results) {
    if(!resultsDiv) return;

    // Assuming resultsDiv is the element where you want to display the results
    resultsDiv.innerHTML='';

    if(Array.isArray(results.data)) {
      if(results.data.length===0) {
        resultsDiv.innerHTML='<p>No results found.</p>';
      } else {
        results.data.forEach((result) => {
          const {conversationTitle,link}=result.item;
          resultsDiv.innerHTML+=`<p>Name: ${conversationTitle}, Link: <a href="${link}" target="_blank">${link}</a></p>`;
        });
      }
    } else {
      resultsDiv.innerHTML=`<p class="error">Invalid data format received.</p>`;
    }
  }

  function displayError(message) {
    if(resultsDiv) {
      resultsDiv.innerHTML=`<p class="error">${message}</p>`;
    }
  }
});
