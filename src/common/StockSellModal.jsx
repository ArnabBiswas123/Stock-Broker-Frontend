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
 
  const [errors, setErrors] = useState({
    quantity: "",
 
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
        
        const formattedBalance=parseFloat(stockdata.price.lastPrice).toFixed(2)
        setLastprice(formattedBalance);
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
        newErrors.quantity = `Quantity should be maximum ${maxquantity}`;
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
