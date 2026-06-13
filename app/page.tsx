import { RankWithRunningStatus } from "./types/raw-timing-feed";
const KMAG_NUMBER = 15;
const JESUS_NUMBER = 51;
const AIT_NUMBER = 12;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

const KMagStatus = (props: { cars: RankWithRunningStatus[] }) => {
    const cars = props.cars;

    let span = <span className="text-red-600">No</span>;
    if (parseInt(cars[0].carNumber, 10) == KMAG_NUMBER) {
        if (cars[0].overallPosition == 1) {
            span = <span className="text-emerald-400">YES!</span>;
        } else {
            span = <span className="text-yellow-300">Sort of...</span>;
        }
    }

    return (
        <h1 className="text-4xl font-bold tracking-tight text-center">
            Is KMag Winning? {span}
        </h1>
    );
};

export default async function Home() {
    const res = await fetch(`${BASE_URL}/api/timing`);
    if (!res.ok) {
        return "<p>ERR</p>";
    }
    const cars: { cars: RankWithRunningStatus[] } = await res.json();

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <main className="mx-auto max-w-5xl px-6 py-10">
                <header className="mb-10">
                    <KMagStatus cars={cars.cars} />
                </header>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cars.cars.map((car) => (
                        <Car key={car.pid} car={car} />
                    ))}
                </section>
            </main>
        </div>
    );
}
