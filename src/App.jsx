import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppShell,
  Group,
  LoadingOverlay,
  Select,
  Skeleton,
} from "@mantine/core";

import Map from "./components/Map";
import Header from "./Header";
import PlayControls from "./PlayControls";

import {
  getAnalysis,
  getGsom,
  getMaximumTemperature,
  getMinimumTemperature,
} from "./utils/api";

function App() {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [maximumTemperature, setMaximumTemperature] = useState(null);
  const [minimumTemperature, setMinimumTemperature] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  console.log(selectedDate);
  useEffect(() => {
    setSelectedDate(dateRange.from);
  }, [dateRange]);

  const handleAnimationButtonClick = (date) => {
    if (!isPlaying && date) {
      setSelectedDate(date);
    }
    setIsPlaying(!isPlaying);
  };

  const fetchMinMaxTemperature = useCallback(async () => {
    const [maxTemp, minTemp] = await Promise.all([
      getMaximumTemperature(measurement),
      getMinimumTemperature(measurement),
    ]);
    setMaximumTemperature(maxTemp);
    setMinimumTemperature(minTemp);
  }, [measurement]);

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

  useEffect(() => {
    if (measurement) fetchMinMaxTemperature();
  }, [measurement]);

  const dates = useMemo(
    () =>
      [...new Set(data.map(({ time }) => time))].map((time) =>
        moment(time).format("YYYY-MM-DD")
      ),
    [data]
  );

  useEffect(() => {
    if (isPlaying) {
      const currentIndex = dates.indexOf(selectedDate);
      if (currentIndex < dates.length - 1) {
        const delay = 10000 / dates.length;
        const timeoutId = setTimeout(
          () => setSelectedDate(dates[currentIndex + 1]),
          delay
        );
        return () => clearTimeout(timeoutId);
      } else {
        setIsPlaying(false);
      }
    }
  }, [selectedDate, isPlaying, dates]);

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
            zIndex: 100,
          }}
        >
          <Header
            measurement={measurement}
            onMeasurementChange={setMeasurement}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedDate={selectedDate}
          />
        </div>
        <div
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            zIndex: 100,
          }}
        >
          <PlayControls
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            dates={dates}
            isPlaying={isPlaying}
            handleAnimationButtonClick={handleAnimationButtonClick}
          />
        </div>
        <Map
          data={data}
          selectedDate={selectedDate}
          minTemperature={minimumTemperature}
          maxTemperature={maximumTemperature}
        />
      </div>
    </div>
  );
}

export default App;
