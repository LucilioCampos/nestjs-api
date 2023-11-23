/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const dirCont = fs.readdirSync(path.join(__dirname, '..', 'proto'));
const files = dirCont.filter((elm) => elm.match(/.*\.(proto?)/gi));
const typesFolder = path.join(
  __dirname,
  '..',
  'libs',
  'common',
  'src',
  'types',
);

const protoBinPath =
  'npx protoc --plugin=' +
  path.join(__dirname, '..', 'node_modules', '.bin', 'protoc-gen-ts_proto');
const protoOut = ` --ts_proto_out=${typesFolder}`;
const protoOpt = ' --ts_proto_opt=nestJs=true';

for (let file of files) {
  const execution = `${protoBinPath}${protoOut}${protoOpt} ./proto/${file}`;
  exec(execution, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: generate ts files`);
  });
}
