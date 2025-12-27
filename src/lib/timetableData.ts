
export interface ClassPeriod {
    period: number;
    startTime: string; // e.g., "09:00"
    endTime: string;   // e.g., "09:50"
}

export const ROOMS = [
    "14", "15", "105", "107",
    "201", "205", "206",
    "304", "305",
    "404"
];

export const PERIODS: ClassPeriod[] = [
    { period: 1, startTime: "09:00", endTime: "09:50" },
    { period: 2, startTime: "10:00", endTime: "10:50" },
    { period: 3, startTime: "11:00", endTime: "11:50" },
    { period: 4, startTime: "11:50", endTime: "12:40" },
    // Lunch 12:40 - 01:20
    { period: 5, startTime: "01:20", endTime: "02:10" },
    { period: 6, startTime: "02:20", endTime: "03:10" },
    { period: 7, startTime: "03:20", endTime: "04:10" },
    { period: 8, startTime: "04:10", endTime: "05:00" },
];

// Map Day -> Period -> Occupied Rooms
// We will assume if a room is NOT in this list for a period, it is FREE.
export const OCCUPIED_SCHEDULE: Record<string, Record<number, string[]>> = {
    "Monday": {
        1: ["105", "201", "304"], // Example data
        2: ["105", "201", "304", "14"],
        3: ["105", "201", "304", "14", "15"],
        4: ["206", "404"],
        5: ["107", "305"],
        6: ["201", "205"],
        7: ["14", "15"],
        8: []
    },
    "Tuesday": {
        1: ["206", "404"],
        2: ["107", "305"],
        3: ["201", "205"],
        4: ["14", "15", "105"],
        5: ["105", "201"],
        6: ["304"],
        7: [],
        8: []
    },
    "Wednesday": {
        1: ["14", "15"],
        2: ["105", "201"],
        3: ["206", "404"],
        4: ["107"],
        5: ["305"],
        6: ["201"],
        7: ["205"],
        8: []
    },
    "Thursday": {
        1: ["201", "205"],
        2: ["14", "15"],
        3: ["105"],
        4: ["206"],
        5: ["404"],
        6: ["107"],
        7: ["305"],
        8: []
    },
    "Friday": {
        1: ["107", "305"],
        2: ["201", "205"],
        3: ["14"],
        4: ["15"],
        5: ["105"],
        6: ["206"],
        7: ["404"],
        8: []
    },
    "Saturday": {
        1: ["105", "201", "304"],
        2: ["105", "201", "304"],
        3: ["14", "15"],
        4: ["206"], // Half day usually? Assuming full for now based on request "Periods 1-8"
        5: [],
        6: [],
        7: [],
        8: []
    }
};
