import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";

import MapArea from "./MapArea";
import Header from "./Header";
import PlayControls from "./PlayControls";

import { getAnalysis, getGsom } from "./utils/api";
import { measurementOptions } from "./utils/measurements";
import CountryModal from "./CountryModal";

function App() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const fetchData = useCallback(async () => {
    let data;
    const params = {
      measurement: measurement,
      start_date: dateRange.from,
      end_date: dateRange.to,
    };
    if (measurement === "Average_Temperature") {
      data = await getGsom(params);
    } else {
      data = await getAnalysis(params);
    }
    setData(data);
  });

  useEffect(() => {
    if (measurement && dateRange.from && dateRange.to) {
      fetchData();
    }
  }, [dateRange, measurement]);

  const interval = useMemo(
    () =>
      measurement &&
      measurementOptions.find((option) => option.value === measurement)
        .interval,
    [measurement]
  );

  const dates = useMemo(
    () =>
      [...new Set(data.map(({ time }) => time))].map((time) =>
        moment(time).format("YYYY-MM-DD")
      ),
    [data]
  );

  // TODO : loading overlay throguh context

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            top: 0,
            zIndex: 210,
          }}
        >
          <Header
            measurement={measurement}
            onMeasurementChange={setMeasurement}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            interval={interval}
            showDate={!selectedCountry}
          />
        </div>
        <div
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            zIndex: 210,
          }}
        >
          {!selectedCountry && (
            <PlayControls
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dates={dates}
              interval={interval}
            />
          )}
        </div>
        {selectedCountry && (
          <CountryModal
            country={selectedCountry}
            dateRange={dateRange}
            onClose={() => setSelectedCountry(null)}
          />
        )}
        <MapArea
          data={data}
          selectedDate={selectedDate}
          onCountrySelect={setSelectedCountry}
        />
      </div>
    </div>
  );
}

export default App;
