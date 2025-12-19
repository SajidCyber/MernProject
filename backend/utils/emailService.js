const nodemailer = require('nodemailer');

// Create transporter - configure with your email service
// For Gmail, you need to enable "Less secure app access" or use App Password
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send notification email to donor when someone claims their food
exports.sendClaimNotification = async (donorEmail, donorName, foodName, receiverName, receiverEmail, receiverPhone) => {
  // Skip if email is not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured. Skipping notification.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donorEmail,
      subject: `🍽️ New Claim on Your Food: ${foodName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 Great News!</h1>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151;">Hello <strong>${donorName}</strong>,</p>
            <p style="font-size: 16px; color: #374151;">
              Someone has claimed your food listing: <strong>${foodName}</strong>
            </p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Receiver Details:</h3>
              <p style="margin: 5px 0; color: #6b7280;">👤 Name: <strong>${receiverName}</strong></p>
              <p style="margin: 5px 0; color: #6b7280;">📧 Email: <strong>${receiverEmail}</strong></p>
              ${receiverPhone ? `<p style="margin: 5px 0; color: #6b7280;">📞 Phone: <strong>${receiverPhone}</strong></p>` : ''}
            </div>
            
            <p style="font-size: 16px; color: #374151;">
              Please log in to your dashboard to <strong>approve</strong> or <strong>reject</strong> this claim.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/manage-claims" 
                 style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Manage Claims
              </a>
            </div>
            
            <p style="font-size: 14px; color: #9ca3af; margin-top: 30px; text-align: center;">
              Thank you for helping reduce food waste! 🌱
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Claim notification sent to ${donorEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, message: error.message };
  }
};

// Send notification when claim status is updated (Approved)
exports.sendClaimStatusUpdate = async (receiverEmail, receiverName, foodName, status, donorName, donorPhone) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured. Skipping notification.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const transporter = createTransporter();

    const statusColor = '#10b981';
    const statusEmoji = '✅';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receiverEmail,
      subject: `${statusEmoji} Your Claim Has Been Approved: ${foodName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${statusColor}; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">${statusEmoji} Claim Approved</h1>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151;">Hello <strong>${receiverName}</strong>,</p>
            <p style="font-size: 16px; color: #374151;">
              Great news! Your claim for <strong>${foodName}</strong> has been <strong style="color: #10b981;">approved</strong>.
            </p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Donor Contact:</h3>
              <p style="margin: 5px 0; color: #6b7280;">👤 Name: <strong>${donorName}</strong></p>
              ${donorPhone ? `<p style="margin: 5px 0; color: #6b7280;">📞 Phone: <strong>${donorPhone}</strong></p>` : ''}
              <p style="margin-top: 10px; color: #374151;">Please coordinate with the donor to arrange pickup.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-claims" 
                 style="background: ${statusColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View My Claims
              </a>
            </div>
            
            <p style="font-size: 14px; color: #9ca3af; margin-top: 30px; text-align: center;">
              Thank you for being part of the food sharing community! 🌱
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update sent to ${receiverEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, message: error.message };
  }
};
