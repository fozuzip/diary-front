import moment from "moment";

function generateRandomData() {
  const countryCodes = [
    "AL",
    "AN",
    "AU",
    "BO",
    "BE",
    "BU",
    "HR",
    "CY",
    "EZ",
    "DA",
    "EN",
    "FI",
    "FR",
    "GM",
    "GR",
    "HU",
    "IC",
    "EI",
    "IT",
    "KV",
    "LG",
    "LH",
    "LU",
    "MK",
    "MT",
    "MD",
    "MN",
    "NL",
    "NO",
    "PL",
    "PO",
    "RO",
    "RI",
    "LO",
    "SI",
    "SP",
    "SW",
    "SZ",
    "UK",
    "UP",
    "RS",
    "BO",
    "MD",
    "SM",
    "IM",
    "LI",
    "MC",
    "VA",
  ];

  // Define the start and end dates
  const startDate = moment("1990-01-01");
  const endDate = moment("2023-06-01");

  let dates = [];

  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate, "month")) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "month");
  }

  return countryCodes.reduce(
    (acc, country) => ({
      ...acc,
      [country]: dates.reduce(
        (acc, date) => ({
          ...acc,
          [date]: {
            averageTemp: Math.floor(Math.random() * 101),
          },
        }),
        {}
      ),
    }),
    {}
  );
}

export async function getCountryTemperatures() {
  return new Promise((resolve, reject) => {
    const data = generateRandomData();
    setTimeout(() => resolve(data), 1000);
  });
}
