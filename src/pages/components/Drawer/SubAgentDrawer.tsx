import { Agent } from "@/utils/interface";
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  DrawerFooter,
  Button,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
} from "@chakra-ui/react";

function SubAgentDrawer({
  isOpen,
  onClose,
  agent,
}: {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent[];
}) {
  return (
    <Drawer isOpen={isOpen} placement="bottom" size={"xs"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Agents</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Table size={"sm"} variant={"striped"} colorScheme="cyan">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>Referral Code</Th>
                  <Th>Email</Th>
                  <Th>Password</Th>
                  <Th>Royalty</Th>
                  <Th>Total User Invited</Th>
                </Tr>
              </Thead>
              <Tbody>
                {agent.map((agent, index) => {
                  return (
                    <Tr key={agent.id}>
                      <Td>{index + 1}</Td>
                      <Td>{agent.member.name}</Td>
                      <Td>{agent.referralCode}</Td>
                      <Td>{agent.member.email}</Td>
                      <Td>{agent.member.password}</Td>
                      <Td>{agent.royalty} %</Td>
                      <Td>{agent.referredmembers.length}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default SubAgentDrawer;
