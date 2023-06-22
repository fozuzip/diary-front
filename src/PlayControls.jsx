import { Flex, Paper, Group } from "@mantine/core";
import PlayButton from "./components/PlayButton";
import DateSlider from "./components/DateSlider";

function PlayControls({
  selectedDate,
  dates,
  onChange,
  isPlaying,
  handleAnimationButtonClick,
}) {
  return (
    <Flex
      justify="center"
      sx={(theme) => ({
        paddingBottom: theme.spacing.md,
      })}
    >
      <Paper shadow="sm" radius="xl" p="md" w={800}>
        <Group align="center">
          <PlayButton
            isPlaying={isPlaying}
            selectedDate={selectedDate}
            dates={dates}
            handleAnimationButtonClick={handleAnimationButtonClick}
          />
          <DateSlider
            selectedDate={selectedDate}
            dates={dates}
            onChange={onChange}
          />
        </Group>
      </Paper>
    </Flex>
  );
}

export default PlayControls;
