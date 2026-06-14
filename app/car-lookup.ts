interface CarDetails {
    name: string;
    border: string;
}

interface FilterCars {
    [key: number]: CarDetails;
}

export const filterCars: FilterCars = {
    // hyper
    15: {
        name: "K-mag",
        border: "border-blue-500",
    },
    12: {
        name: "Delétraz",
        border: "border-yellow-500",
    },
    51: {
        name: "Jesus",
        border: "border-red-500",
    },
    //lmp2
    24: {
        name: "Doohan",
        border: "border-violet-500",
    },
    30: {
        name: "Pin",
        border: "border-pink-500",
    },
    // gt
    23: {
        name: "Barrichello",
        border: "border-green-500",
    },
};
