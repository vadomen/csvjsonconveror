import jsonexport from 'jsonexport';
import fs from 'fs';
import readline from 'readline';
import events from 'events';
import { set } from 'lodash';

const options = process.argv.slice(2)
const [mode, inputFile, outputFile] = options;

const jsonToCsv = async()  => {
  if (!inputFile) return console.error('Provide input file');
  try {
    const data = fs.readFileSync(inputFile, 'utf8');
    const csv = await jsonexport(JSON.parse(data), { verticalOutput: true });
    fs.writeFileSync(outputFile, csv);
  } catch (err) {
    console.error(err);
  }
}

const csv2Json = async () => {
  if (!inputFile) return console.error('Provide input file');
    try {
      const json: any = {};
      const rl = readline.createInterface({
        input: fs.createReadStream(inputFile),
        crlfDelay: Infinity
      });

      rl.on('line', (line) => {
        const [key, ...value] = line.split(',');
        set(json, key, value.join(',').replace(/\"/g, ""));
      });

      await events.once(rl, 'close');

      fs.writeFileSync(outputFile, JSON.stringify(json));
    } catch (err) {
      console.error(err);
    }
}

switch (mode) {
  case 'csv2json':
    csv2Json();
    break;
  case 'json2csv':
    jsonToCsv();
    break;
  default:
    console.error('Specify mode: csv2json | json2csv');
}
