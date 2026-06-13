"use client";

import { KMagStatus } from "./KMagStatus";
import filterCars from "../car-lookup";
const KMAG_NUMBER = 15;
import { RankWithRunningStatus } from "../types/raw-timing-feed";
import { useEffect, useState } from "react";

const getDrivername = (car: RankWithRunningStatus) => {
    let name = "";
    Object.entries(filterCars).forEach(([carNumber, carDetails]) => {
        if (carNumber == car.carNumber) {
            name = carDetails.name;
        }
    });
    return name;
};

const Car = ({ car }: { car: RankWithRunningStatus }) => {
    let borderClass = "border-zinc-800";
    Object.entries(filterCars).forEach(([carNumber, carDetails]) => {
        if (carNumber == car.carNumber) {
            borderClass = carDetails.border;
        }
    });

    const overallFirst =
        car.overallPosition === 1 ? "text-yellow-400" : "text-white";
    const classFirst = car.position === 1 ? "text-yellow-400" : "text-white";
    return (
        <article
            className={`rounded-xl border-2 ${borderClass} bg-zinc-900 p-5 shadow-sm transition hover:bg-zinc-800`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-400">Car</p>

                    <h2 className="text-3xl font-bold text-white">
                        #{car.carNumber} <small>({getDrivername(car)})</small>
                    </h2>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${car.isRunning
                            ? car.inPit
                                ? "bg-amber-300/15 text-amber-300"
                                : "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                >
                    {car.isRunning ? (car.inPit ? "Pit" : "Running") : "Retired"}
                </span>
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

export const Spinner = () => {
    return (
        <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
        </div>
    );
};

export const Cars = () => {
    const [cars, setCars] = useState<RankWithRunningStatus[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchTiming() {
        const res = await fetch(`/api/timing`);
        if (!res.ok) {
            return;
        }
        const data: { cars: RankWithRunningStatus[] } = await res.json();

        if (data.cars) {
            setCars(data.cars);
        }
        setLoading(false);
    }
    useEffect(() => {
        const inititalSetup = async () => {
            await fetchTiming();
        };
        inititalSetup();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(true);
            fetchTiming();
        }, 60_000); // every minute

        return () => clearInterval(interval);
    }, []);

    if (cars.length == 0) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <header className="mb-10">
                <KMagStatus cars={cars} num={KMAG_NUMBER} />
            </header>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                    <Car key={car.pid} car={car} />
                ))}
            </section>
            {loading && <Spinner />}
            {!loading && (
                <p className="mt-4 opacity-50 text-center text-white">
                    Refeshes once in a while
                </p>
            )}
        </>
    );
};
