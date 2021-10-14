const fs = require('fs');
const { Recipient } = require('mailersend');
const { EmailParams } = require('mailersend');
// const { Attachment } = require('mailersend');
const MailerSend = require('mailersend');

const mailersend = new MailerSend({
  api_key: process.env.MAILERSEND_API_KEY,
});

module.exports = (app) => {
  app.post('/saveMondrian', async (request, response) => {
    try {
      const { mondrianDataUri } = request.body;
      if (mondrianDataUri) {
        const data = mondrianDataUri.split(',')[1];
        const buffer = Buffer.from(data, 'base64');
        // fs.writeFileSync('./secondDemo.png', buf);
        fs.writeFileSync('mondrian-image.png', buffer);
        // const attachments = [
        //   new Attachment(buffer),
        // ];

        // const recipients = [
        //   new Recipient('levi.liester@gmail.com', 'Levi Liester'),
        // ];
        // const emailParams = new EmailParams()
        //   .setFrom('levi.liester@gmail.com')
        //   .setFromName('Mondrian Maker')
        //   .setRecipients(recipients)
        //   // .setAttachments(attachments)
        //   .setSubject('Your Order is Processing')
        //   .setHtml('Thank you for ordering your very own Mondrian')
        //   .setText('Mondrian Maker is on the job!');
        //
        // const result = await mailersend.send(emailParams);
        const recipients = [
          new Recipient('levi.liester@gmail.com', 'levi recipient'),
        ];

        const emailParams = new EmailParams()
          .setFrom('levi.liester@gmail.com')
          .setFromName('Levi sender')
          .setRecipients(recipients)
          .setSubject('No Subject')
          .setHtml('This is the HTML content')
          .setText('This is the text content');

        const result = await mailersend.send(emailParams);
        response.send(JSON.stringify(result));
      } else {
        console.error('mondrian data uri not found');
        response.status(500).send('No mondrian data!');
      }
    } catch (e) {
      console.error(e);
      response.status(500).send(e);
    }
  });
};
