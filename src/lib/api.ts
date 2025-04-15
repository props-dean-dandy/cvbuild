const OPENROUTER_MISTRAL_API_KEY = "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";
const OPENROUTER_GEMINI_API_KEY = "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";

interface ImageToHtmlResult {
  htmlContent: string;
  cssContent: string;
}

export async function analyzeImageWithAI(imageBase64: string): Promise<ImageToHtmlResult> {
  try {
    // First, try with the OpenRouter API
    try {
      const prompt = `
        You are an expert HTML/CSS developer. Analyze this CV template image and recreate it as 
        pixel-perfect, responsive HTML and CSS. Return the response as a JSON object with two properties:
        1. htmlContent: The complete HTML structure of the CV (all content areas but with placeholder text)
        2. cssContent: The complete CSS needed to style the CV exactly like the image
        
        Important guidelines:
        - Create a clean, semantic HTML structure
        - Make sure the layout is responsive
        - Include placeholders for profile photo if visible
        - Create proper sections for education, experience, skills, etc.
        - Use only HTML and CSS (no JavaScript)
        - Place CSS in the cssContent property, not inline
        - Add appropriate CSS class names
        - Try to match fonts as closely as possible using web-safe fonts or Google Fonts
      `;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'CV Canvas AI'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-opus',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { 
                  type: 'image_url', 
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        // If we get a 402 or other error, throw to fall back to the local template
        if (response.status === 402) {
          console.log("Payment required error from API, using fallback template");
          throw new Error("Payment required");
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract JSON response from the text
      let resultText = data.choices[0].message.content;
      
      // Handle various ways the model might format the response
      let jsonResult: ImageToHtmlResult;
      
      try {
        // Try direct JSON parsing
        jsonResult = JSON.parse(resultText);
      } catch (e) {
        // Try to extract JSON from markdown code blocks or text
        const jsonMatch = resultText.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                          resultText.match(/({[\s\S]*"htmlContent"[\s\S]*"cssContent"[\s\S]*})/);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            jsonResult = JSON.parse(jsonMatch[1]);
          } catch (e2) {
            throw new Error("Failed to parse JSON response from AI");
          }
        } else {
          // If we can't extract JSON, build it manually from the content
          const htmlMatch = resultText.match(/htmlContent['"]*:\s*['"]([\s\S]*?)['"],\s*['"]*cssContent/) ||
                          resultText.match(/```html\s*([\s\S]*?)```/);
          
          const cssMatch = resultText.match(/cssContent['"]*:\s*['"]([\s\S]*?)['"]/) ||
                          resultText.match(/```css\s*([\s\S]*?)```/);
          
          if (htmlMatch && cssMatch) {
            jsonResult = {
              htmlContent: htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
              cssContent: cssMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
            };
          } else {
            throw new Error("Failed to extract HTML and CSS from AI response");
          }
        }
      }
      
      return {
        htmlContent: jsonResult.htmlContent || "",
        cssContent: jsonResult.cssContent || ""
      };
    } catch (error) {
      console.log("Error with OpenRouter API, using fallback template:", error);
      // If the API call fails, use a fallback template
      return getFallbackTemplate();
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}

// Create a fallback template function that returns a basic CV template
function getFallbackTemplate(): ImageToHtmlResult {
  return {
    htmlContent: `
      <div class="cv-container">
        <header class="cv-header">
          <div class="profile-section">
            <div class="profile-photo">
              <img src="" alt="Profile Photo" class="profile-img" />
            </div>
            <div class="name-title">
              <h1>Your Name</h1>
              <h2>Professional Title</h2>
            </div>
          </div>
          <div class="contact-section">
            <div class="contact-info">
              <p>Email: your.email@example.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>Location: City, Country</p>
              <p>LinkedIn: linkedin.com/in/yourname</p>
            </div>
          </div>
        </header>
        
        <div class="cv-body">
          <div class="summary section">
            <h3>Professional Summary</h3>
            <p>A brief overview of your professional background, skills, and career goals. This section should highlight your strengths and give employers a quick understanding of what you bring to the table.</p>
          </div>
          
          <div class="experience section">
            <h3>Work Experience</h3>
            <div class="job">
              <h4>Job Title</h4>
              <p class="company-date">Company Name | Start Date - End Date</p>
              <ul>
                <li>Accomplishment or responsibility description that showcases your skills and impact.</li>
                <li>Another key accomplishment with quantifiable results when possible.</li>
                <li>A third responsibility or achievement that demonstrates your expertise.</li>
              </ul>
            </div>
            <div class="job">
              <h4>Previous Job Title</h4>
              <p class="company-date">Previous Company | Start Date - End Date</p>
              <ul>
                <li>Relevant accomplishment or responsibility.</li>
                <li>Another achievement with measurable results.</li>
                <li>A third key contribution.</li>
              </ul>
            </div>
          </div>
          
          <div class="education section">
            <h3>Education</h3>
            <div class="degree">
              <h4>Degree Name</h4>
              <p class="institution-date">University Name | Graduation Year</p>
              <p>Relevant coursework, honors, or GPA if notable.</p>
            </div>
            <div class="degree">
              <h4>Earlier Degree or Certification</h4>
              <p class="institution-date">Institution Name | Completion Year</p>
              <p>Additional relevant information.</p>
            </div>
          </div>
          
          <div class="skills section">
            <h3>Skills</h3>
            <ul class="skills-list">
              <li>Skill Category 1: Specific skill, Another skill, Additional skill</li>
              <li>Skill Category 2: Specific skill, Another skill, Additional skill</li>
              <li>Skill Category 3: Specific skill, Another skill, Additional skill</li>
            </ul>
          </div>
          
          <div class="additional section">
            <h3>Additional Information</h3>
            <p>Languages, certifications, volunteer work, or other relevant information that doesn't fit in the sections above.</p>
          </div>
        </div>
      </div>
    `,
    cssContent: `
      /* Basic Reset */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      /* Variables */
      :root {
        --primary-color: #2c3e50;
        --secondary-color: #3498db;
        --text-color: #333;
        --light-gray: #f5f5f5;
        --medium-gray: #ddd;
        --spacing-unit: 1rem;
      }
      
      /* Typography */
      body {
        font-family: 'Roboto', Arial, sans-serif;
        line-height: 1.6;
        color: var(--text-color);
      }
      
      h1 {
        font-size: 2.5rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
      }
      
      h2 {
        font-size: 1.5rem;
        color: var(--secondary-color);
        font-weight: 400;
        margin-bottom: 1rem;
      }
      
      h3 {
        font-size: 1.25rem;
        color: var(--primary-color);
        border-bottom: 2px solid var(--secondary-color);
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
      }
      
      h4 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      
      p {
        margin-bottom: 0.75rem;
      }
      
      /* Layout */
      .cv-container {
        max-width: 850px;
        margin: 0 auto;
        padding: var(--spacing-unit);
        background-color: white;
      }
      
      .cv-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--medium-gray);
      }
      
      .profile-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      
      .profile-img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--secondary-color);
      }
      
      .section {
        margin-bottom: 2rem;
      }
      
      /* Experience and Education */
      .job, .degree {
        margin-bottom: 1.5rem;
      }
      
      .company-date, .institution-date {
        font-style: italic;
        color: var(--secondary-color);
        margin-bottom: 0.75rem;
      }
      
      ul {
        padding-left: 1.5rem;
      }
      
      li {
        margin-bottom: 0.5rem;
      }
      
      /* Skills */
      .skills-list {
        list-style-type: none;
        padding-left: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .cv-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .profile-section {
          margin-bottom: 1rem;
        }
        
        .skills-list {
          grid-template-columns: 1fr;
        }
      }
      
      @media (max-width: 576px) {
        .profile-section {
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
        }
        
        .contact-section {
          width: 100%;
          text-align: center;
          margin-top: 1rem;
        }
      }
    `
  };
}

export async function generateCVContent(): Promise<{
  name: string;
  title: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  contact: string;
}> {
  try {
    const prompt = `
      Generate realistic and professional content for a CV (resume) with the following sections:
      1. Full name
      2. Professional title/role
      3. Professional summary (2-3 sentences)
      4. Work experience (2 jobs with company, title, dates, and 2-3 bullet points)
      5. Education (2 entries with institution, degree, dates)
      6. Skills list (8-10 skills)
      7. Contact information (email, phone, LinkedIn)
      
      Return the response as a JSON object with these properties:
      name, title, summary, experience, education, skills, contact
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'CV Canvas AI'
      },
      body: JSON.stringify({
        model: 'google/gemini-1.5-pro',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    const resultText = data.choices[0].message.content;
    
    // Try to parse JSON from the response
    let jsonMatch = resultText.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                    resultText.match(/({[\s\S]*})/);
    
    let jsonResult;
    if (jsonMatch && jsonMatch[1]) {
      jsonResult = JSON.parse(jsonMatch[1]);
    } else {
      throw new Error("Failed to parse JSON response from AI");
    }
    
    return jsonResult;
  } catch (error) {
    console.error("Error generating CV content:", error);
    throw error;
  }
}

export async function convertTextToHtml(content: any): Promise<string> {
  // Simple transformer to convert the generated content into HTML
  const htmlContent = `
    <div class="cv-content">
      <h1>${content.name}</h1>
      <h2>${content.title}</h2>
      <div class="summary">
        <p>${content.summary}</p>
      </div>
      <div class="experience">
        <h3>Experience</h3>
        ${content.experience}
      </div>
      <div class="education">
        <h3>Education</h3>
        ${content.education}
      </div>
      <div class="skills">
        <h3>Skills</h3>
        ${content.skills}
      </div>
      <div class="contact">
        <h3>Contact</h3>
        ${content.contact}
      </div>
    </div>
  `;
  
  return htmlContent;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}
