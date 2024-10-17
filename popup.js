// Add event listeners for the buttons
document
  .getElementById("saveButton")
  .addEventListener("click", saveConversation);
document
  .getElementById("searchButton")
  .addEventListener("click", searchConversation);

// Function to save the current conversation
async function saveConversation() {
  const conversationName = document.getElementById("conversationName").value;
  const currentUrl = window.location.href; // Get current URL

  console.log("Saving conversation:", conversationName, currentUrl); // Debugging line

  if (!conversationName) {
    alert("Please enter a name for the conversation.");
    return;
  }

  const response = await fetch("http://localhost:3000/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: conversationName, link: currentUrl }),
  });

  if (response.ok) {
    alert("Conversation saved successfully!");
    document.getElementById("conversationName").value = ""; // Clear input field
  } else {
    const error = await response.json(); // Get error message from response
    alert("Failed to save conversation: " + error.error);
  }
}

// Function to search for a conversation
async function searchConversation() {
  const searchQuery = document.getElementById("searchQuery").value;

  console.log("Searching for conversation:", searchQuery); // Debugging line

  if (!searchQuery) {
    alert("Please enter a search term.");
    return;
  }

  const response = await fetch(
    `http://localhost:3000/conversations/search?name=${encodeURIComponent(
      searchQuery
    )}`
  );

  if (response.ok) {
    const result = await response.json(); // Get the response
    displayResults(result); // Pass the result to displayResults
  } else {
    alert("Failed to search conversations.");
  }
}

// Function to display search results
function displayResults(result) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Check if the result is an object with an error
  if (result.error) {
    resultsDiv.innerHTML = `<p>${result.error}</p>`;
    return;
  }

  // Display the found conversation
  const p = document.createElement("p");
  p.textContent = `Name: ${result.name}, Link: ${result.link}`;
  resultsDiv.appendChild(p);
}
