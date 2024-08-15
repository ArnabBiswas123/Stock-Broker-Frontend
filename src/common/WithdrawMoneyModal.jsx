import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Center,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  HStack,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function WithdrawMoneyModal({ FetchAgain, isOpen, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [account, setAccount] = useState("");
  const [errors, setErrors] = useState({
    amount: "",
    account: "",
  });

  const handleSubmit = async () => {
    try {
      let newErrors = {};

      if (amount === "" || amount <= 0) {
        newErrors.amount = "Amount should be greater than 0";
      }
      if (method === "upi") {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
        if (!upiRegex.test(account)) {
          newErrors.account = "Invalid UPI ID";
        }
      } else if (method === "card") {
        const cardRegex =
          /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
        if (!cardRegex.test(account.replace(/[\s-]/g, ""))) {
          newErrors.account = "Invalid Credit Card Number";
        }
      }
      setErrors(newErrors);
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      if (Object.keys(newErrors).length === 0) {
        const response = await fetch(
          "http://localhost:5000/api/v1/user/withdrawmoney",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: parseFloat(amount),
              account: account,
              method: method,
            }),
          }
        );
        if (response.status === 401) {
          localStorage.removeItem("token");
          return navigate("/");
        }
        const result = await response.json();

        if (result.success) {
          toast({
            title: "Amount withdrawn",
            position: "top",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setAccount("");
          setAmount("");
          onClose();
          FetchAgain();
          return;
        } else {
          toast({
            title: result.msg,
            position: "top",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent py={4}>
        <Center
          as="h2"
          fontFamily="Georgia, serif"
          fontSize={20}
          fontWeight="bold"
          color={"#4169E1"}
          textAlign={"center"}
        >
          Withdraw Money
        </Center>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDir={"column"} gap={4}>
          <FormControl isInvalid={errors.amount}>
            <FormLabel fontWeight={"bold"} fontFamily="Georgia, serif">
              Amount
            </FormLabel>
            <Input
              placeholder="Add Amount"
              fontFamily="Georgia, serif"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors({ ...errors, amount: "" });
              }}
            />
            {errors.amount ? (
              <FormErrorMessage fontFamily="Georgia, serif">
                {errors.amount}
              </FormErrorMessage>
            ) : (
              ""
            )}
          </FormControl>
          <FormControl as="fieldset">
            <FormLabel
              as="legend"
              fontWeight={"bold"}
              fontFamily="Georgia, serif"
            >
              Method
            </FormLabel>
            <RadioGroup value={method} onChange={setMethod} defaultValue="upi">
              <HStack fontFamily="Georgia, serif">
                <Radio value="upi">UPI</Radio>
                <Radio value="card">CARD</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl isInvalid={errors.account}>
            <FormLabel fontWeight={"bold"} fontFamily="Georgia, serif">
              Account Number
            </FormLabel>
            <Input
              placeholder="Add account number"
              fontFamily="Georgia, serif"
              type="text"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                setErrors({ ...errors, account: "" });
              }}
            />
            {errors.account ? (
              <FormErrorMessage fontFamily="Georgia, serif">
                {errors.account}
              </FormErrorMessage>
            ) : (
              ""
            )}
          </FormControl>
          <Center>
            <Button
              fontFamily="Georgia, serif"
              colorScheme="red"
              onClick={handleSubmit}
            >
            Withdraw Amount
            </Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
