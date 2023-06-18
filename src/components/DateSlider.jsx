import moment from "moment";
import { useMemo } from "react";
import { Text, Slider } from "@mantine/core";

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

  return (
    <>
      <Text>{displayDate}</Text>
      <Slider
        value={sliderValue}
        onChange={updateDate}
        min={0}
        max={sliderMax}
        sx={{ flexGrow: 1 }}
        size="lg"
        thumbSize={14}
        label={null}
      />
    </>
  );
}

export default DateSlider;
