export const GLOBAL_SIZE = JSON.stringify({width: "200px", height: "50px", padding: "0px"})

export const fakeData = [
    {
        $id: 1,
        body: JSON.stringify(
            'Chevy 1980'
        ),
        noteData: JSON.stringify({
            id: "color-purple",
            width: GLOBAL_SIZE.width,
            height: GLOBAL_SIZE.height,
            colorHeader: "#FED0FD",
            colorBody: "#FEE5FD",
            colorText: "#18181A",
            vehicleInfo: {
                VIN: "7J3ZZ56T7834500003",
                //partsUnavail: ["Front Bumper", "Passenger Fender"],
                partsUnavail: [
                    { label: "Front Bumper", value: "front_bumper" },
                    { label: "Passenger Fender", value: "passenger_fender" },
                    { label: "Alternator", value: "alternator" },
                    { label: "Passenger Headlight", value: "passenger_headlight" },
                ],
                motorType: "V8",
                mileage: "125,567",
            },
        }),
        position: { x: 100, y: 50},
    },
     {
        $id: 2,
        body: JSON.stringify(
            '1945 Ford'
        ),
        noteData: JSON.stringify({
            id: "color-blue",
            width: GLOBAL_SIZE.width,
            height: GLOBAL_SIZE.height,
            colorHeader: "#9BD1DE",
            colorBody: "#A6DCE9",
            colorText: "#18181A",
            vehicleInfo: {
                VIN: "1G1YZ23J9P5803427",
                //partsUnavail: ["Engine", "Driver Door"],
                partsUnavail: [
                    { label: "Engine", value: "engine" },
                    { label: "Driver Door", value: "driver_door" },
                ],
                motorType: "4 Cylinder",
                mileage: "218,390",
            },
        }),
        position: { x: 100, y: 100 + 25 },

    },
    {
        $id: 3,
        body: JSON.stringify(
            'Toyota'
        ),
        noteData: JSON.stringify({
            id: "color-yellow",
            width: GLOBAL_SIZE.width,
            height: GLOBAL_SIZE.height,
            colorHeader: "#FFEFBE",
            colorBody: "#FFF5DF",
            colorText: "#18181A",
            vehicleInfo: {
                VIN: "1G1YY25R695700001",
                //partsUnavail: ["Transmission", "Radiator"],
                partsUnavail: [
                    { label: "Transmission", value: "transmission" },
                    { label: "Radiator", value: "radiator" },
                ],
                motorType:"V6",
                mileage: "147,165",
            }
        }),
        position: { x: 100, y: 175 + 25 },

    },
];

