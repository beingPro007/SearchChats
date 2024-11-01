
function getCookie(name,callback) {
  chrome.cookies.get(
    {url: 'https://refined-genuinely-husky.ngrok-free.app/',name: name},
    function(cookie) {
      if(cookie) {
        console.log(`Cookie found: ${name} = ${cookie.value}`);
        chrome.storage.local.set({jwt: cookie.value},() => {
          console.log('JWT stored successfully in local storage.');
        });
        callback(cookie.value);
      } else {
        console.warn(`Cookie ${name} not found.`);
        callback(null);
      }
    }
  );
}

// Function to send the accessToken to the server for verification with logging
async function verifyJwt(token) {
  try {
    console.log('Verifying token:',token);
    const response=await fetch(
      'https://refined-genuinely-husky.ngrok-free.app/api/v1/verify-jwt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(!response.ok) {
      const errorText=await response.text();
      console.error('Response is not ok:',response.statusText,errorText);
      return {ok: false,error: 'Server responded with an error'};
    }

    const result=await response.json();
    console.log('Token verification success:',result);
    return {ok: true,user: result.user};
  } catch(error) {
    console.error('Error verifying token:',error);
    return {ok: false,error: error.message};
  }
}

// Message listener to handle verification requests with added logging
chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
  if(message.action==='verifyJWT') {
    console.log('Received verifyJWT request');

    getCookie('accessToken',(accessToken) => {
      if(!accessToken) {
        console.warn('No accessToken found, redirecting to login');
        sendResponse({
          ok: false,
          error: 'No accessToken found. Please log in.',
        });
        return;
      }

      verifyJwt(accessToken)
        .then((result) => {
          if(result.ok) {
            console.log('User is logged in:',result.user);
            sendResponse({isLoggedIn: true,user: result.user});
          } else {
            console.error('Token verification failed:',result.error);
            sendResponse({isLoggedIn: false,error: result.error});
          }
        })
        .catch((error) => sendResponse({ok: false,error: error.message}));

      return true;
    });

    return true;
  }
});

