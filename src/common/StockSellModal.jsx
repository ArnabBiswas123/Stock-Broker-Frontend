import React, { useEffect } from "react";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StockSellModal({ ticker,maxquantity,   FetchAgain,isOpen, onClose }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [lastprice, setLastprice] = useState();
  const toast = useToast();
  const [quantity, setquantity] = useState(0);
  const [method, setMethod] = useState("upi");
  const [account, setAccount] = useState("");
  const [errors, setErrors] = useState({
    quantity: "",
    account: "",
  });

  const fetchStock = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const data = await fetch(
        `http://localhost:5000/api/v1/stock/laststockprice/?q=${ticker}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === 401) {
        localStorage.removeItem("token");
        return navigate("/");
      }
      const stockdata = await data.json();
      if (stockdata.success === true) {
        setIsLoading(false);
        // console.log(stockdata.price)
        setLastprice(stockdata.price.lastPrice);
        // setStocksSummery(stockdata.otherData);
      } else {
        if (
          stockdata.msg ===
          "You have run over your hourly request allocation. Try after some time"
        ) {
          setIsLoading(false);
          toast({
            title:
              "You have run over your hourly request allocation. Try after some time",

            position: "top",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleSubmit = async () => {
    try {
      let newErrors = {};

      if (quantity === "" || quantity <= 0) {
        newErrors.quantity = "Quantity should be greater than 0";
      }

      if(quantity>maxquantity){
        newErrors.quantity = `Quantity should be less than ${maxquantity}`;
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
          "http://localhost:5000/api/v1/user/stocksell",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ticker:ticker,
              quantity: parseInt(quantity),
              price:parseFloat(lastprice),
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
            title: "Stock purchased successfully.",
            position: "top",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setAccount("");
          setquantity("");
          FetchAgain();
          onClose();

          return;
        } else {
          toast({
            title: result.msg,
            position: "top",
            status: "error",
            duration: 3000,
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
        {isLoading ? (
          <Center width={"100%"}>
            <Spinner size="xl" color="black" />
          </Center>
        ) : (
          <>
            <Center
              as="h2"
              fontFamily="Georgia, serif"
              fontSize={20}
              fontWeight="bold"
              color={"#4169E1"}
              textAlign={"center"}
            >
              Sell Stock
            </Center>

            <ModalCloseButton />
            <ModalBody display={"flex"} flexDir={"column"} gap={4}>
              <Text
                fontWeight={"bold"}
                fontFamily="Times New Roman"
              >{`Current Stock Price ${lastprice}`}</Text>
              <FormControl isInvalid={errors.quantity}>
                <FormLabel fontWeight={"bold"} fontFamily="Georgia, serif">
                  Quantity
                </FormLabel>
                <NumberInput
                  min={0}
                //   max={maxquantity}
                  allowMouseWheel
                  value={quantity}
                  onChange={(valueString) => {
                    setquantity(valueString);
                    setErrors({ ...errors, quantity: "" });
                  }}
                >
                  <NumberInputField  fontFamily="Georgia, serif" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
           
                {errors.quantity ? (
                  <FormErrorMessage fontFamily="Georgia, serif">
                    {errors.quantity}
                  </FormErrorMessage>
                ) : (
                  ""
                )}
              </FormControl>
              <Text fontWeight={"bold"} fontFamily="Times New Roman">
                Total Amaount Gain : {lastprice * quantity}
              </Text>
              <FormControl as="fieldset">
                <FormLabel
                  as="legend"
                  fontWeight={"bold"}
                  fontFamily="Georgia, serif"
                >
                  Method
                </FormLabel>
                <RadioGroup
                  value={method}
                  onChange={setMethod}
                  defaultValue="upi"
                >
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
                  colorScheme="green"
                  onClick={handleSubmit}
                >
                  Sell Stock
                </Button>
              </Center>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
