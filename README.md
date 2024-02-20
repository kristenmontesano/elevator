# elevator

### The prompt:

- Provide code that simulates an elevator.
- The result should be an executable, or script, that can be run with the following inputs and generate the following
  outputs.
  Inputs: [list of floors to visit] (e.g. elevator start=12 floor=2,9,1,32)
  Outputs: [total travel time, floors visited in order] (e.g. 560 12,2,9,1,32)
  Program Constants: Single floor travel time: 10

### Instructions:

1. Install the dependencies and devDependencies. The project requires Node.js version 16.0.0 or later.

```npm i```

2. Run the elevator script with desired arguments. The start floor should be a single positive integer and the floor
   should be a comma separated list of positive integers.

```npm run elevator start=<yourStartFloorInteger> floor=<yourTravelFloorsAsCommaSeparatedIntegers>```

Example:
```npm run elevator start=50 floor=10,80,85,90```

## Notes

* My assumption was the desire was to make the elevator as efficient as possible in terms of travel time.
* My implementation sorts the floors and then determines whether the high or low "end cap" floor is closest to the start
  floor (also taking into account whether the start floor itself is an "end cap" floor).
* Traveling from the start floor to the "end cap" floor that is closest, before changing directions to travel to the
  other "end cap" floor results in the most efficient travel time.
* I added some validation to the inputs, though more could be done. I also added some helpful error messages in the case
  of invalid inputs.
* I output the travel time and floors visited in order in the format requested, and I also added new lines to the output
  with some colored output with labels on those values for easier reading.

