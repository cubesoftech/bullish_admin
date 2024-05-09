import { OrderHistoryColumn } from "@/utils/interface";
import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  List,
  ListIcon,
  ListItem,
  VStack,
  Divider,
  InputGroup,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { use, useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Editor } from "@tinymce/tinymce-react";
import { AnnouncementInterface } from "@/utils/interface";
import { Announcement } from "@prisma/client";

function EditAnnouncement({
  isOpen,
  onClose,
  announcement,
}: {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement;
}) {
  const { content, createdAt, id, title } = announcement;
  const editorRef = React.useRef<any>(null);
  const toast = useToast();

  const handleEdit = async () => {
    const url = "/api/editAnnouncement";
    const data = {
      title: title,
      content: editorRef.current.getContent(),
      id: id,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.message) {
      toast({
        title: result.message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Modify Announcement</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>Title</Text>
            <Input value={title} placeholder="Title" />
          </VStack>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>Content</Text>
            <Editor
              apiKey="kqfwcl6lfz745rmfuf2022x9kwpwwyll2a3wc1pjjfqrfc8w"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={content}
              onChange={(_evt, editor) => {
                // setPayload({ ...payload, content: editor.getContent() });
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
            />
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleEdit} colorScheme="blue">
            Save Modification
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditAnnouncement;
