// Store uploaded files in an array for further processing
let uploadedFiles = [];

// Handle file upload
document.getElementById("addFileButton").addEventListener("click", function () {
  const fileInput = document.getElementById("fileUpload");
  const fileList = document.getElementById("fileList");

  if (!fileInput.files.length) {
    alert("Please select a file before adding.");
    return;
  }

  const file = fileInput.files[0];

  // Append the new file to the list of uploaded files
  uploadedFiles.push(file);
  const listItem = document.createElement("li");
  listItem.textContent = file.name;

  // Add a remove button next to each file
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.style.marginLeft = "10px";
  removeButton.addEventListener("click", function () {
    // Remove the file from the array and list
    const index = uploadedFiles.indexOf(file);
    if (index > -1) {
      uploadedFiles.splice(index, 1);
    }
    listItem.remove();
  });

  listItem.appendChild(removeButton);
  fileList.appendChild(listItem);

  // Reset the file input to allow new uploads
  fileInput.value = "";
});

// Handle "Create KG Graph" button click
document.getElementById("createKGButton").addEventListener("click", function () {
  const modal = document.getElementById("kgGraphModal");
  const table = document.getElementById("kgGraphTable");
  const spinner = document.getElementById("spinner");

  // Clear existing table content and show modal
  table.innerHTML = "";
  modal.style.display = "block";
  spinner.style.display = "flex";

  // Simulate processing delay
  setTimeout(async () => {
    try {
      // Fetch the CSV file
      const response = await fetch("KG_Graphs.csv");
      const csvData = await response.text();

      // Parse CSV and generate a table
      const parsedData = parseCSV(csvData);

      // Create table header
      const headerRow = document.createElement("tr");
      parsedData[0].forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Create table body
      for (let i = 1; i < parsedData.length; i++) {
        const row = document.createElement("tr");
        parsedData[i].forEach((cellText) => {
          const td = document.createElement("td");
          td.textContent = cellText;
          row.appendChild(td);
        });
        table.appendChild(row);
      }

      // Hide spinner after the CSV is loaded
      spinner.style.display = "none";
    } catch (error) {
      spinner.style.display = "none";
      alert("Error fetching KG Graph data: " + error.message);
    }
  }, 7000); // 7-second delay
});

// CSV Parsing Function
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (insideQuotes && text[i + 1] === '"') {
        // Escaped quote inside a quoted cell
        currentCell += '"';
        i++;
      } else {
        // Toggle the insideQuotes flag
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of a cell
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      // End of a row
      if (currentCell !== '' || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      }
    } else {
      currentCell += char;
    }
  }

  // Add the last cell and row if needed
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

// Close the modal when clicking the close button
document.querySelector(".close-button").addEventListener("click", function () {
  document.getElementById("kgGraphModal").style.display = "none";
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  const modal = document.getElementById("kgGraphModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Handle ChatGPT API logic for the middle box
document.getElementById("chatGPTSend").addEventListener("click", sendRequestToSelectedLLM);
document.getElementById("chatGPTQuestion").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendRequestToSelectedLLM();
  }
});

