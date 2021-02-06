/* eslint-disable */
const { handler } = require('./index');
const testevents = require('./testevents');
const {
  DYNAMO_DB_TABLE_NAME
} = process.env;
(async () => {
  try {
    const { body, requestContext } = testevents.postUsersSignup;

    require('dotenv').config();
    const event = {
      requestContext,
      stageVariables: {
        DYNAMO_DB_TABLE_NAME,
      },
      body: JSON.stringify(body),
    };
    await handler(event);
  } catch (e) {
    console.log(e);
  }
})();
