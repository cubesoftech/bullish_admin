import {
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import AddAnnouncement from "../Drawer/AddAnouncement";
import { Announcement } from "@prisma/client";
import EditAnnouncement from "../Drawer/EditAnnouncement";
import useSwr from "swr";
import axios from "axios";
import { useSWRConfig } from "swr";

function AnnouncementTable() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { mutate } = useSWRConfig();

  const {
    isOpen: editIsOpen,
    onClose: editOnClose,
    onOpen: editOnOpen,
  } = useDisclosure();

  const deleteAnnouncement = async (id: string) => {
    const url = "/api/deleteAnnouncement";
    const data = {
      id,
    };
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    mutate("/api/getAllAnnouncement");
  };

  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);

  useSwr(
    "/api/getAllAnnouncement",
    async (url) => {
      const res = await axios.get<{ announcement: Announcement[] }>(url);
      return res.data;
    },
    {
      onSuccess(data, key, config) {
        setAnnouncements(data.announcement);
      },
    }
  );

  return (
    <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
      <Table size={"sm"} variant={"striped"} colorScheme="cyan">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Title</Th>
            <Th>Date Created</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {announcements.map((announcement, index) => {
            const date = new Date(announcement.createdAt);
            return (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{announcement.title}</Td>
                <Td>
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </Td>
                <Td>
                  <EditAnnouncement
                    isOpen={editIsOpen}
                    onClose={editOnClose}
                    announcement={announcement}
                  />
                  <HStack>
                    <Button colorScheme="blue" onClick={editOnOpen}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <AddAnnouncement isOpen={isOpen} onClose={onClose} />
      <HStack justifyContent={"flex-end"} w={"100%"}>
        <Button onClick={onOpen} colorScheme="purple">
          Add Announcement
        </Button>
      </HStack>
    </VStack>
  );
}

export default AnnouncementTable;
