'use strict';

const express = require('express');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const shortid = require('shortid');
const constants = require('./constants');
const { validateButterfly, validateUser, validateRatings, validateRatingRange } = require('./validators');

async function createApp(dbPath) {
  const app = express();
  app.use(express.json());

  const db = await lowdb(new FileAsync(dbPath));
  await db.read();

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  /* ----- BUTTERFLIES ----- */

  /**
   * Get an existing butterfly
   * GET
   */
  app.get('/butterflies/:id', async (req, res) => {
    const butterfly = await db.get('butterflies')
      .find({ id: req.params.id })
      .value();

    if (!butterfly) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(butterfly);
  });

  /**
   * Create a new butterfly
   * POST
   */
  app.post('/butterflies', async (req, res) => {
    try {
      validateButterfly(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const newButterfly = {
      id: shortid.generate(),
      ...req.body
    };

    await db.get('butterflies')
      .push(newButterfly)
      .write();

    res.json(newButterfly);
  });


  /* ----- USERS ----- */

  /**
   * Get an existing user
   * GET
   */
  app.get('/users/:id', async (req, res) => {
    const user = await db.get('users')
      .find({ id: req.params.id })
      .value();

    if (!user) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(user);
  });

  /**
   * Create a new user
   * POST
   */
  app.post('/users', async (req, res) => {
    try {
      validateUser(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const newUser = {
      id: shortid.generate(),
      ...req.body
    };

    await db.get('users')
      .push(newUser)
      .write();

    res.json(newUser);
  });

  /* ----- Ratings ----- */

  /**
   * add ratings on the butterflies
   * POST
   */

  // Add ratings API
  app.post('/addRatings', async (req, res) => {
    try {
      validateRatings(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // validate rating range
    try {
      validateRatingRange(req.body['rate']);
    } catch (error) {
      return res.status(400).json({ error:'Rating range should be between 0 to 5' });
    }

    const newRatings = {
      ...req.body
    };

    await db.get('ratings')
      .push(newRatings)
      .write();

    res.json(newRatings);
  });

  /**
   * Get list of butterflies in sorted order
   * GET
   */
  // Get User's Ratings in sorted order
  app.get('/userRatings/:user_id', async (req, res) => {

    const ratedObject = db.get('ratings');
    const butterFlyObject = db.get('butterflies');

    // get the ratings of a particular user
    let rates  = ratedObject.filter((a)=> a.user_id === req.params.user_id);

    // sort the ratings by highest rating to lowest
    rates = rates.sort((a,b) => {return a.rate > b.rate ? -1 : 1;});
    const values = rates.map((obj) => { const butterfly = butterFlyObject.find((item) => item.id === obj.butterfly_id); return { 'butterfly_id':obj.butterfly_id, 'commonName':butterfly.get('commonName'), 'species':butterfly.get('species'), 'article':butterfly.get('article'), 'rate':obj.rate }; });

    if (!values) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(values);
  });

  return app;
}

/* istanbul ignore if */
if (require.main === module) {
  (async () => {
    const app = await createApp(constants.DB_PATH);
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Butterfly API started at http://localhost:${port}`);
    });
  })();
}

module.exports = createApp;
