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
  const [content_, setContent] = React.useState<string>(content);
  const toast = useToast();

  const handleEdit = async () => {
    const url = "/api/editAnnouncement";
    const data = {
      title: title,
      content: content_,
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
        <DrawerHeader>수정</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>제목</Text>
            <Input value={title} placeholder="Title" />
          </VStack>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>내용</Text>
            <Textarea
              onChange={(e) => {
                setContent(e.target.value);
              }}
              height={600}
              value={content_}
            />
            {/* <Editor
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
            /> */}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleEdit} colorScheme="blue">
            변경사항 저장
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditAnnouncement;
