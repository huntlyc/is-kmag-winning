import type { NextRequest } from "next/server";
import * as timing from "../../types/raw-timing-feed";

export async function GET(request: NextRequest) {
    // focus cars
    const filterCars = [15, 12, 51];

    const res = await fetch(
        "https://insights.griiip.com/api/v2/public/live/session/18130/bootstrap?includeViewers=true&includeUnclassifiedRanks=false",
    );

    if (res.ok) {
        const timing: timing.TimingDetails = await res.json();

        const cars: timing.RankWithRunningStatus[] = [];

        timing.ranks.forEach((car) => {
            const curCarNum = parseInt(car.carNumber, 10);
            if (filterCars.includes(curCarNum)) {
                timing.runningStatuses.forEach((status) => {
                    if (parseInt(status.carNumber, 10) === curCarNum) {
                        cars.push({ isRunning: status.status === "Running", ...car });
                    }
                });
            }
        });
        return Response.json({ cars });
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
