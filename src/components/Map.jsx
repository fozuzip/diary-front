import moment from "moment";
import {
  useMantineTheme,
  Box,
  ColorSwatch,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useState, useEffect, useRef, useMemo } from "react";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const initalZoomParams = {
  center: [9.502771447726788, 25.100818733935455],
  zoom: 2.002266295581086,
};

const MIN_TEMP = 0;
const MAX_TEMP = 25;
const getColorForTemperature = (temp) => {
  //Clamp temperature to min max values
  const t = Math.min(Math.max(temp, MIN_TEMP), MAX_TEMP);
  const normalT = (t - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);

  var h = (1.0 - normalT) * 240;
  return "hsl(" + h + ", 100%, 50%)";
};

function MapWrapper({ data, selectedDate }) {
  const { colorScheme, colors } = useMantineTheme();

  const geographyTheme = useMemo(() => {
    if (colorScheme === "light") {
      return {
        fill: colors.gray[3],
        stroke: colors.gray[5],
      };
    } else {
      return {
        fill: colors.dark[5],
        stroke: colors.dark[7],
      };
    }
  }, [colorScheme]);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [zoomParams, setZoomParams] = useState({});
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current.clientHeight);
    setWidth(ref.current.clientWidth);
    setZoomParams(initalZoomParams);
  }, []);

  const mapData = useMemo(() => {
    const mapData = {};
    if (!data) return mapData;

    for (const row of data) {
      if (!mapData[row.country_name]) {
        mapData[row.country_name] = {};
      }
      mapData[row.country_name][moment(row.time).format("YYYY-MM-DD")] =
        row.value;
    }
    return mapData;
  }, [data]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "calc(100% - 10px)",
        position: "relative",
      }}
    >
      <Box
        sx={(theme) => ({
          width: "200px",
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: theme.spacing.md,
          marginLeft: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
        })}
      >
        <Stack spacing="md">
          {[0, 5, 10, 15, 20, 25].map((temp) => (
            <Group spacing="md">
              <ColorSwatch color={getColorForTemperature(temp)} />
              <Text fz="md">{temp} °C </Text>
            </Group>
          ))}
        </Stack>
      </Box>
      <ComposableMap width={width} height={height} projection="geoMercator">
        <ZoomableGroup {...zoomParams}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = geo.properties.name;
                console.log(country);
                const avgTemp = mapData?.[country]?.[selectedDate];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      avgTemp
                        ? getColorForTemperature(avgTemp)
                        : geographyTheme.fill
                    }
                    stroke={
                      avgTemp
                        ? getColorForTemperature(avgTemp)
                        : geographyTheme.stroke
                    }
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                    onClick={(e) => console.log(e)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
export default MapWrapper;
