//const axios = require('axios'); // HTTP client for API requests
//import axios from 'axios';

import axios from './node_modules/axios/dist/axios.min.js';

// Example usage
axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));


console.log("deIdent.js is running!");

// Example: Adding dynamic content to the page
const h2 = document.createElement("h2");
h2.textContent = "JavaScript is successfully running!";
document.body.appendChild(h2);

// Regex patterns for common PII
const patterns = {
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g, // Match SSN pattern
    address: /\b(\d{1,5}\s\w+(\s\w+)*),?\s(\w+\s)+\d{5}\b/g, // Match US addresses
    phone: /\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b/g, // Match phone numbers
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g // Match emails
};

// De-identify text using regex patterns
function deidentifyWithRegex(text) {
    return text
        .replace(patterns.ssn, '[REDACTED SSN]')
        .replace(patterns.address, '[REDACTED ADDRESS]')
        .replace(patterns.phone, '[REDACTED PHONE]')
        .replace(patterns.email, '[REDACTED EMAIL]');
}

// Example of sending text to an LLM for further de-identification
async function deidentifyWithLLM(text) {
    const API_URL = 'https://hipaa-compliant-llm.example.com/v1/anonymize'; // Replace with your LLM API
    const API_KEY = 'your-api-key'; // Replace with your API key

    try {
        const response = await axios.post(
            API_URL,
            { text },
            {
                headers: { 'Authorization': `Bearer ${API_KEY}` }
            }
        );
        return response.data.deidentified_text;
    } catch (error) {
        console.error('Error de-identifying text:', error);
        throw new Error('LLM de-identification failed');
    }
}

// Full de-identification process
async function deidentifyText(message) {
    // Step 1: Regex-based preprocessing
    let deidentifiedText = deidentifyWithRegex(message);

    // Step 2: LLM-based refinement (optional)
    deidentifiedText = await deidentifyWithLLM(deidentifiedText);

    return deidentifiedText;
}

// Example usage
(async () => {
    const sensitiveMessage = "John Doe lives at 123 Elm St, Springfield, IL 62704, and his SSN is 123-45-6789.";
    const safeMessage = await deidentifyText(sensitiveMessage);
    console.log('De-identified Message:', safeMessage);
})();
