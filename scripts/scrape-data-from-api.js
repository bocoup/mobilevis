/**
 * As originally designed, the mobilev.is website served JSON-formatted data
 * from an HTTP API that was backed by a PostgreSQL database. It also relied on
 * images hosted in an Amazon Web Services S3 bucket.
 *
 * This script was written to retrieve the JSON data and the images in the
 * interest of simplifying the site's architecture. The files it creates may be
 * checked in to the project's repository, so that (following some minor
 * alterations to the front-end application, the site may be deployed as a
 * collection of static files.
 */
'use strict';

const {createWriteStream} = require('fs');
const fs = require('fs').promises;
const http = require('http');
const https = require('https');
const os = require('os');
const path = require('path');

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

const fetchImageWithCache = async (domain, id) => {
  const fileName = path.join('data', 'images', id);

  try {
    await fs.readFile(fileName);
    return;
  } catch ({}) {}

  const url = `${domain}/${id}`;
  const tempFileName = path.join('.', `tmp-${id}`);

  try {
    await new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        const file = createWriteStream(tempFileName);
        response.pipe(file);
        response.on('end', resolve);
      });
      request.on('error', reject);
    });

    await mkDirP(path.dirname(fileName));
    await fs.rename(tempFileName, fileName);
  } catch (error) {
    await fs.rm(tempFileName);
    throw error;
  }
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
  const fetchMobileVisImage = fetchImageWithCache.bind(null, 'https://s3.amazonaws.com/mobilevis.bocoup.com/images');
  const fetchMobileVisJSON = fetchJSONWithCache.bind(null, 'http://mobilev.is/api/v1');
  const submissions = await fetchMobileVisJSON('submissions');

  await Promise.all(
    submissions.map((submission) => {
      return Promise.all([
        fetchMobileVisJSON(`submissions/${submission.id}`),
        fetchMobileVisJSON(`submissions/${submission.id}/comments`),
        fetchMobileVisJSON(`users/submissions/${submission.twitter_handle}`),
        fetchMobileVisJSON(`creators/submissions/${encodeURIComponent(submission.creator)}`),
        ...submission.tags.map((tag) => fetchMobileVisJSON(`tags/${tag.id}`)),
        ...submission.images.map((image) => fetchMobileVisImage(image.url))
      ]);
    })
  );
})();
