
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Building, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROOMS, OCCUPIED_SCHEDULE, PERIODS } from '@/lib/timetableData';

const FreeRoomFinder = ({ onBack }: { onBack: () => void }) => {
    const [selectedDay, setSelectedDay] = useState<string>("Monday");
    const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
    const [selectedFloor, setSelectedFloor] = useState<string>("all");

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const floors = [
        { id: "all", label: "All Floors" },
        { id: "0", label: "Ground Floor" }, // Assuming 0-99
        { id: "1", label: "1st Floor" },    // 100-199
        { id: "2", label: "2nd Floor" },    // 200-299
        { id: "3", label: "3rd Floor" },    // 300-399
        { id: "4", label: "4th Floor" },    // 400-499
    ];

    // Helper to get floor from room number
    const getFloor = (room: string) => {
        const num = parseInt(room);
        if (num < 100) return "0";
        if (num < 200) return "1";
        if (num < 300) return "2";
        if (num < 400) return "3";
        return "4";
    };

    // Logic to find free rooms
    const getFreeRooms = () => {
        // Lunch Break Rule: 12:40 PM - 01:20 PM
        // The request says: "There is a 40-minute lunch break from 12:40 PM to 1:20 PM"
        // "During lunch break, ALL rooms must be marked FREE"
        // We need to check if the current time matches this, OR if the user selects a hypothetical "Lunch" Slot?
        // The filter is by "Period 1-8".
        // Period 4 ends 12:40. Period 5 starts 01:20.
        // If we strictly follow Period selection, we don't have a "Lunch" period in the dropdown 1-8.
        // However, for the sake of the tool, user selects Period.
        // Let's assume standard periods.

        // Normal Check
        const occupied = OCCUPIED_SCHEDULE[selectedDay]?.[selectedPeriod] || [];
        const free = ROOMS.filter(room => !occupied.includes(room));

        // Apply Floor Filter
        if (selectedFloor === "all") return free;
        return free.filter(room => getFloor(room) === selectedFloor);
    };

    const getOccupiedRooms = () => {
        const occupied = OCCUPIED_SCHEDULE[selectedDay]?.[selectedPeriod] || [];
        if (selectedFloor === "all") return occupied;
        return occupied.filter(room => getFloor(room) === selectedFloor);
    }

    const freeRooms = getFreeRooms();
    const occupiedRooms = getOccupiedRooms();

    const currentPeriodInfo = PERIODS.find(p => p.period === selectedPeriod);

    return (
        <div className="flex flex-col h-full bg-background min-h-screen">
            <header className="px-4 py-4 flex items-center gap-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl">
                    <Filter className="w-6 h-6 rotate-90" /> {/* Using generic icon as back arrow counterpart if needed, but sticking to arrow */}
                    <span className="sr-only">Back</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <h1 className="text-xl font-bold">Free Room Finder</h1>
            </header>

            <div className="p-4 space-y-6 pb-24">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
                    <p className="font-medium text-primary mb-1">Check Availability</p>
                    <p className="text-sm text-muted-foreground">Select a day and period to find an empty classroom for self-study.</p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Day</label>
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {days.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Period</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                            className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {PERIODS.map(p => (
                                <option key={p.period} value={p.period}>
                                    {p.period} ({p.startTime}-{p.endTime})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Filter by Floor</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {floors.map(floor => (
                            <button
                                key={floor.id}
                                onClick={() => setSelectedFloor(floor.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedFloor === floor.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {floor.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Free Rooms ({freeRooms.length})
                        </h3>
                        {freeRooms.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {freeRooms.map(room => (
                                    <motion.div
                                        key={room}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-green-500/10 border border-green-500/20 text-green-700 rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm"
                                    >
                                        <span className="text-lg font-bold">{room}</span>
                                        <span className="text-[10px] uppercase font-bold opacity-70">Free</span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-muted-foreground bg-muted/30 rounded-2xl border border-dashed">
                                No free rooms found.
                            </div>
                        )}
                    </div>

                    {/* Occupied Rooms Hidden */}
                </div>
            </div>
        </div>
    );
};

export default FreeRoomFinder;
