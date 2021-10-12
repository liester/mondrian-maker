const fs = require('fs');

module.exports = (app) => {
  app.post('/saveMondrian', async (request, response) => {
    try {
      const { mondrianDataUri } = request.body;
      if (mondrianDataUri) {
        const data = mondrianDataUri.split(',')[1];
        const buffer = Buffer.from(data, 'base64');
        // fs.writeFileSync('./secondDemo.png', buf);
        fs.writeFileSync('mondrian-image.png', buffer);
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
