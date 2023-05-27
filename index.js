require('dotenv').config();
const express = require('express');
const app = express();
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const { port } = require('./config');
var boom = require('express-boom');
const Joi = require('joi');
const morgan = require('morgan');
const { doVerify } = require('./handler/jwt-handler');
const scriptRunner = require('./lib/run-script');
const schema = Joi.object({
  token: Joi.string().required(),
});

app.use(
  morgan('combined', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  }),
);
app.use(helmet());

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(boom());

app.post('/trigger', async (req, res) => {
  try {
    const {
      value: { token = '' },
      error,
    } = await schema.validate(req.query);
    const {
      repository: { repo_name },
      callback_url,
    } = req.body;

    if (error)
      return res.json({
        state: 'failure',
        description: error,
      });

    console.log({ token });

    doVerify(token);

    await scriptRunner({ repo_name });

    return res.json({
      state: 'success',
      description: `Image ${repo_name} Pulled and Launched successfully`,
    });
  } catch (err) {
    return res.json({
      state: 'error',
      description: new Error(err).message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
