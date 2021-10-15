const { Recipient } = require('mailersend');
const { EmailParams } = require('mailersend');
const { Attachment } = require('mailersend');
const MailerSend = require('mailersend');

const mailersend = new MailerSend({
  api_key: process.env.MAILERSEND_API_KEY,
});

module.exports = {
  orderMondrian: async (mondrianDataUri) => {
    if (!mondrianDataUri) {
      throw new Error('Missing Mondiran URI');
    }
    const data = mondrianDataUri.split(',')[1];
    const attachments = [
      new Attachment(data, 'mondrian-to-print.png'),
    ];

    const recipients = [
      new Recipient('levi.liester@gmail.com', 'Levi Liester'),
    ];
    const emailParams = new EmailParams()
      .setFrom('mindcanaryllc@goingsolo.rocks')
      .setFromName('Mondrian Maker')
      .setRecipients(recipients)
      .setAttachments(attachments)
      .setSubject('Your Order is Processing')
      .setHtml('Thank you for ordering your very own Mondrian')
      .setText('Mondrian Maker is on the job!');

    const result = await mailersend.send(emailParams);
    console.log(JSON.stringify(result));
  },
};
