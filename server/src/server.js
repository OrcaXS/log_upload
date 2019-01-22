const Hapi = require('hapi');
const Boom = require('boom');
const Inert = require('inert');
const path = require('path');
const fs = require('fs');

const server = Hapi.server({
  port: process.env.API_PORT,
  host: process.env.API_DOMAIN,
});

const androidPath = path.join(process.env.LOG_PATH, 'android');
const iosPath = path.join(process.env.LOG_PATH, 'ios');
const pcPath = path.join(process.env.LOG_PATH, 'pc');

const checkPath = async (folderPath) => {
  fs.access(folderPath, fs.constants.W_OK, (err) => {
    console.info(process.env.LOG_PATH);
    if (err) {
      throw new Error('Log dir not writable.');
    }
    console.log('Log dir is writable.');
  });
};

const createFolders = async () => {
  fs.access(androidPath, fs.constants.W_OK, () => {
    fs.mkdir(androidPath, { recursive: true }, (err) => {
      if (err) throw err;
    });
  });
  fs.access(iosPath, fs.constants.W_OK, () => {
    fs.mkdir(iosPath, { recursive: true }, (err) => {
      if (err) throw err;
    });
  });
  fs.access(pcPath, fs.constants.W_OK, () => {
    fs.mkdir(pcPath, { recursive: true }, (err) => {
      if (err) throw err;
    });
  });
};

const handleLogUpload = async (payload) => {
  const { ios, android, pc } = payload;
  let response = {};
  if (ios) {
    response = await uploader(ios, 'ios');
  } else if (android) {
    response = await uploader(android, 'android');
  } else if (pc) {
    response = await uploader(pc, 'pc');
  } else throw new Error('Invalid form name');
  return response;
};

const uploader = async (file, option) => {
  if (!file) throw new Error('no file(s)');
  let platformPath = '';
  let response = {};
  if (option === 'android') platformPath = androidPath;
  if (option === 'ios') platformPath = iosPath;
  if (option === 'pc') platformPath = pcPath;
  if (Array.isArray(file)) {
    response = await filesHandler(file, platformPath);
  } else {
    response = await fileHandler({
      data: file._data, platformPath, filename: file.hapi.filename,
    });
  }
  return response;
};

const fileHandler = async ({ data, platformPath, filename }) => {
  console.log({ platformPath, filename });
  await fs.promises.writeFile(path.join(platformPath, filename), data);
  return { status: 'success', filename, message: 'Upload successfully!' };
};

const filesHandler = async (files, platformPath) => {
  if (!files || !Array.isArray(files)) throw new Error('no files');

  const promises = files.map(file => fileHandler({
    data: file._data, platformPath, filename: file.hapi.filename
  }));
  return Promise.all(promises);
};

const init = async () => {
  await checkPath(process.env.LOG_PATH);
  await createFolders();
  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/dist/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '../..', 'client/dist'),
        index: ['index.html', 'default.html'],
      },
    },
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return process.env.LOG_PATH;
  },
});

server.route({
  method: 'POST',
  path: '/upload',
  config: {
    cors: true,
    payload: {
      output: 'stream',
      allow: 'multipart/form-data',
    },
  },
  handler: async (request, h) => {
    const { payload } = request;
    try {
      const response = await handleLogUpload(payload);
      return response;
    } catch (e) {
      console.log(e);
      return Boom.badRequest(e);
    }
  },
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
