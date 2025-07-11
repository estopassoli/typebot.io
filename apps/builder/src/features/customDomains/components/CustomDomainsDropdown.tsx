import { ChevronLeftIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import { trpc } from "@/lib/queryClient";
import { toast } from "@/lib/toast";
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  type MenuButtonProps,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useState } from "react";
import { CreateCustomDomainModal } from "./CreateCustomDomainModal";

type Props = Omit<MenuButtonProps, "type"> & {
  currentCustomDomain?: string;
  onCustomDomainSelect: (domain: string) => void;
};

export const CustomDomainsDropdown = ({
  currentCustomDomain,
  onCustomDomainSelect,
  ...props
}: Props) => {
  const { t } = useTranslate();
  const [isDeleting, setIsDeleting] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { workspace, currentUserMode } = useWorkspace();
  const { data, refetch } = useQuery(
    trpc.customDomains.listCustomDomains.queryOptions(
      {
        workspaceId: workspace?.id as string,
      },
      {
        enabled: !!workspace?.id && currentUserMode !== "guest",
      },
    ),
  );
  const { mutate } = useMutation(
    trpc.customDomains.deleteCustomDomain.mutationOptions({
      onMutate: ({ name }) => {
        setIsDeleting(name);
      },
      onError: (error) => {
        toast({
          context: "Error while deleting custom domain",
          description: error.message,
        });
      },
      onSettled: () => {
        setIsDeleting("");
      },
      onSuccess: () => {
        refetch();
      },
    }),
  );

  const handleMenuItemClick = (customDomain: string) => () =>
    onCustomDomainSelect(customDomain);

  const handleDeleteDomainClick =
    (domainName: string) => async (e: React.MouseEvent) => {
      if (!workspace) return;
      e.stopPropagation();
      mutate({
        name: domainName,
        workspaceId: workspace.id,
      });
    };

  const handleNewDomain = (name: string) => {
    onCustomDomainSelect(name);
  };

  return (
    <Menu isLazy placement="bottom-start">
      {workspace?.id && (
        <CreateCustomDomainModal
          workspaceId={workspace.id}
          isOpen={isOpen}
          onClose={onClose}
          onNewDomain={handleNewDomain}
        />
      )}
      <MenuButton
        as={Button}
        rightIcon={<ChevronLeftIcon transform={"rotate(-90deg)"} />}
        colorScheme="gray"
        justifyContent="space-between"
        textAlign="left"
        {...props}
      >
        <Text noOfLines={1} overflowY="visible" h="20px">
          {currentCustomDomain ?? t("customDomain.add")}
        </Text>
      </MenuButton>
      <MenuList maxW="500px" shadow="md">
        <Stack maxH={"35vh"} overflowY="auto" spacing="0">
          {(data?.customDomains ?? []).map((customDomain) => (
            <Button
              role="menuitem"
              minH="40px"
              key={customDomain.name}
              onClick={handleMenuItemClick(customDomain.name)}
              fontSize="16px"
              fontWeight="normal"
              rounded="none"
              colorScheme="gray"
              variant="ghost"
              justifyContent="space-between"
            >
              {customDomain.name}
              <IconButton
                as="span"
                icon={<TrashIcon />}
                aria-label={t("customDomain.remove")}
                size="xs"
                onClick={handleDeleteDomainClick(customDomain.name)}
                isLoading={isDeleting === customDomain.name}
              />
            </Button>
          ))}
          <MenuItem
            maxW="500px"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            icon={<PlusIcon />}
            onClick={onOpen}
          >
            {t("connectNew")}
          </MenuItem>
        </Stack>
      </MenuList>
    </Menu>
  );
};
