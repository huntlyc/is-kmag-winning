"use client";

import { useEffect, useState } from "react";
import { filterCars } from "@/app/car-lookup";
import { KMagStatus } from "@/app/components/KMagStatus";
import { RankWithRunningStatus } from "@/app/types/raw-timing-feed";

const getDrivername = (car: RankWithRunningStatus) => {
    let name = "";
    Object.entries(filterCars).forEach(([carNumber, carDetails]) => {
        if (carNumber == car.carNumber) {
            name = carDetails.name;
        }
    });
    return name;
};

const getBorder = (car: RankWithRunningStatus) => {
    let borderClass = "border-zinc-800";
    Object.entries(filterCars).forEach(([carNumber, carDetails]) => {
        if (carNumber == car.carNumber) {
            borderClass = carDetails.border;
        }
    });
    return borderClass;
};

const CarStatusBadge = (props: { car: RankWithRunningStatus }) => {
    const car = props.car;
    let runningColour = "bg-emerald-500/15 text-emerald-400";

    if (car.inPit) {
        runningColour = "bg-amber-300/15 text-amber-300";
    }

    if (!car.isRunning) {
        runningColour = "bg-red-500/15 text-red-400";
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${runningColour}`}
        >
            {car.isRunning ? (car.inPit ? "Pit" : "Running") : "Retired"}
        </span>
    );
};

const CarCard = ({ car }: { car: RankWithRunningStatus }) => {
    const overallFirst =
        car.overallPosition === 1 ? "text-yellow-400" : "text-white";
    const classFirst = car.position === 1 ? "text-yellow-400" : "text-white";

    return (
        <article
            className={`rounded-xl border-2 ${getBorder(car)} bg-zinc-900 p-5 shadow-sm transition hover:bg-zinc-800`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-400">Car</p>

                    <h2 className="text-3xl font-bold text-white">
                        #{car.carNumber} <small>({getDrivername(car)})</small>
                    </h2>
                </div>
                <CarStatusBadge car={car} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Class Pos
                    </p>
                    <p className={`font-mono text-2xl font-semibold ${classFirst}`}>
                        {car.position}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Overall
                    </p>
                    <p className={`${overallFirst} font-mono text-2xl font-semibold `}>
                        {car.overallPosition}
                    </p>
                </div>
            </div>
        </article>
    );
};

export const CarList = () => {
    const [cars, setCars] = useState<RankWithRunningStatus[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchTiming() {
        setLoading(true);
        const res = await fetch(`/api/timing`);
        if (!res.ok) {
            setLoading(false);
            return;
        }
        const data: { cars: RankWithRunningStatus[] } = await res.json();

        if (data.cars) {
            setCars(data.cars);
        }
        setLoading(false);
    }

    useEffect(() => {
        const setup = async () => {
            await fetchTiming();
        };
        setup();
        const interval = setInterval(fetchTiming, 30_000);
        return () => clearInterval(interval);
    }, []);

    if (cars.length == 0) {
        return (
            <>
                <Spinner />
                <p className="text-center text-white">Loading...</p>
            </>
        );
    }

    return (
        <>
            <header className="mb-10">
                <KMagStatus cars={cars} />
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                    <CarCard key={car.pid} car={car} />
                ))}
            </section>
            {loading && <Spinner />}
            {!loading && (
                <p className="mt-4 opacity-50 text-center text-white">
                    Refreshes once in a while
                </p>
            )}
        </>
    );
};

export const Spinner = () => {
    return (
        <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
        </div>
    );
};
