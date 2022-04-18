
export enum Seat {
    South = "South",
    West = "West",
    North = "North",
    East = "East",
}

export function seatIndex(seat: Seat) {
    return Object.keys(Seat).indexOf(seat);
}

export function nextSeat(seat: Seat, num: number = 1) {
    return Object.values(Seat)[(seatIndex(seat) + num) % 4];
}