import { useState, useEffect, useMemo } from "react";
import { AppShell, Header, Group, LoadingOverlay } from "@mantine/core";

import DarkModeSwitch from "./components/DarkModeSwitch";
import DateSlider from "./components/DateSlider";
import Map from "./components/Map";
import ErrorMessage from "./components/ErrorMessage";

import { getCountryTemperatures } from "./utils/api";
import useFetchOnMount from "./utils/useFetchOnMount";

function App() {
  const [data, loading, error] = useFetchOnMount(getCountryTemperatures);
  const [selectedDate, setSelectedDate] = useState(null);

  const countries = useMemo(() => {
    if (!data) return null;
    return Object.keys(data);
  }, [data]);
  const dates = useMemo(() => {
    if (!data) return null;
    return Object.keys(data[countries[0]]);
  }, [data]);

  useEffect(() => {
    if (dates && dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, [dates]);

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      {error ? (
        <ErrorMessage />
      ) : (
        <AppShell
          padding="0"
          header={
            <Header height={60}>
              <Group sx={{ height: "100%" }} px={20}>
                <DateSlider
                  selectedDate={selectedDate}
                  dates={dates}
                  onChange={setSelectedDate}
                />

                <DarkModeSwitch />
              </Group>
            </Header>
          }
        >
          <Map tempratures={data} selectedDate={selectedDate} />
        </AppShell>
      )}
    </>
  );
}

export default App;
