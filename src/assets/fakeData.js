
export const GLOBAL_SIZE = JSON.stringify({ width: "200px", height: "75px", padding: "0px" });


export const fakeData = [
    {
        $id: 1,
        noteData: JSON.stringify({
            id: "color-purple",
            width: GLOBAL_SIZE.width,
            height: GLOBAL_SIZE.height,
            colorHeader: "#FED0FD",
            colorBody: "#FEE5FD",
            colorText: "#18181A",
            vehicleInfo: {
                VIN: "7J3ZZ56T7834500003",
                YEAR: "1980",
                MAKE: "CHEVY",
                MODEL: "SILVERADO",
                MOTOR: "V8",
                TRANS: "MANUAL",
                DRIVETYPE: "4X4",
                EXTCOLOR: "BLACK",
                MILEAGE: "125,567",
                partsUnavail: [
                    { label: "Front Bumper", value: "front_bumper" },
                    { label: "Passenger Fender", value: "passenger_fender" },
                    { label: "Alternator", value: "alternator" },
                    { label: "Passenger Headlight", value: "passenger_headlight" },
                ],
            },
        }),
        position: { x: 100, y: 50 },
    },
    {
        $id: 2,
        noteData: JSON.stringify({
            id: "color-blue",
            width: GLOBAL_SIZE.width,
            height: GLOBAL_SIZE.height,
            colorHeader: "#9BD1DE",
            colorBody: "#A6DCE9",
            colorText: "#18181A",
            vehicleInfo: {
                VIN: "1HK503JB9P5523729",
                YEAR: "1945",
                MAKE: "HONDA",
                MODEL: "ALTIMA",
                MOTOR: "4 CYLINDER",
                TRANS: "AUTOMATIC",
                DRIVETYPE: "RWD",
                EXTCOLOR: "RED",
                MILEAGE: "103,503",
                partsUnavail: [
                    { label: "Engine", value: "engine" },
                    { label: "Driver Door", value: "driver_door" },
                ],
            },
        }),
        position: { x: 100, y: 100 + 50 },
    },
    {
        $id: 3,
        noteData: JSON.stringify({
            id: "color-yellow",
            width: GLOBAL_SIZE.width,
            height: GLOBAL_SIZE.height,
            colorHeader: "#FFEFBE",
            colorBody: "#FFF5DF",
            colorText: "#18181A",
            vehicleInfo: {
                VIN: "YG37025R495800501",
                YEAR: "2000",
                MAKE: "FORD",
                MODEL: "F150",
                MOTOR: "V6",
                TRANS: "manual",
                DRIVETYPE: "4X4",
                EXTCOLOR: "GREY",
                MILEAGE: "276,190",
                partsUnavail: [
                    { label: "Transmission", value: "transmission" },
                    { label: "Radiator", value: "radiator" },
                ],
            },
        }),
        position: { x: 100, y: 175 + 75 },
    },
].map(item => ({
    ...item,
    body: JSON.stringify(
        JSON.parse(item.noteData).vehicleInfo.YEAR + " " +
        JSON.parse(item.noteData).vehicleInfo.MAKE + " " +
        JSON.parse(item.noteData).vehicleInfo.MODEL
    )
}));
