import { Drawer, NavLink, Divider, Flex, ActionIcon } from "@mantine/core";
import {
  IconLocationFilled,
  IconMapPinFilled,
  IconChartAreaFilled,
  IconMushroomFilled,
  IconX,
} from "@tabler/icons-react";

import Logo from "./components/Logo";

const links = [
  { label: "Global Map", path: "/", Icon: IconLocationFilled },
  { label: "Countries", path: "/", Icon: IconMapPinFilled },
  { label: "Emmissions", Icon: IconChartAreaFilled },
  { label: "Precipitation", Icon: IconMushroomFilled },
];

function Menu({ opened, close }) {
  return (
    <Drawer
      opened={opened}
      onClose={close}
      withCloseButton={false}
      styles={{ inner: { zIndex: 300 }, overlay: { zIndex: 300 } }}
      size="xs"
    >
      <Flex justify="space-between" align={"center"}>
        <Logo onClick={close} />
        <ActionIcon onClick={close} size={36}>
          <IconX size="1rem" />
        </ActionIcon>
      </Flex>

      <Divider my="sm" />
      <div sx={{ marginTop: "24px" }}>
        {links.map(({ label, path, Icon }) => (
          <NavLink
            disabled={!path}
            label={label}
            icon={<Icon size="1rem" stroke={1.5} />}
            p="lg"
            fontSize="xl"
          />
        ))}
      </div>
    </Drawer>
  );
}
export default Menu;
