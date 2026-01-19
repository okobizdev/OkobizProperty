export const identityVerificationApprovedEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Identity Verified – Account Activated</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #2d2d2d;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
    .header {
      text-align: center;
      color: #2c3e50;
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .body {
      font-size: 16px;
      line-height: 1.6;
    }
    .body strong {
      color: #27ae60;
    }
    .button {
      display: inline-block;
      background-color: #27ae60;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 25px;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #7f8c8d;
      margin-top: 40px;
    }
    .footer a {
      color: #3498db;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Identity Verification Successful</div>
    <div class="body">
      <p>Hi {{name}},</p>
      <p>We're pleased to inform you that your identity has been <strong>successfully verified</strong>.</p>
      <p>Your Stayverz account is now <strong>fully active</strong>, and you have access to all features including buying, selling, and managing your listings or rentals.</p>

      <p>Thank you for completing the verification process. We appreciate your cooperation in helping us maintain a secure and trustworthy platform.</p>


      <a href="{{dashboardLink}}" class="button">Go to Your Dashboard</a>

      <p>If you have any questions, feel free to reach out to our <a href="mailto:support@stayverz.com">support team</a>.</p>
    </div>
    <div class="footer">
      <p>Thanks for being a part of Stayverz.</p>
      <p><strong>– The Stayverz Team</strong></p>
      <p><a href="https://www.stayverz.com">www.stayverz.com</a></p>
    </div>
  </div>
</body>
</html>

`;
