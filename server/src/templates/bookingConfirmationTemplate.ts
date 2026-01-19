export const bookingConfirmationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Booking Received</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #000000;
      margin: 0;
      padding: 0;
    }
    .email-container {
      width: 100%;
      max-width: 650px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      font-size: 24px;
      color: #ff6a00;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .email-body {
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .details-table th, .details-table td {
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid #ddd;
    }
    .details-table th {
      color: #555;
      width: 40%;
    }
    .highlight {
      color: #ff6a00;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #888;
      margin-top: 30px;
    }
    .footer a {
      color: #ff6a00;
      text-decoration: none;
    }
    .cta-button {
      display: inline-block;
      background-color: #ff6a00;
      color: #fff;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 15px;
    }
    .cta-button:hover {
      background-color: #e55f00;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">New Booking Received</div>

    <div class="email-body">
      <p>Hello Admin,</p>
      <p>
        A new booking has just been created on <strong>Okobiz Properties</strong>. Below are the booking details:
      </p>

      <table class="details-table">
        <tr>
          <th>Booking ID:</th>
          <td class="highlight">{{bookingId}}</td>
        </tr>
        <tr>
          <th>Client Name:</th>
          <td>{{name}}</td>
        </tr>
        <tr>
          <th>Client Email:</th>
          <td>{{email}}</td>
        </tr>
        <tr>
          <th>Client Phone:</th>
          <td>{{phone}}</td>
        </tr>
        <tr>
          <th>Client Phone:</th>
          <td>{{address}}</td>
        </tr>
        <tr>
          <th>Client Phone:</th>
          <td>{{note}}</td>
        </tr>
        <tr>
          <th>Property:</th>
          <td>{{property.name}}</td>
        </tr>
        <tr>
          <th>Check-In Date:</th>
          <td>{{checkInDate}}</td>
        </tr>
        <tr>
          <th>Check-Out Date:</th>
          <td>{{checkOutDate}}</td>
        </tr>
        <tr>
          <th>Guests:</th>
          <td>{{numberOfGuests}}</td>
        </tr>
        <tr>
          <th>Appointment Request Date:</th>
          <td>{{appointmentRequestedDate}}</td>
        </tr>
        <tr>
          <th>Appointment Date:</th>
          <td>{{appointmentDate}}</td>
        </tr>
        <tr>
          <th>Payment Method:</th>
          <td>{{paymentMethod}}</td>
        </tr>
        <tr>
          <th>Payment Status:</th>
          <td class="highlight">{{paymentStatus}}</td>
        </tr>
        <tr>
          <th>Total Amount:</th>
          <td><strong>{{totalAmount}}</strong></td>
        </tr>
        <tr>
          <th>Booking Status:</th>
          <td><strong class="highlight">{{status}}</strong></td>
        </tr>
      </table>

      <p>
        You can view the booking in your admin dashboard:
      </p>
    </div>

    <div class="footer">
      <p>
        Best regards,<br />
        <strong>Okobiz Properties System</strong><br />
        <a href="{{baseUrl}}">{{baseUrl}}</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
