import nodemailer from "nodemailer";

export async function sendmail(
  to,
  productName,
  productImage,
  oldPrice,
  newPrice
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD, 
      },
    });

    const mailOptions = {
      from: `"Price Drop Alert" <${process.env.EMAIL}>`,
      to,
      subject: `🔥 Price Drop Alert for ${productName}`,
      html: `
        <h2>Price Drop Alert 🚨</h2>


        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Old Price:</strong> ₹${oldPrice}</p>
        <p><strong>New Price:</strong> ₹${newPrice}</p>
        <p>Grab it before the price changes again!</p>
      `,
      
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to", to);
    return { success: true };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
}
