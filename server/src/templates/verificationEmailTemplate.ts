export const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #000000;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #ff6a00;
            text-align: center;
            margin-bottom: 20px;
        }
        .avrification-link {
            font-size: 12px;
            font-weight: bold;
            color: #ff6a00;
            text-align: center;
            margin-bottom: 2px;
        }
        .email-body {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            margin-top: 20px;
        }
        .footer a {
            color: #ff6a00;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="email-header">
            OTP Verification
        </div>

        <div class="email-body">
            <p>Hello {{name}},</p>
            <p>Thank you for signing up! To verify your account, please use the following One-Time Password (OTP):</p>
            <div class="otp-code">
                {{otp}}
            </div>
            <div class="avrification-link"><a class="" href="{{verificationLink}}">OTP VARIFICATION</a></div>
            <p>This OTP is valid for {{expirationTime}} minutes. Please do not share it with anyone.</p>
            <p>If you didn’t request this, you can ignore this email.</p>
        </div>

        <div class="footer">
            <p>Best regards,<br>
            <strong>okobiz property</strong><br>
            <a href="{{baseUrl}}">visite</a></p>
        </div>
    </div>

</body>
</html>
`;
