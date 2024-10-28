chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatGPT Conversation Finder Extension Installed');
});


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('loginButton').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'login' });
  });
});