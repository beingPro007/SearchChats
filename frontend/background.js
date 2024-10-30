// Function to get a specific cookie value by name
function getCookie(name, callback) {
  chrome.cookies.get(
    { url: 'https://refined-genuinely-husky.ngrok-free.app', name: name },
    function (cookie) {
      if (cookie) {
        callback(cookie.value);
      } else {
        callback(null); // Return null if cookie not found
      }
    }
  );
}

// Function to send the token to the server for verification
async function verifyJwt(token) {
  try {
    const response = await fetch(
      'https://refined-genuinely-husky.ngrok-free.app/api/v1/verify-jwt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Response is not ok:', response.statusText);
      return { ok: false, error: 'Server responded with an error' };
    }

    const result = await response.json();
    return { ok: true, user: result }; // Return user info on success
  } catch (error) {
    console.error('Error verifying token:', error);
    return { ok: false, error: error.message };
  }
}

// Message listener to handle verification requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'verifyJWT') {
    // Retrieve the token from cookies using chrome.cookies API
    getCookie('accessToken', (token) => {
      if (!token) {
        sendResponse({ ok: false, error: 'No token found. Please log in.' });
        return;
      }

      // Verify the token if it exists
      verifyJwt(token)
        .then((result) => {
          if (result.ok) {
            sendResponse({ isLoggedIn: true, user: result.user }); // Adjusted response
          } else {
            sendResponse({ isLoggedIn: false, error: result.error });
          }
        })
        .catch((error) => sendResponse({ ok: false, error: error.message }));

      return true; // Keeps the message channel open for async response
    });

    return true; // Keeps the message channel open for async response
  }
});
