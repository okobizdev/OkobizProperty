export const accountSuspendedEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Account Suspended – Stayverz</title>
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
      font-size: 24px;
      font-weight: bold;
      color: #c0392b;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .body {
      font-size: 16px;
      line-height: 1.6;
    }
    .body strong {
      color: #c0392b;
    }
    .button {
      display: inline-block;
      background-color: #c0392b;
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
    <div class="header">Account Suspended</div>
    <div class="body">
      <p>Hi {{name}},</p>
      <p>We regret to inform you that your account on <strong>Stayverz</strong> has been <strong>suspended</strong>.</p>
      <p>This action was taken due to a violation of our platform policies or terms of use. As a result, you no longer have access to any buying, selling, or listing features on your account.</p>

      <p>If you believe this suspension was made in error or would like to appeal the decision, please contact our support team with any relevant details.</p>

      <a href="mailto:support@stayverz.com" class="button">Contact Support</a>

      <p>We take our platform's integrity seriously to protect the Stayverz community. Your cooperation and understanding are appreciated.</p>
    </div>
    <div class="footer">
      <p>Thank you,<br /><strong>The Stayverz Team</strong></p>
      <p><a href="https://www.stayverz.com">www.stayverz.com</a></p>
    </div>
  </div>
</body>
</html>

`;