function scrollToBottom(chatLog) {
  chatLog.scrollTop = chatLog.scrollHeight;
}
async function sendRequestToSelectedLLM() {
  const question = document.getElementById("chatGPTQuestion").value;
  const chatLog = document.getElementById("chatGPTResponses");
  const selectedLLM = document.getElementById("llmSelect").value;

  if (!question.trim()) {
    alert("Please enter a question.");
    return;
  }

  // Add the user question to the chat log
  const userQuestion = document.createElement("div");
  userQuestion.textContent = `You: ${question}`;
  userQuestion.style.fontWeight = "bold";
  chatLog.appendChild(userQuestion);

  // Determine which API to call based on the selected LLM
  const apiUrl = selectedLLM === "groq" ? "/groq" : "/chatgpt";

  try {
    // Call the selected API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    // Handle the response for slow rendering (Groq-specific)
    if (selectedLLM === "groq" && data.response) {
      const responseContainer = document.createElement("div");
      responseContainer.textContent = "Groq: ";
      chatLog.appendChild(responseContainer);

      slowRenderText(data.response, responseContainer);
    } else {
      // Directly display the ChatGPT response or fallback
      const chatResponse = document.createElement("div");
      chatResponse.textContent = `${selectedLLM === "groq" ? "Groq" : "GPT"}: ${
        data.response || "Error: " + data.error || "Unknown error"
      }`;
      chatLog.appendChild(chatResponse);
      scrollToBottom(chatLog);
    }
  } catch (error) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = `Error: ${error.message}`;
    chatLog.appendChild(errorMessage);
  }

  document.getElementById("chatGPTQuestion").value = ""; // Clear input field
}

// Function to render text slowly word by word
function slowRenderText(text, container) {
  const words = text.split(" ");
  let index = 0;

  const interval = setInterval(() => {
    if (index < words.length) {
      container.textContent += (index === 0 ? "" : " ") + words[index];
      index++;
    } else {
      clearInterval(interval); // Stop rendering when done
    }
  }, 100); // Adjust delay (100ms per word)
}

// Handle API logic for the rightmost box
document.getElementById("customSend").addEventListener("click", sendCustomRequest);
document.getElementById("customQuestion").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendCustomRequest();
  }
});

function sendCustomRequest() {
  const question = document.getElementById("customQuestion").value;
  const chatLog = document.getElementById("customResponses");

  if (!question.trim()) {
    alert("Please enter a question.");
    return;
  }

  // Add the user question to the chat log
  const userQuestion = document.createElement("div");
  userQuestion.textContent = `You: ${question}`;
  userQuestion.style.fontWeight = "bold";
  chatLog.appendChild(userQuestion);

  // Call the custom API for a response
  fetch("http://127.0.0.1:5001/generate-answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 'question': question }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0 && data.results[0].prediction) {
        // Render the prediction word-by-word
        simulateWordByWordRendering(data.results[0].prediction, chatLog);
      } else {
        const errorMessage = document.createElement("div");
        errorMessage.textContent = `Error: Prediction not available`;
        chatLog.appendChild(errorMessage);
      }
    })
    .catch((error) => {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = `Error: ${error.message}`;
      chatLog.appendChild(errorMessage);
    });
  scrollToBottom(chatLog);
  document.getElementById("customQuestion").value = ""; // Clear input field
}

document.querySelectorAll('.fullscreen-btn').forEach(button => {
  button.addEventListener('click', function () {
    const targetSectionClass = this.getAttribute('data-target');
    const targetSection = document.querySelector(`.${targetSectionClass}`);
    const container = document.querySelector('.container');

    if (targetSection.classList.contains('fullscreen')) {
      // Exit fullscreen
      targetSection.classList.remove('fullscreen', 'fullscreen-section');
      container.classList.remove('fullscreen');
      document.body.style.overflow = 'auto'; // Re-enable body scrolling
    } else {
      // Enter fullscreen
      targetSection.classList.add('fullscreen', 'fullscreen-section');
      container.classList.add('fullscreen');
      document.body.style.overflow = 'hidden'; // Disable body scrolling
    }
  });
});

function simulateWordByWordRendering(text, chatLog) {
  const responseContainer = document.createElement("div");
  responseContainer.style.color = "blue"; // Optional: Style the response
  chatLog.appendChild(responseContainer);

  const words = text.split(" ");
  let index = 0;

  // Render words one by one with a delay
  const interval = setInterval(() => {
    if (index < words.length) {
      responseContainer.textContent += (index === 0 ? "" : " ") + words[index];
      index++;
    } else {
      clearInterval(interval); // Stop when all words are rendered
    }
  }, 150); // 150ms delay between words
}
