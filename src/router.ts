import { ERROR_MSG, STATUS, MethodHandlers, Method } from './constants';
import { IncomingMessage, ServerResponse } from 'http';
import { userCommand } from './userCommand';

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { url, method } = req;
    if (!url || !url.startsWith('/api/users')) {
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
        try {
          const dataUser = JSON.parse(postData);
          const resData = await userCommand.post(dataUser);
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
        try {
          const updatedUser = JSON.parse(putData);
          const resData = await userCommand.put(id, updatedUser);
          res.writeHead(STATUS.SUCCESS);
          res.write(JSON.stringify(resData));
          res.end();
        } catch (error) {
          let statusCode = STATUS.NOT_FOUND;
          let errorMessage = ERROR_MSG.NOT_FOUND;
          if (error instanceof Error) {
            if (error.message === ERROR_MSG.INVALID_ID) {
              statusCode = STATUS.INVALID;
              errorMessage = error.message;
            }
          }
          res.writeHead(statusCode);
          res.write(errorMessage);
          res.end();
        }
      });
    };

    const handleDeleteRequest = async () => {
      try {
        await userCommand.delete(id);
        res.writeHead(STATUS.DELETED);
        res.end();
      } catch (error) {
        let statusCode = STATUS.NOT_FOUND;
        let errorMessage = ERROR_MSG.NOT_FOUND;
        if (error instanceof Error) {
          if (error.message === ERROR_MSG.INVALID_ID) {
            statusCode = STATUS.INVALID;
            errorMessage = error.message;
          }
        }
        res.writeHead(statusCode);
        res.write(errorMessage);
        res.end();
      }
    };

    const methodHandlers: MethodHandlers = {
      GET: handleGetRequest,
      POST: handlePostRequest,
      PUT: handlePutRequest,
      DELETE: handleDeleteRequest
    };
    const handler = methodHandlers[method as Method];
    if (!handler) {
      throw new Error(ERROR_MSG.INVALID_URL);
    }
    await handler();
  } catch (err) {
    let statusCode = STATUS.ERROR;
    let errorMessage = ERROR_MSG.SERVER_ERROR;
    if (err instanceof Error) {
      switch (err.message) {
        case ERROR_MSG.INVALID_URL:
          statusCode = STATUS.NOT_FOUND;
          errorMessage = ERROR_MSG.INVALID_URL;
          break;
        case ERROR_MSG.INVALID_DATA:
        case ERROR_MSG.INVALID_ID:
          statusCode = STATUS.INVALID;
          errorMessage = ERROR_MSG.INVALID_ID;
          break;
        case ERROR_MSG.NOT_FOUND:
          statusCode = STATUS.NOT_FOUND;
          errorMessage = ERROR_MSG.NOT_FOUND;
          break;
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
