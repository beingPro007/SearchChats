let currentUrl = window.location.href;
let logExecuted = false;

const logNavigation = (url) => {
  if (logExecuted) return;

  setTimeout(() => {
    const diggingUrl = new URL(url);
    const partAfterCom = diggingUrl.pathname.substring(1);

    let title = '';
    let anchorElement = document.querySelector(`a[href="/${partAfterCom}"]`);
    const checkTitle = () => {
      const requireText = anchorElement
        ?.querySelector('div')
        ?.textContent.trim();

      if (requireText === 'New chat') {
        setTimeout(checkTitle, 10000);
      } else {
        title = requireText;

        const ngrokUrl = 'https://710c-152-59-35-115.ngrok-free.app';
        const data = { title, url };

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

    checkTitle();
  }, 5000);

  logExecuted = true;
};

const monitorUrlChange = () => {
  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      logExecuted = false;
      logNavigation(currentUrl);
    }
  });

  observer.observe(document, { childList: true, subtree: true });
};

monitorUrlChange();

(() => {
  let currentUrl = window.location.href;

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

window.addEventListener('popstate', () => {
  currentUrl = window.location.href;
  setTimeout(() => {
    logNavigation(currentUrl);
  }, 5000);
});
