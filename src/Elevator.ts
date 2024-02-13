export class Elevator {
  startFloor: number;
  floorsToVisit: number[];
  singleFloorTravelTime = 10;
  totalTravelTime = 0;
  floorsVisitedOrder: number[] = [];

  constructor(startFloor: number, floorsToVisit: number[]) {
    this.startFloor = startFloor;
    this.floorsToVisit = floorsToVisit;
    this.sortFloorsToVisit();
    const startDown = this.startMovingDown();
    this.setFloorOrderWithTravelTime(startDown);
  }

  private sortFloorsToVisit() {
    this.floorsToVisit.push(this.startFloor);
    this.floorsToVisit.sort((a, b) => a - b);
    this.floorsToVisit = this.floorsToVisit.filter((floor, idx) => this.floorsToVisit.indexOf(floor) === idx);
  }

  private startMovingDown(): boolean {
    // the fastest route will be to go in the direction of the closest min/max floor of the sorted list, relative to the starting floor, before going in the opposite direction
    // in the case of a tie it doesn't matter which direction we go first

    // handle the case where the starting floor is the min/max floor to visit
    const startFloorIdx = this.floorsToVisit.indexOf(this.startFloor);
    if (startFloorIdx === 0) return false;
    if (startFloorIdx === this.floorsToVisit.length - 1) return true;

    const distToHigh = Math.abs(this.floorsToVisit[this.floorsToVisit.length - 1] - this.startFloor);
    const distToLow = Math.abs(this.floorsToVisit[0] - this.startFloor);
    return distToLow <= distToHigh;
  }

  private setFloorOrderWithTravelTime(startDown: boolean) {
    const startFloorIdx = this.floorsToVisit.indexOf(this.startFloor);

    // set the floorsVisitedOrder by moving sections of the array and/or reversing sections
    // based on whether we start moving up or down
    if (startDown) {
      const startDirFloors = Array.from(this.floorsToVisit.slice(0, startFloorIdx + 1).reverse());
      this.totalTravelTime += startDirFloors.length > 0 ? Math.abs(startDirFloors[0] - startDirFloors[startDirFloors.length - 1]) * this.singleFloorTravelTime : 0;
      const endDirFloors = Array.from(this.floorsToVisit.slice(startFloorIdx + 1));
      this.totalTravelTime += endDirFloors.length > 0 ? Math.abs(startDirFloors[startDirFloors.length - 1] - endDirFloors[endDirFloors.length - 1]) * this.singleFloorTravelTime : 0;
      this.floorsVisitedOrder = startDirFloors.concat(endDirFloors);
    } else {
      const startDirFloors = Array.from(this.floorsToVisit.slice(startFloorIdx));
      this.totalTravelTime += startDirFloors.length > 0 ? Math.abs(startDirFloors[0] - startDirFloors[startDirFloors.length - 1]) * this.singleFloorTravelTime : 0;
      const endDirFloors = Array.from(this.floorsToVisit.slice(0, startFloorIdx).reverse());
      this.totalTravelTime += endDirFloors.length > 0 ? Math.abs(startDirFloors[startDirFloors.length - 1] - endDirFloors[endDirFloors.length - 1]) * this.singleFloorTravelTime : 0;
      this.floorsVisitedOrder = startDirFloors.concat(endDirFloors);
    }
  }
}