'use strict';
const fs = require('fs').promises;
const http = require('http');
const path = require('path');

const DOMAIN = 'http://mobilev.is';

const limit = (max, fn) => {
  const queued = [];
  let count = 0;

  return function () {
    let go;
    const wrapped = new Promise((resolve, reject) => {
      go = () => {
        count += 1;
        return fn.apply(this, arguments)
          .then(resolve, reject)
          .then(() => {
            count -= 1;
            if (queued.length) {
              queued.shift()();
            }
          });
      };
    });

    count < max ? go() : queued.push(go);

    return wrapped;
  };
};

const fetchJSON = limit(5, (url) => {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Unexpected status code (${response.statusCode}) for response from ${url}`));
        response.resume();
        return;
      }

      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => body += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(Error(`Unable to parse JSON at ${url}: ${error}`));
        }
      });
    });

    request.on('error', reject);
  });
});

const mkDirP = (filePath) => {
  const mkdir = (dirName) => fs.mkdir(dirName)
    .catch((err) => { if (err.code !== 'EEXIST') { throw err; } });

  return filePath
    .split(path.sep)
    .map((_, index, parts) => path.join(...parts.slice(0, index + 1)))
    .reduce(
      (promise, dirName) => promise.then(() => mkdir(dirName)),
      Promise.resolve()
    );
};

const fetchJSONWithCache = async (domain, urlPath) => {
  const fileName = path.join('data', decodeURIComponent(path.normalize(urlPath)) + '.json');
  const json = await (fs.readFile(fileName, 'utf8').catch(() => {}));

  if (json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      throw new Error(`Unable to parse JSON in ${fleName}: ${error}`);
    }
  }

  const data = await fetchJSON(`${domain}/${urlPath}`);

  await mkDirP(path.dirname(fileName));
  await fs.writeFile(fileName, JSON.stringify(data), 'utf8');

  return data;
};

(async () => {
  const fetchMobileVis = fetchJSONWithCache.bind(null, 'http://mobilev.is');
  const submissions = await fetchMobileVis('api/v1/submissions');

  await Promise.all(
    submissions.map((submission) => {
      return Promise.all([
        fetchMobileVis(`api/v1/submissions/${submission.id}`),
        fetchMobileVis(`api/v1/submissions/${submission.id}/comments`),
        fetchMobileVis(`api/v1/users/submissions/${submission.twitter_handle}`),
        fetchMobileVis(`api/v1/creators/submissions/${encodeURIComponent(submission.creator)}`),
        ...submission.tags.map((tag) => fetchMobileVis(`api/v1/tags/${tag.id}`))
      ]);
    })
  );
})();
