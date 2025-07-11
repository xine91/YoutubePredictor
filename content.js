// Create a new div element
const helloDiv = document.createElement('div');
helloDiv.style.position = 'fixed';
helloDiv.style.top = '10px';
helloDiv.style.right = '10px';
helloDiv.style.padding = '10px';
helloDiv.style.background = '#f0f0f0';
helloDiv.style.border = '1px solid #ccc';
helloDiv.style.borderRadius = '5px';
helloDiv.style.zIndex = '9999';
helloDiv.textContent = 'Extension is activated';

// Add it to the page
document.body.appendChild(helloDiv);