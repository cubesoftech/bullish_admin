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
import { Editor } from "@tinymce/tinymce-react";
import api from "@/utils/interfaceV2/api";

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
    try {
      await api.createAnnouncement({ ...payload })
      toast({
        title: "Announcement created.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      mutate("getAnnouncement");
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error as string,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      mutate("getAnnouncement");
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>공지사항추가</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>제목</Text>
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
            <Text>내용</Text>
            {/* <Textarea
              onChange={(e) => {
                setPayload({ ...payload, content: e.target.value });
              }}
              height={600}
            /> */}
            <Editor
              tinymceScriptSrc={'./tinymce/tinymce.min.js'}
              apiKey="kqfwcl6lfz745rmfuf2022x9kwpwwyll2a3wc1pjjfqrfc8w"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              onChange={(_evt, editor) => {
                setPayload({ ...payload, content: editor.getContent() });
              }}
              init={{
                height: 500,
                width: "100%",
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
            취소
          </Button>
          <Button onClick={handleSave} colorScheme="blue">
            저장
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddAnnouncement;
