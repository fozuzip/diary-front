import moment from "moment";
import { useMemo } from "react";
import { Slider, Text } from "@mantine/core";

function DateSlider({ selectedDate, dates, onChange }) {
  const displayDate = useMemo(
    () => (selectedDate ? moment(selectedDate).format("MMM YYYY") : "-"),
    [selectedDate]
  );
  const sliderValue = useMemo(
    () => (selectedDate ? dates.indexOf(selectedDate) : 0),
    [selectedDate, dates]
  );

  const sliderMax = useMemo(
    () => (selectedDate ? dates.length - 1 : 10),
    [selectedDate, dates]
  );

  const updateDate = (value) => {
    onChange(dates[value]);
  };

  const minDate = useMemo(
    () => (dates && dates.length > 0 ? dates[0] : ""),
    [dates]
  );
  const maxDate = useMemo(
    () => (dates && dates.length > 1 ? dates[dates.length - 1] : ""),
    [dates]
  );
  return (
    <>
      <Text fz="xs">{minDate}</Text>
      <Slider
        color="red"
        value={sliderValue}
        onChange={updateDate}
        min={0}
        max={sliderMax}
        size="lg"
        thumbSize={14}
        label={null}
        sx={({ spacing }) => ({
          flexGrow: 1,
          marginLeft: spacing.xs,
          marginRight: spacing.xs,
        })}
        styles={({ fontSizes }) => ({ markLabel: { fontSize: fontSizes.xs } })}
      />
      <Text fz="xs">{maxDate}</Text>
    </>
  );
}

export default DateSlider;
