// .env files must be loaded before anything else.
import dotenv from 'dotenv';
import path from 'node:path';
import http from 'node:http';
import express from 'express';
import {Elevator} from "./Elevator";

dotenv.config({
  path: path.join(__dirname, '..', '.env'),
});

const serverPort = process.env.PORT;

const app = express();

app.use(express.json());

try {
  startup();
} catch (ex) {
  console.log('startup failed:', ex);
}

async function startup() {
  const server = http.createServer(app);

  server.listen(serverPort, async () => {
    let errStr: string | undefined;
    const logStr = 'To run the elevator program, run the following command: npm run dev start=<startingFloor> floor=<floorToVisit1,floorToVisit2,floorToVisit3,etc>';

    if (process.argv[2] === undefined || process.argv[3] === undefined) {
      errStr = 'Error: Invalid input. Too few arguments.';
    }

    if (process.argv[4] !== undefined) {
      errStr = 'Error: Invalid input. Too many arguments.';
    }

    if (errStr) {
      // log the errStr and logStr in red and yellow, for better visibility
      console.log('\x1b[31m%s\x1b[0m', errStr);
      console.log('\x1b[33m%s\x1b[0m', logStr);

      server.close();
      process.exit();
      return;
    }

    const validatedInputs = validateInputs(server);
    if (!validatedInputs.valid) {
      // log the errStr and logStr in red and yellow, for better visibility
      console.log('\x1b[31m%s\x1b[0m', validatedInputs.errStr);
      console.log('\x1b[33m%s\x1b[0m', logStr);

      server.close();
      process.exit();
      return;
    } else {
      const elevator = new Elevator(validatedInputs.startFloor!, validatedInputs.floorsToVisit!);
      console.log(elevator.totalTravelTime + ' ' + elevator.floorsVisitedOrder.join(','));

      // additionally log the total travel time and the floors visited in order in green and blue, for better visibility
      console.log('\x1b[32m%s\x1b[0m', `total travel time: ${elevator.totalTravelTime}`);
      console.log('\x1b[34m%s\x1b[0m', `floors visited in order: ${elevator.floorsVisitedOrder.join(',')}`);

      server.close();
      process.exit();
    }
  });
}

type ValidatedInputs = {
  valid: boolean;
  errStr: string;
  startFloor: number | undefined;
  floorsToVisit: number[] | undefined;
}

function validateInputs(server: http.Server): ValidatedInputs {
  let errStr = '';

  let startFloorStr = process.argv[2].replace('start=', '');
  startFloorStr = startFloorStr.endsWith(',') ? startFloorStr.slice(0, -1) : startFloorStr;

  // check if the starting floor is a single value, not separated by a comma
  if (startFloorStr.includes(',')) {
    errStr = `Error: Invalid input. Starting floor must be a single value.  You entered: ${process.argv[2]}`;
    return {valid: false, errStr, startFloor: undefined, floorsToVisit: undefined} as ValidatedInputs;
  }

  const startFloorInt = parseInt(startFloorStr);

  // check if the starting floor number is a positive integer
  if (isNaN(parseInt(startFloorStr)) || startFloorInt <= 0 || !Number.isInteger(startFloorInt)) {
    errStr = `Error: Starting floor must be a positive integer greater than 1. You entered: ${process.argv[2]}`;
    return {valid: false, errStr, startFloor: undefined, floorsToVisit: undefined} as ValidatedInputs;
  }

  // check if the floors to visit are a comma-separated list of positive integers
  let visitFloorsStr = process.argv[3].replace('floor=', '');
  visitFloorsStr = visitFloorsStr.endsWith(',') ? visitFloorsStr.slice(0, -1) : visitFloorsStr;
  const floorsToVisit = visitFloorsStr.split(',').map((floor) => parseInt(floor));
  if (floorsToVisit.some((floor) => isNaN(floor)) || floorsToVisit.some((floor) => floor <= 0 || !Number.isInteger(floor))) {
    errStr = `Error: All floors to visit must be positive integers greater than 1. You entered: ${process.argv[3]}`;
    return {valid: false, errStr, startFloor: undefined, floorsToVisit: undefined} as ValidatedInputs;
  }

  if (floorsToVisit.length === 0 || floorsToVisit.length === 1 && floorsToVisit[0] === startFloorInt) {
    errStr = `Error: You must enter at least one floor to visit, and it must be different from the starting floor. You entered: ${process.argv[3]}`;
    return {valid: false, errStr, startFloor: undefined, floorsToVisit: undefined} as ValidatedInputs;
  }

  return {valid: true, errStr, startFloor: startFloorInt, floorsToVisit} as ValidatedInputs;
}