let currentUrl=window.location.href;
let logExecuted=false;

const logNavigation=(url) => {
  if(logExecuted) return;

  setTimeout(() => {
    const diggingUrl=new URL(url);
    const partAfterCom=diggingUrl.pathname.substring(1);

    let title='';
    let anchorElement=document.querySelector(`a[href="/${partAfterCom}"]`);
    const checkTitle=() => {
      const requireText=anchorElement
        ?.querySelector('div')
        ?.textContent.trim();

      if(requireText==='New chat') {
        setTimeout(checkTitle,10000);
      } else {
        title=requireText;

        chrome.runtime.sendMessage({action: 'verifyJWT'},async (authResponse) => {
          if(authResponse.isLoggedIn) {
            try {
              const backendResponse=await fetch("https://refined-genuinely-husky.ngrok-free.app/api/v1/conversations/addConversation",{
                method: 'POST',
                headers: {
                  'Content-Type': "application/json",
                },
                body: JSON.stringify({title,url,user: authResponse.user})
              });

              if(!backendResponse.ok) {
                console.error('Backend response not ok:',await backendResponse.text());
              } else {
                const data=await backendResponse.json();
                console.log("Response data for content.js",data);
              }
            } catch(error) {
              console.error('Error in fetching the response to content.js:',error);
            }
          } else {
            console.warn('User is not logged in');
          }
        });
      }
    };

    checkTitle();
  },5000);

  logExecuted=true;
};

const monitorUrlChange=() => {
  const observer=new MutationObserver(() => {
    if(window.location.href!==currentUrl) {
      currentUrl=window.location.href;
      logExecuted=false;
      logNavigation(currentUrl);
    }
  });

  observer.observe(document,{childList: true,subtree: true});
};

monitorUrlChange();

(() => {
  let currentUrl=window.location.href;

  const originalPushState=history.pushState;
  history.pushState=function(...args) {
    originalPushState.apply(this,args);
    const newUrl=window.location.href;
    if(newUrl!==currentUrl) {
      currentUrl=newUrl;
      setTimeout(() => {
        logNavigation(currentUrl);
      },5000);
    }
  };

  const originalReplaceState=history.replaceState;
  history.replaceState=function(...args) {
    originalReplaceState.apply(this,args);
    const newUrl=window.location.href;
    if(newUrl!==currentUrl) {
      currentUrl=newUrl;
      setTimeout(() => {
        logNavigation(currentUrl);
      },5000);
    }
  };
})();

window.addEventListener('popstate',() => {
  currentUrl=window.location.href;
  setTimeout(() => {
    logNavigation(currentUrl);
  },5000);
});
