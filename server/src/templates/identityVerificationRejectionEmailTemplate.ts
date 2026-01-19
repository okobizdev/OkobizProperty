export const identityVerificationRejectionEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Identity Verification Rejection</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
    }
    .email-body {
      font-size: 16px;
      color: #555;
      line-height: 1.7;
      margin-bottom: 30px;
    }
    .highlight {
      color: #e74c3c;
      font-weight: bold;
    }
    .tips-list {
      margin-left: 20px;
      list-style-type: disc;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #777;
    }
    .button {
      display: inline-block;
      background-color: #3498db;
      color: #ffffff;
      padding: 12px 20px;
      font-size: 16px;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
      margin-top: 30px;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #2980b9;
    }
    .footer-link {
      color: #3498db;
      text-decoration: none;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Identity Verification Unsuccessful
    </div>
    <div class="email-body">
      <p>Hi {{name}},</p>
      <p>Thank you for submitting your identity verification documents to <strong>Stayverz</strong>.</p>
      <p>After a thorough review, we regret to inform you that your verification was <span class="highlight">not approved</span> at this time. This may have been caused by unclear images, missing information, or discrepancies with your personal details.</p>
      
      <p>To proceed, please <strong>resubmit your identity documents</strong> by clicking the button below:</p>
      
      <a href="{{resubmitLink}}" class="button">Resubmit Documents</a>
      
      <p><strong>Required Documents for Verification:</strong></p>
      <ul class="tips-list">
        <li>A clear copy of your <strong>National ID</strong>.</li>
        <li>A valid <strong>Passport</strong> (if available).</li>
        <li>A current <strong>Driver's License</strong> (if available).</li>
      </ul>
      
      <p><strong>Tips for Successful Verification:</strong></p>
      <ul class="tips-list">
        <li>Ensure that all text is clear and legible.</li>
        <li>Submit documents that are government-issued and match your profile details.</li>
        <li>Ensure the images are not blurred or cropped incorrectly.</li>
      </ul>
      
      <p><strong>Note:</strong> Until your identity is successfully verified, you won't have access to full buyer or seller features on Stayverz.</p>
      
      <p>If you need assistance, please feel free to contact our <a href="mailto:support@stayverz.com" class="footer-link">support team</a>.</p>
    </div>
    <div class="footer">
      <p>Thank you for your understanding.</p>
      <p><strong>The Stayverz Team</strong></p>
      <p>Visit our <a href="https://www.stayverz.com" class="footer-link">website</a> for more information.</p>
    </div>
  </div>
</body>
</html>

`;
