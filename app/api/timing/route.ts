import type { NextRequest } from "next/server";
import * as timing from "../../types/raw-timing-feed";
import filterCars from "@/app/car-lookup";

export async function GET(request: NextRequest) {
    // focus cars
    const filterCarNums: number[] = [];
    Object.keys(filterCars).forEach((carNumber) => {
        filterCarNums.push(parseInt(carNumber, 10));
    });

    const res = await fetch(
        "https://insights.griiip.com/api/v2/public/live/session/18130/bootstrap?includeViewers=true&includeUnclassifiedRanks=false",
    );

    if (res.ok) {
        const timing: timing.TimingDetails = await res.json();

        const cars: timing.RankWithRunningStatus[] = [];

        timing.ranks.forEach((car) => {
            const curCarNum = parseInt(car.carNumber, 10);
            if (filterCarNums.includes(curCarNum)) {
                let isRunning = true;
                timing.runningStatuses.forEach((status) => {
                    if (parseInt(status.carNumber, 10) === curCarNum) {
                        isRunning = status.status === "Running";
                    }
                });

                let inPit = false;
                timing.carLocations.forEach((location) => {
                    if (parseInt(location.carNumber, 10) === curCarNum) {
                        inPit = location.carLocation === "Pit";
                    }
                });

                cars.push({
                    isRunning,
                    inPit,
                    ...car,
                });
            }
        });

        const sortedCars = cars.sort(
            (a, b) => a.overallPosition - b.overallPosition,
        );

        return Response.json({ cars: sortedCars });
    }
    return Response.json({ error: `couldnt get feed ${res.status}` });
}

export async function HEAD(request: NextRequest) { }

export async function POST(request: NextRequest) { }

export async function PUT(request: NextRequest) { }

export async function DELETE(request: NextRequest) { }

export async function PATCH(request: NextRequest) { }

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the Route Handler.
export async function OPTIONS(request: NextRequest) { }
