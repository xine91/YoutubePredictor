document.getElementById('extractTitles').addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if we're on YouTube
  if (!tab.url.includes('youtube.com')) {
    document.getElementById('titleList').innerHTML = 
      '<div class="title-item">Please navigate to YouTube first!</div>';
    return;
  }

  try {
    // Execute the content script
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractYouTubeTitles
    });

    // Display the results
    const titles = results[0].result;
    const titleListElement = document.getElementById('titleList');
    titleListElement.innerHTML = '';

    if (titles.length === 0) {
      titleListElement.innerHTML = 
        '<div class="title-item">No video titles found. Make sure you\'re on YouTube\'s home page.</div>';
      return;
    }

    // Display titles on the page
    titles.forEach(title => {
      const titleElement = document.createElement('div');
      titleElement.className = 'title-item';
      titleElement.textContent = title;
      titleListElement.appendChild(titleElement);
    });

    // After displaying the titles, analyze using the AI
    const userData = titles.join(', '); // Convert the titles array into a string
    const aiResult = await analyze(userData);

    // Display AI result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = aiResult;

  } catch (error) {
    document.getElementById('titleList').innerHTML = 
      `<div class="title-item">Error: ${error.message}</div>`;
  }
});

function extractYouTubeTitles() {
  const titles = [];
  const videoTitles = document.querySelectorAll('ytd-rich-grid-media');
  
  for (let i = 0; i < Math.min(9, videoTitles.length); i++) {
    const titleElement = videoTitles[i].querySelector('#video-title');
    if (titleElement) {
      titles.push(titleElement.textContent.trim());
    }
  }
  console.log("roleS");
  return titles;

  
}

// AI Part with form input integration
async function analyze(userData) {
  const resultDiv = document.getElementById('result');
  
  // Get form values
  const roleS = document.getElementById('roleS').value;
  const conS = document.getElementById('conS').value;
  const roleU = document.getElementById('roleU').value;
  const conU = document.getElementById('conU').value;
  
  try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
              model: "gpt-4.1",
              messages: [
                  {
                      "role": roleS || "system",
                      "content": conS || "You are a helpful assistant."
                  },
                  {
                      "role": roleU || "user",
                      "content": `${conU || "Based on the information received"} 
                      (that is, a person's first multiple YouTube videos from their For Your Page), 
                      formulate a rough description of the person. Be fun and risky with your answers, 
                      guess and don't be afraid of sensitive topics. Start your sentence like this: 
                      "I think that you are...". Here are the FYP YouTube titles:'${userData}'. SPEAK GERMAN ONLY AND BE BRIEF AND FUNNY. DON'T MENTION ANY TITLES SPECIFICALLY.`
                  }
              ]
          })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      
      if (data.error) throw new Error(data.error.message || 'API Error');
      if (!data.choices?.[0]?.message) throw new Error('Unexpected response');

      return data.choices[0].message.content.replace(/\n/g, '<br>');

  } catch (error) {
      console.error('Error:', error);
      return `Error: ${error.message}`;
  }
  
}