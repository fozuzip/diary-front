import moment from "moment";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Text, Select, Flex, Box, Title } from "@mantine/core";
import { MonthPickerInput, YearPickerInput } from "@mantine/dates";

import Logo from "./components/Logo";
import DarkModeSwitch from "./components/DarkModeSwitch";

import { getMeasurements, getEarliest, getLatest } from "./utils/api";

function Header({
  measurement,
  onMeasurementChange,
  dateRange,
  onDateRangeChange,
  selectedDate,
}) {
  const [measurements, setMeasurements] = useState([]);
  const [availableDateRange, setAvailableDateRange] = useState({
    from: null,
    to: null,
  });

  const interval = useMemo(
    () =>
      measurement &&
      measurementOptions.find((option) => option.value === measurement)
        .interval,
    [measurement]
  );
  const DatePickerComponent = useMemo(() => {
    switch (interval) {
      case "monthly":
        return MonthPickerInput;
      default:
        return YearPickerInput;
    }
  }, [interval]);

  const displayDate = useMemo(() => {
    if (!selectedDate) {
      return "";
    } else {
      return moment(selectedDate).format(
        interval === "monthly" ? "MMMM YYYY" : "YYYY"
      );
    }
  }, [interval, selectedDate]);

  const fetchMeasurements = useCallback(async () => {
    const data = await getMeasurements();
    const options = measurementOptions.filter((option) =>
      data.includes(option.value)
    );
    setMeasurements(options);
    const defaultMeasurement = options.find((m) => m.default);
    onMeasurementChange(
      defaultMeasurement ? defaultMeasurement.value : options[0].value
    );
  }, []);

  const fetchAvailableDateRange = useCallback(async () => {
    const [fromTimestamp, toTimestamp] = await Promise.all([
      getEarliest(),
      getLatest(),
    ]);
    const from = moment(fromTimestamp).format("YYYY-MM-DD");
    const to = moment(toTimestamp).format("YYYY-MM-DD");
    setAvailableDateRange({ from, to });
    onDateRangeChange({ from, to });
  }, []);

  useEffect(() => {
    fetchMeasurements();
    fetchAvailableDateRange();
  }, []);

  return (
    <Flex
      justify="space-between"
      sx={(theme) => ({
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingTop: theme.spacing.md,
      })}
    >
      <Logo />
      <div>
        <Flex gap="md" align="center">
          <Text>Showing</Text>
          <Select
            w={280}
            placeholder="Measurement"
            data={measurements}
            value={measurement}
            onChange={onMeasurementChange}
          />
          <Text>From</Text>
          <DatePickerComponent
            w={200}
            placeholder="Starting Date"
            value={new Date(dateRange.from)}
            onChange={(value) =>
              console.log(value) ||
              onDateRangeChange((dates) => ({
                ...dates,
                from: moment(value).format("YYYY-MM-DD"),
              }))
            }
            minDate={new Date(availableDateRange.from)}
            maxDate={new Date(availableDateRange.to)}
          />
          <Text>To: </Text>
          <DatePickerComponent
            w={200}
            placeholder="End Date"
            value={new Date(dateRange.to)}
            onChange={(value) =>
              onDateRangeChange((dates) => ({
                ...dates,
                to: moment(value).format("YYYY-MM-DD"),
              }))
            }
            minDate={new Date(availableDateRange.from)}
            maxDate={new Date(availableDateRange.to)}
          />
        </Flex>
        <Flex
          justify="center"
          sx={(theme) => ({ paddingTop: theme.spacing.md })}
        >
          <Title order={2}>{displayDate}</Title>
        </Flex>
      </div>

      <Box>
        <DarkModeSwitch />
      </Box>
    </Flex>
  );
}

const measurementOptions = [
  {
    value: "Average_Temperature_decadal_average",
    label: "Average Temperature by decade",
    interval: "decade",
  },
  {
    value: "Maximum_Temperature_decadal_average",
    label: "Maximum Temperature by decade",
    interval: "decade",
  },
  {
    value: "Minimum_Temperature_decadal_average",
    label: "Minimum Temperature by decade",
    interval: "decade",
  },
  {
    value: "Extreme_Maximum_Temperature_decadal_average",
    label: "Extreme Maximum Temperature by decade",
    interval: "decade",
  },
  {
    value: "Extreme_Minimum_Temperature_decadal_average",
    label: "Extreme Minimum Temperature by decade",
    interval: "decade",
  },
  {
    value: "Average_Temperature_yearly_average",
    label: "Average Temperature by year",
    interval: "year",
    default: true,
  },
  {
    value: "Maximum_Temperature_yearly_average",
    label: "Maximum Temperature by year",
    interval: "year",
  },
  {
    value: "Minimum_Temperature_yearly_average",
    label: "Minimum Temperature by year",
    interval: "year",
  },
  {
    value: "Extreme_Maximum_Temperature_yearly_average",
    label: "Extreme Maximum Temperature by year",
    interval: "year",
  },
  {
    value: "Extreme_Minimum_Temperature_yearly_average",
    label: "Extreme Minimum Temperature by year",
    interval: "year",
  },
  {
    value: "Average_Temperature",
    label: "Average Temperature",
    interval: "year",
  },
];

export default Header;
