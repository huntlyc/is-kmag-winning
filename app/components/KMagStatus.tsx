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

    return (
        <h1 className="text-4xl font-bold tracking-tight text-center">
            Is KMag Winning? {span}
        </h1>
    );
};
