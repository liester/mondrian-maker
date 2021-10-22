const { Recipient } = require('mailersend');
const { EmailParams } = require('mailersend');
const { Attachment } = require('mailersend');
const MailerSend = require('mailersend');

const mailersend = new MailerSend({
  api_key: process.env.MAILERSEND_API_KEY,
});

module.exports = {
  orderMondrian: async (mondrianDataUri, billingDetails, address, paymentId, paymentAmount) => {
    if (!mondrianDataUri) {
      throw new Error('Missing Mondrian URI');
    }
    const data = mondrianDataUri.split(',')[1];
    const attachments = [
      new Attachment(data, 'mondrian-to-print.png'),
    ];

    const recipients = [
      new Recipient('levi.liester+mondrianMaker@gmail.com', 'Levi Liester'),
      new Recipient(billingDetails.email, billingDetails.name),
    ];

    const thankYouMessage = 'Thank you for ordering your very own Mondrian.  The Mondrian team is on the job!';

    const htmlContent = `
    <div style="color: black">
      <div>${thankYouMessage}</div>
      <br/>
      <div>Payment ID: ${paymentId}</div>
      <div>
        Charged Amount: ${(paymentAmount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
      <br/>
      
      <div>Mailing Address:</div>
      <div>${billingDetails.name}</div>
      <div>${address.line1}</div>
      <div>${address.city}, ${address.state} ${address.postal_code}</div>
      <div>${address.line2 ? address.line2 : ''}</div>
      <br/>
      <div>Phone Number: ${billingDetails.phone}</div>
    </div>
    `;
    const emailParams = new EmailParams()
      .setFrom('mindcanaryllc@goingsolo.rocks')
      .setFromName('Mondrian Maker')
      .setRecipients(recipients)
      .setAttachments(attachments)
      .setSubject('Your Order is Processing')
      .setHtml(htmlContent)
      .setText(thankYouMessage);

    const result = await mailersend.send(emailParams).then((r) => {
      if (r.ok) {
        return 'success';
      }
      return r.json();
    }).catch((e) => console.log(e));
    console.log(JSON.stringify(result));
  },
};
