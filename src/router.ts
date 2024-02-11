import { ERROR_MSG, STATUS, MethodHandlers, Method } from './constants';
import { IncomingMessage, ServerResponse } from 'http';
import { userCommand } from './userCommand';

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { url, method } = req;
    if (!url) {
      throw new Error(ERROR_MSG.INVALID_URL);
    }
    const id = extractIdFromUrlPath(url) || '';
    const handleGetRequest = async () => {
      const getUser = await userCommand.get(id);
      res.writeHead(STATUS.SUCCESS);
      res.write(JSON.stringify(getUser));
      res.end();
    };

    const handlePostRequest = async () => {
      let postData = '';
      req.on('data', chunk => {
        postData += chunk;
      }).on('end', async () => {
        if (!postData) {
          res.writeHead(STATUS.INVALID);
          res.write(ERROR_MSG.INVALID_DATA);
          res.end();
          return;
        }

        try {
          const newUser = JSON.parse(postData);
          const resData = await userCommand.post(newUser);
          res.writeHead(STATUS.CREATED);
          res.write(JSON.stringify(resData));
          res.end();
        } catch (error) {
          res.writeHead(STATUS.INVALID);
          res.write(ERROR_MSG.INVALID_DATA);
          res.end();
        }
      });
    };


    const handlePutRequest = async () => {
      let putData = '';
      req.on('data', chunk => {
        putData += chunk;
      }).on('end', async () => {
        if (!putData) {
          res.writeHead(STATUS.INVALID);
          res.write(ERROR_MSG.INVALID_DATA);
          res.end();
          return;
        }

        try {
          const updatedUser = JSON.parse(putData);
          await userCommand.put(id, updatedUser);
          res.writeHead(STATUS.SUCCESS);
          res.end();
        } catch (error) {
          res.writeHead(STATUS.INVALID);
          res.write(ERROR_MSG.INVALID_DATA);
          res.end();
        }
      });
    };


    const handleDeleteRequest = async () => {
      await userCommand.delete(id);
      res.writeHead(STATUS.DELETED);
      res.end();
    };

    const methodHandlers: MethodHandlers = {
      GET: handleGetRequest,
      POST: handlePostRequest,
      PUT: handlePutRequest,
      DELETE: handleDeleteRequest
    };
    const handler = methodHandlers[method as Method];
    if (!handler) {
      throw new Error(ERROR_MSG.NOT_FOUND_URL);
    }
    await handler();
  } catch (err) {
    let statusCode = STATUS.ERROR;
    let errorMessage = ERROR_MSG.SERVER_ERROR;
    if (err instanceof Error) { 
      if (err.message === ERROR_MSG.INVALID_URL) {
        statusCode = STATUS.INVALID;
      } else if (err.message === ERROR_MSG.NOT_FOUND || err.message === ERROR_MSG.NOT_FOUND_URL) {
        statusCode = STATUS.NOT_FOUND;
        errorMessage = ERROR_MSG.NOT_FOUND;
      } else if (err.message === ERROR_MSG.INVALID_DATA || err.message === ERROR_MSG.INVALID_ID) {
        statusCode = STATUS.INVALID;
        errorMessage = err.message;
      }
    }
    res.writeHead(statusCode);
    res.write(errorMessage);
    res.end();
  }
};

const extractIdFromUrlPath = (url: string) => {
  const urlParts = url.split('/');
  const idIndex = urlParts.indexOf('users') + 1;
  return urlParts[idIndex];
};
