import nodemailer from "nodemailer"
export const sendEmail=({
    to=[],
    subject=socaialApp,
    text="",
    html="",
    attachments=[],
    cc=[],
    bcc=[]}={})=>{
const transporter = nodemailer.createTransport({
service:'gmail', 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
(async () => {
  const info = await transporter.sendMail({
    from:`Rashad ${process.env.EMAIL}`,
    to,
    subject,
    text,
    html,
    attachments,
    cc,
    bcc
  }); 
  console.log("Message sent:", info.messageId);
})();
}
