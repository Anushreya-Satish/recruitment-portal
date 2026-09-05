/*
// ORIGINAL IMPLEMENTATION:
export function MailTemplate() {
    
}
*/

// OPTIMIZED IMPLEMENTATION:
/**
 * Generates responsive HTML and Plain Text email templates for applicant notifications.
 * @param {Object} params - Template parameters
 * @param {string} params.name - Applicant's full name
 * @param {string} params.department - Applied department name
 * @param {string} params.registrationNumber - Student registration number
 * @returns {{ html: string, text: string, subject: string }}
 */
export function MailTemplate({ name = "Applicant", department = "Department", registrationNumber = "" } = {}) {
  const subject = `Application Received: ${department} Department`;

  const text = `Hi ${name},

Thank you for applying to the ${department} department!
We have received your application submission for registration number: ${registrationNumber}.

Our team will review your application and follow up with you soon.

Best regards,
Recruitment Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f4f5;
      margin: 0;
      padding: 20px;
      color: #18181b;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 32px;
      border: 1px solid #e4e4e7;
    }
    .header {
      border-bottom: 2px solid #6366f1;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .content {
      line-height: 1.6;
      font-size: 15px;
      color: #374151;
    }
    .details-box {
      background-color: #f8fafc;
      border-left: 4px solid #6366f1;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #f4f4f5;
      font-size: 13px;
      color: #71717a;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Application Received</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for submitting your application. We have successfully recorded your response with the following details:</p>
      
      <div class="details-box">
        <p style="margin: 4px 0;"><strong>Department:</strong> ${department}</p>
        ${registrationNumber ? `<p style="margin: 4px 0;"><strong>Registration No:</strong> ${registrationNumber}</p>` : ""}
      </div>

      <p>Our team will review your application and notify you of the next steps.</p>
    </div>
    <div class="footer">
      <p>This is an automated confirmation email from the recruitment portal.</p>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html, text };
}