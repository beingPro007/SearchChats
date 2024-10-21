import { requestNetworkIdle } from 'network-idle';

let currentUrl = window.location.href;
let logExecuted = false;

// Initialize the network idle tracker
const networkIdle = requestNetworkIdle({ idleTimeout: 3000 });

// Function to log navigation details
const logNavigation = () => {
  if (logExecuted) return; // Ensure no repeated logs

  console.log('Network completed, will log navigation...');

  const url = window.location.href;
  const diggingUrl = new URL(url);
  const partAfterCom = diggingUrl.pathname.substring(1);

  console.log(partAfterCom);

  let title = '';
  let anchorElement = document.querySelector(`a[href="/${partAfterCom}"]`);

  if (anchorElement) {
    let textContent = anchorElement.querySelector('div')?.textContent.trim();
    console.log(textContent);
    title = textContent;
  } else {
    console.log(`No anchor element found for /${partAfterCom}`);
  }

  console.log('Logging navigation:');
  console.log('Title:', title);
  console.log('URL:', url);

  const ngrokUrl = 'https://0d8b-152-59-33-175.ngrok-free.app';

  fetch(`${ngrokUrl}/api/v1/conversations/addConversation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, url }),
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => console.log('Data we got:', data))
    .catch((err) => console.error('Error fetching data:', err));

  console.log('Message sent:', title, url);
  logExecuted = true; // Prevent further logs for this navigation
};

// Start monitoring network activity
networkIdle.onIdle(() => {
  logNavigation(); // Call logNavigation when idle
});

// Monitor URL changes to reset log status and handle navigation
const monitorUrlChange = () => {
  setInterval(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href; // Update current URL
      logExecuted = false; // Reset log status for new URL
      console.log('URL changed to:', currentUrl); // Log the URL change
    }
  }, 1000); // Check every second
};

// Log navigation when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  networkIdle.start(); // Start monitoring
});

// Start URL change monitoring
monitorUrlChange();
