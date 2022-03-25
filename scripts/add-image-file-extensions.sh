#!/bin/bash

set -e

for name in $(cd data/images && ls) ; do
  with_path=data/images/${name}
  ext=$(
    node <<HERE
      (async() => {
        const imageType = await import('image-type');
        const {readChunk} = await import('read-chunk');
        const buffer = await readChunk('${with_path}', {length: 12, startPosition: 0});
        console.log(imageType.default(buffer).ext);
      })();
HERE
  )

  mv ${with_path} ${with_path}.${ext}
  find data -name '*.json' -print0 | xargs -0 sed -i -e "s@$name@$name.$ext@g"
done
