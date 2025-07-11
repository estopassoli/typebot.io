import { BuoyIcon, ExpandIcon, MinimizeIcon } from "@/components/icons";
import { getHelpDocUrl } from "@/features/graph/helpers/getHelpDocUrl";
import { VideoOnboardingPopover } from "@/features/onboarding/components/VideoOnboardingPopover";
import {
  Button,
  HStack,
  IconButton,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslate } from "@tolgee/react";
import type { BlockWithOptions } from "@typebot.io/blocks-core/schemas/schema";
import type { TEventWithOptions } from "@typebot.io/events/schemas";
import type { forgedBlocks } from "@typebot.io/forge-repository/definitions";

type Props = {
  nodeType: BlockWithOptions["type"] | TEventWithOptions["type"];
  blockDef?: (typeof forgedBlocks)[keyof typeof forgedBlocks];
  isVideoOnboardingItemDisplayed: boolean;
  isExpanded: boolean;
  onExpandClick: () => void;
  onVideoOnboardingClick: () => void;
};

export const SettingsHoverBar = ({
  nodeType,
  blockDef,
  isVideoOnboardingItemDisplayed,
  isExpanded,
  onExpandClick,
  onVideoOnboardingClick,
}: Props) => {
  const { t } = useTranslate();
  const helpDocUrl = getHelpDocUrl(nodeType, blockDef);
  return (
    <HStack
      rounded="md"
      spacing={0}
      borderWidth="1px"
      bgColor={useColorModeValue("white", "gray.900")}
      shadow="md"
    >
      <IconButton
        icon={isExpanded ? <MinimizeIcon /> : <ExpandIcon />}
        borderRightWidth="1px"
        borderRightRadius="none"
        borderLeftRadius="none"
        aria-label={"Duplicate group"}
        variant="ghost"
        onClick={onExpandClick}
        size="xs"
      />
      {helpDocUrl && (
        <Button
          as={Link}
          leftIcon={<BuoyIcon />}
          borderLeftRadius="none"
          borderRightRadius={
            isVideoOnboardingItemDisplayed ? "none" : undefined
          }
          borderRightWidth={isVideoOnboardingItemDisplayed ? "1px" : undefined}
          size="xs"
          variant="ghost"
          href={helpDocUrl}
          isExternal
        >
          {t("help")}
        </Button>
      )}
      {isVideoOnboardingItemDisplayed && (
        <VideoOnboardingPopover.TriggerIconButton
          onClick={onVideoOnboardingClick}
          size="xs"
          borderLeftRadius="none"
        />
      )}
    </HStack>
  );
};
