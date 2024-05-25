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
import { InquiryPayload, InquryColumn } from "@/utils/interface";
import axios from "axios";

function EditInqury({
  isOpen,
  onClose,
  inqury,
}: {
  isOpen: boolean;
  onClose: () => void;
  inqury: InquryColumn;
}) {
  const {
    content,
    createdAt,
    id,
    title,
    alreadyAnswered,
    answer,
    email,
    memberId,
    updatedAt,
  } = inqury;
  const editorRef = React.useRef<any>(null);
  const toast = useToast();

  const [payload, setPayload] = React.useState<InquiryPayload>({
    answer,
    id: id,
  });
  const handleEdit = async () => {
    const url = "/api/editInquiry";
    try {
      await axios.post(url, payload);
      toast({
        title: "Inquiry Updated",
        description: "Inquiry has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error has occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>답변</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>제목</Text>
            <Input isReadOnly value={title} placeholder="Title" />
          </VStack>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>내용</Text>
            <Textarea isReadOnly value={content} />
          </VStack>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Text>답변</Text>
            <Textarea
              onChange={(e) =>
                setPayload({ ...payload, answer: e.target.value })
              }
              value={payload.answer}
            />
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button
            isDisabled={payload.answer === ""}
            onClick={handleEdit}
            colorScheme="blue"
          >
            변경사항 저장
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditInqury;
