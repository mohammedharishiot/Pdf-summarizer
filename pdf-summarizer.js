const fs = require('fs');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API model with your API key
const genAI = new GoogleGenerativeAI('AIzaSyAAU3eYquKKZWj1jbhR2O8rpEPqte3JurU');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to summarize text using Gemini API
async function summarizeText(text) {
  try {
    const prompt = `Summarize the following text:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = await response.text();
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
  }
}

// Function to extract text from PDF and summarize it
async function summarizePDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    console.log('PDF text extracted, generating summary...');
    const summary = await summarizeText(data.text);
    
    console.log('Summary:\n', summary);

    // Save summary to a file
    fs.writeFileSync('summary.txt', summary);
    console.log('Summary saved to summary.txt');
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Run the summarization on a sample PDF file
const pdfPath = 'pdfs/sample.pdf'; // Adjust the path if needed
summarizePDF(pdfPath);
