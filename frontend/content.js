let currentUrl = window.location.href;
let logExecuted = false;

// Function to log navigation details
const logNavigation = (url) => {
  if (logExecuted) return; // Prevent further logs for this navigation

  console.log('Network completed, will log navigation for:', url);

  setTimeout(() => {
    const diggingUrl = new URL(url);
    const partAfterCom = diggingUrl.pathname.substring(1);
    console.log(partAfterCom);

    let title = '';
    let anchorElement = document.querySelector(`a[href="/${partAfterCom}"]`);
    const checkTitle = () => {
      const requireText = anchorElement
        ?.querySelector('div')
        ?.textContent.trim();

      if (requireText === 'New chat') {
        // If title is "New chat", wait and check again
        setTimeout(checkTitle, 10000); // Check again after 1 second
      } else {
        // Once title changes, proceed to log
        title = requireText;        
        console.log('Logging navigation:');
        console.log('Title:', title);
        console.log('URL:', url);

        const ngrokUrl = 'https://2963-152-59-32-19.ngrok-free.app';
        
        const data = { title, url }; // Make sure this is defined and valid
        console.log('Sending data:', JSON.stringify(data));

        fetch(`${ngrokUrl}/api/v1/conversations/addConversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          })
          .then((data) => console.log('Data we got:', data))
          .catch((err) => console.error('Error fetching data:', err));
      }
    };

    checkTitle(); // Start checking for the title
  }, 5000);

  logExecuted = true; // Prevent further logs for this navigation
};

// Monitor URL changes to reset log status and handle navigation
const monitorUrlChange = () => {
  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      logExecuted = false;
      logNavigation(currentUrl);
      console.log('URL changed to:', currentUrl); // Log the URL change
    }
  });

  observer.observe(document, { childList: true, subtree: true });
};

// Start URL change monitoring
monitorUrlChange();

// History management wrapped in an IIFE
(() => {
  let currentUrl = window.location.href;

  // Override history.pushState
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      setTimeout(() => {
        logNavigation(currentUrl);
      }, 5000);
    }
  };

  // Override history.replaceState
  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      setTimeout(() => {
        logNavigation(currentUrl);
      }, 5000);
    }
  };
})();

// Listen for popstate events
window.addEventListener('popstate', () => {
  currentUrl = window.location.href;
  setTimeout(() => {
    logNavigation(currentUrl);
  }, 5000);
});
