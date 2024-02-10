import { API_BASE_URL, ERROR_MSG, STATUS, MethodHandlers, Method } from './constants';
import { IncomingMessage, ServerResponse } from 'http';
import { userCommand } from './userCommand';

type CustomRequest = IncomingMessage;
type CustomResponse = ServerResponse;
const extractIdFromUrlPath = (url: string) => {
  const urlSplits = url.split('/');
  if (urlSplits.length === 3 && urlSplits[2] === '') {
    return null;
  }
  return urlSplits[3] || null;
};

const isUrlPathValid = (url: string) => {
  const urlSplits = url.split('/');
  const endpointSplits = API_BASE_URL.split('/');
  if (!url.startsWith(API_BASE_URL)) {
    return false;
  }
  if (urlSplits.length < 3 || urlSplits.length > 4) {
    return false;
  }
  for (let i = 0; i < endpointSplits.length - 1; i++) {
    if (endpointSplits[i] !== urlSplits[i]) {
      return false;
    }
  }
  return true;
};


export const router = async (req: CustomRequest, res: CustomResponse) => {
  try {
    const { url, method } = req;
    if (!url) {
      throw new Error(ERROR_MSG.INVALID_URL);
    }
    if (!isUrlPathValid(url)) {
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
      const postUser: string[] = [];
      req.on('data', chunk => {
        postUser.push(chunk);
      }).on('end', async () => {
        const dataUser = JSON.parse(postUser.toString());
        const resData = await userCommand.post(dataUser);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(STATUS.CREATED);
        res.write(JSON.stringify(resData));
        res.end();
      });
    };

    const handlePutRequest = async () => {
      const putUser: string[] = [];
      req.on('data', chunk => {
        putUser.push(chunk);
      }).on('end', async () => {
        const dataUser = JSON.parse(putUser.toString());
        const resData = await userCommand.put(dataUser);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(STATUS.SUCCESS);
        res.write(JSON.stringify(resData));
        res.end();
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
    if (err instanceof Error) {
      let statusCode = STATUS.ERROR;
      if (err.message === ERROR_MSG.INVALID_URL) {
        statusCode = STATUS.INVALID;
      } else if (err.message === ERROR_MSG.NOT_FOUND_URL) {
        statusCode = STATUS.NOT_FOUND;
      }
      res.writeHead(statusCode);
      res.write(err.message);
      res.end();
    } else {
      console.error('Unknown error:', err);
      res.writeHead(STATUS.ERROR);
      res.write('An unknown error occurred');
      res.end();
    }
  }
};
