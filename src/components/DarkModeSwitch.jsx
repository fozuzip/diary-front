import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";

function DarkModeSwitch() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
      {colorScheme === "dark" ? (
        <IconSun size="1rem" />
      ) : (
        <IconMoonStars size="1rem" />
      )}
    </ActionIcon>
  );
}
export default DarkModeSwitch;
