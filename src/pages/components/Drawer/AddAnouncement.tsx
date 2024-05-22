import {
  Button,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  VStack,
  Text,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { AnnouncementInterface } from "@/utils/interface";
import { useSWRConfig } from "swr";

function AddAnnouncement({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const editorRef = React.useRef<any>(null);
  const [payload, setPayload] = React.useState<AnnouncementInterface>({
    content: "",
    dateCreated: new Date(),
    title: "",
  });
  const toast = useToast();

  const { mutate } = useSWRConfig();

  const handleSave = async () => {
    //if content is empty and title is empty
    if (payload.content === "" && payload.title === "") {
      toast({
        title: "Title and content cannot be empty.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const url = "/api/createAnnouncement";
    const data = {
      title: payload.title,
      content: payload.content,
      dateCreated: payload.dateCreated,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: "Announcement created.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
        mutate("/api/getAllAnnouncement");
      })
      .catch((error) => {
        toast({
          title: "An error occurred.",
          description: error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        onClose();
        mutate("/api/getAllAnnouncement");
      });
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Add Announcement</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>Title</Text>
            <Input
              value={payload.title}
              placeholder="Title"
              onChange={(e) =>
                setPayload({ ...payload, title: e.target.value })
              }
            />
          </VStack>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>Content</Text>
            <Textarea
              onChange={(e) => {
                setPayload({ ...payload, content: e.target.value });
              }}
              height={600}
            />
            {/* <Editor
              apiKey="kqfwcl6lfz745rmfuf2022x9kwpwwyll2a3wc1pjjfqrfc8w"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              onChange={(_evt, editor) => {
                setPayload({ ...payload, content: editor.getContent() });
              }}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            /> */}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} colorScheme="blue">
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddAnnouncement;
