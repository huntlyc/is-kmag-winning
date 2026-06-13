"use client";

import { KMagStatus } from "./KMagStatus";
const KMAG_NUMBER = 15;
const JESUS_NUMBER = 51;
const AIT_NUMBER = 12;
import { RankWithRunningStatus } from "../types/raw-timing-feed";
import { useEffect, useState } from "react";

const getDrivername = (car: RankWithRunningStatus) => {
    switch (parseInt(car.carNumber, 10)) {
        case KMAG_NUMBER:
            return "K-mag";
        case JESUS_NUMBER:
            return "Jesus";
        case AIT_NUMBER:
            return "Aitkin";
    }
};
const Car = ({ car }: { car: RankWithRunningStatus }) => {
    const borderClassByCarNumber: Record<number, string> = {
        [KMAG_NUMBER]: "border-blue-500",
        [JESUS_NUMBER]: "border-red-500",
        [AIT_NUMBER]: "border-green-500",
    };

    const borderClass =
        borderClassByCarNumber[parseInt(car.carNumber, 10)] ?? "border-zinc-800";

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
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                >
                    {car.isRunning ? "Running" : "Retired"}
                </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Class Pos
                    </p>
                    <p className="font-mono text-2xl font-semibold text-white">
                        {car.position}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Overall
                    </p>
                    <p className="font-mono text-2xl font-semibold text-white">
                        {car.overallPosition}
                    </p>
                </div>
            </div>
        </article>
    );
};

export const Cars = () => {
    const [cars, setCars] = useState<RankWithRunningStatus[]>([]);

    async function fetchTiming() {
        const res = await fetch(`/api/timing`);
        if (!res.ok) {
            return;
        }
        const data: { cars: RankWithRunningStatus[] } = await res.json();

        if (data.cars) {
            setCars(data.cars);
        }
    }
    useEffect(() => {
        const inititalSetup = async () => {
            await fetchTiming();
        };
        inititalSetup();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
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
        </>
    );
};
