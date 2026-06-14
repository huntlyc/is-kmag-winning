import { RankWithRunningStatus } from "../types/raw-timing-feed";

export const KMagStatus = (props: {
    cars: RankWithRunningStatus[];
    num: number;
}) => {
    const cars = props.cars;
    const num = props.num;

    let span = <span className="text-red-600">No</span>;
    cars.forEach((car) => {
        if (parseInt(car.carNumber, 10) == num) {
            if (!car.isRunning) {
                span = <span className="text-red-300">He&apos;s gone home</span>;
            } else if (car.overallPosition == 1) {
                span = <span className="text-emerald-400">YES!</span>;
            } else if (car.position == 1) {
                // class pos
                span = <span className="text-yellow-300">Sort of...</span>;
            }
        }
    });

    return (
        <>
            <h1 className="text-4xl mb-2 font-bold tracking-tight text-center text-white">
                Is KMag Winning?
            </h1>
            <h2 className="text-4xl font-bold tracking-tight text-center">{span}</h2>
        </>
    );
};
