chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatGPT Conversation Finder Extension Installed');
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    console.log('Request completed:', details);
    logNavigation(details);
  },
  { urls: ['https://chatgpt.com/', 'https://chatgpt.com/c/*'] }
);

const logNavigation = (details) => {
  console.log('Logging navigation for:', details.url);

  chrome.runtime.sendMessage(
    {
      action: 'logNavigation',
      url: details.url,
      timestamp: new Date().toISOString(),
    },
    (response) => {
      console.log('Response from front end:', response);
    }
  );
};
