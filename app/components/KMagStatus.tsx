import { RankWithRunningStatus } from "../types/raw-timing-feed";

export const KMagStatus = (props: {
    cars: RankWithRunningStatus[];
    num: number;
}) => {
    const cars = props.cars;
    const num = props.num;

    let span = <span className="text-red-600">No</span>;
    if (parseInt(cars[0].carNumber, 10) == num) {
        if (cars[0].overallPosition == 1) {
            span = <span className="text-emerald-400">YES!</span>;
        } else {
            span = <span className="text-yellow-300">Sort of...</span>;
        }
    }

    cars.forEach((car) => {
        if (!car.isRunning) {
            span = <span className="text-red-300">He&apos;s gone home</span>;
        }
    });

    return (
        <>
            <h1 className="text-4xl mb-2 font-bold tracking-tight text-center">
                Is KMag Winning?
            </h1>
            <h2 className="text-4xl font-bold tracking-tight text-center">{span}</h2>
        </>
    );
};
