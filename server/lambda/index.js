require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB();
const converter = AWS.DynamoDB.Converter;

let DYNAMO_DB_TABLE_NAME;

const ROUTES = {
  '/users/contacts': {
    GET: getUsersContactsHandler,
    PUT: putUsersContactsHandler,
    POST: postUsersContactsHandler,
    DELETE: deleteUsersContactsHandler,
  },
  '/users/authenticate': {
    POST: postUsersAuthenticateHandler,
  },
  '/users/register': {
    POST: postUsersRegisterHandler,
  },
};

async function getUsersContactsHandler() {
  // do stuff
}

async function putUsersContactsHandler() {
  // do stuff
}

async function postUsersContactsHandler(eventBody) {
  const {
    data: contact,
  } = eventBody;
  const now = new Date().toISOString();
  const putItemParams =  {
    Item: {
      created_at: { S: now },
      updated_at: { S: now },
      email: { S: contact.email.toLowerCase() },
      first_name: { S: contact.first_name },
      last_name: { S: contact.last_name },
      phone: { S: contact.phone },
    },
    TableName: DYNAMO_DB_TABLE_NAME,
  };
  console.log('postUsersRegisterHandler: putitem params', putItemParams);
  const putItemResponse = await dynamodb.putItem(putItemParams).promise();
  console.log('postUsersRegisterHandler: putitem response', putItemResponse);
  return {
    message: 'Signed up successfully!',
  };
}

async function deleteUsersContactsHandler() {
  // do stuff
}

function throwErrorWithStatusCode(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

async function getUser({ email }) {
  const scanParams = {
    ExpressionAttributeValues: {
      ':email': {
        S: email,
      },
    },
    FilterExpression: 'email = :email',
    TableName: DYNAMO_DB_TABLE_NAME,
  };
  console.log('getUser: scanParams', scanParams);
  const scanResults = await dynamodb.scan(scanParams).promise();
  console.log('getUser: scanResults', scanResults);
  if (scanResults.Count > 1) {
    return scanResults.Items[0];
  }
  return null;
}

async function postUsersRegisterHandler(eventBody) {
  const {
    data: user,
  } = eventBody;
  const existingUser = await getUser(user);
  console.log('postUsersRegisterHandler: existing user', existingUser);
  if (existingUser) {
    throwErrorWithStatusCode('User with that email already exists', 400);
  }
  const now = new Date().toISOString();
  const putItemParams =  {
    Item: {
      user_id: { S: uuidv4() },
      created_at: { S: now },
      updated_at: { S: now },
      email: { S: user.email.toLowerCase() },
      password: { S: user.password },
      contacts: { L: [] },
    },
    TableName: DYNAMO_DB_TABLE_NAME,
  };
  console.log('postUsersRegisterHandler: putitem params', putItemParams);
  const putItemResponse = await dynamodb.putItem(putItemParams).promise();
  console.log('postUsersRegisterHandler: putitem response', putItemResponse);
  return {
    message: 'Signed up successfully!',
  };
}

async function postUsersAuthenticateHandler(body) {
}

function initEnvVars(stageVariables) {
  DYNAMO_DB_TABLE_NAME = stageVariables.DYNAMO_DB_TABLE_NAME;
}

exports.handler = async (event) => {
  const { stageVariables, ...eventStripped } = event;
  console.log('Event received: ', JSON.stringify(eventStripped));
  const response = {
    statusCode: 200,
    headers: {
      'X-Requested-With': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
      'Access-Control-Allow-Origin': '*',
    },
    isBase64Encoded: false,
    body: {
      message: 'OK',
    },
  };
  try {
    const {
      body,
      requestContext: {
        httpMethod,
        resourcePath,
      },
    } = event;
    const eventBody = JSON.parse(body);
    const requestHandlerMethod = ROUTES[resourcePath][httpMethod];
    initEnvVars(stageVariables);
    response.body = await requestHandlerMethod(eventBody);
  } catch (e) {
    console.log(e);
    response.statusCode = e.statusCode || 500;
    response.body.message = e.message;
  }
  console.log(`Returning ${JSON.stringify(response, null, 2)}`);
  response.body = JSON.stringify(response.body);
  return response;
};
