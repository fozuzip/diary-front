import { useMemo } from "react";
import { Paper, Stack, Group, Text, Box, useMantineTheme } from "@mantine/core";
import { getHeatColor } from "../utils/colors";

function Legend({ min, max, gradient }) {
  const { colorScheme, colors } = useMantineTheme();

  const getColor = getHeatColor(gradient, min, max);

  const temperatureRange = useMemo(
    () =>
      [
        (min + (max - min) * 0.0).toFixed(1),
        (min + (max - min) * 0.17).toFixed(1),
        (min + (max - min) * 0.34).toFixed(1),
        (min + (max - min) * 0.51).toFixed(1),
        (min + (max - min) * 0.68).toFixed(1),
        (min + (max - min) * 0.85).toFixed(1),
        (min + (max - min) * 1).toFixed(1),
      ].reverse(),
    [min, max]
  );

  return (
    <Paper
      radius="sm"
      p="sm"
      sx={(theme) => ({
        position: "absolute",
        zIndex: 10,
        bottom: 0,
        left: 0,
        marginLeft: theme.spacing.md,
        marginBottom: theme.spacing.md,
      })}
    >
      <Stack spacing={0}>
        {temperatureRange.map((temp, i) => (
          <Group spacing="md" key={temp}>
            <Box
              style={{
                background: getColor(temp),
                width: "16px",
                height: "32px",
                borderTopLeftRadius: i === 0 ? "5px" : null,
                borderTopRightRadius: i === 0 ? "5px" : null,
                borderBottomLeftRadius:
                  i === temperatureRange.length - 1 ? "5px" : null,
                borderBottomRightRadius:
                  i === temperatureRange.length - 1 ? "5px" : null,
              }}
            />
            <Text fz="xs">{temp} °C</Text>
          </Group>
        ))}
        <Group spacing="md" pt="sm">
          <Box
            style={{
              background: colorScheme === "light" ? "#ffffff" : "#090909",
              width: "16px",
              height: "24px",
              border:
                colorScheme === "light"
                  ? `1px solid ${colors.dark[2]}`
                  : "none",
              borderRadius: "5px",
            }}
          />
          <Text fz="xs">N/A</Text>
        </Group>
      </Stack>
    </Paper>
  );
}

export default Legend;
