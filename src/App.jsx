import moment from "moment";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AppShell,
  Header,
  Group,
  LoadingOverlay,
  Select,
  Skeleton,
} from "@mantine/core";

import DarkModeSwitch from "./components/DarkModeSwitch";
import DateSlider from "./components/DateSlider";
import Map from "./components/Map";

import {
  getEarliest,
  getLatest,
  getMeasurements,
  getAnalysis,
} from "./utils/api";

const measurementOptions = [
  {
    value: "Average_Temperature_decadal_average",
    label: "Average Temprature by decade",
    interval: "decade",
  },
  {
    value: "Average_Temperature_yearly_average",
    label: "Average Temprature by year",
    interval: "year",
    default: true,
  },
  {
    value: "Average_Temperature_monthly_average",
    label: "Average Temprature by month",
    interval: "month",
  },
];

function App() {
  const [measurements, setMeasurements] = useState([]);
  const [availableDateRange, setAvailableDateRange] = useState({
    from: null,
    to: null,
  });
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState(null);

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: null,
    to: null,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);

  const fetchMeasurements = useCallback(async () => {
    const data = await getMeasurements();
    const options = measurementOptions.filter((option) =>
      data.includes(option.value)
    );
    setMeasurements(options);
    const defaultMeasurement = options.find((m) => m.default);
    setSelectedMeasurement(
      defaultMeasurement ? defaultMeasurement.value : options[0].value
    );
  }, []);

  const fetchAvailableDateRange = useCallback(async () => {
    const [fromTimestamp, toTimestamp] = await await Promise.all([
      getEarliest(),
      getLatest(),
    ]);
    const from = moment(fromTimestamp).format("YYYY-MM-DD");
    const to = moment(toTimestamp).format("YYYY-MM-DD");
    setAvailableDateRange({ from, to });
    setSelectedDateRange({ from, to });
    setSelectedDate(from);
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);
      await Promise.all([fetchAvailableDateRange(), fetchMeasurements()]);
    } catch (error) {
      setError(error);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoadingData(true);
      const data = await getAnalysis({
        measurement: selectedMeasurement,
        start_date: selectedDateRange.from,
        end_date: selectedDateRange.to,
      });
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoadingData(false);
    }
  });

  useEffect(() => {
    if (selectedMeasurement && selectedDateRange.from && selectedDateRange.to) {
      fetchData();
    }
  }, [selectedDateRange, selectedMeasurement]);

  const dates = useMemo(
    () =>
      [...new Set(data.map(({ time }) => time))].map((time) =>
        moment(time).format("YYYY-MM-DD")
      ),
    [data]
  );

  return (
    <>
      <LoadingOverlay visible={loadingOptions} overlayBlur={2} />

      <AppShell
        padding="0"
        header={
          <Header height={80}>
            <Group sx={{ height: "100%" }} px={20}>
              <DateSlider
                selectedDate={selectedDate}
                dates={dates}
                onChange={setSelectedDate}
              />
              <Select
                data={measurements}
                value={selectedMeasurement}
                onChange={setSelectedMeasurement}
                placeholder="Measurment"
                sx={{
                  minWidth: "250px",
                }}
              />
              <DarkModeSwitch />
            </Group>

            {loadingData && <Skeleton height={4} radius="xl" />}
          </Header>
        }
      >
        <Map data={data} selectedDate={selectedDate} />
      </AppShell>
    </>
  );
}

export default App;
