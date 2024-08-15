import {
  Box,
  Text,

  Spinner,
  Center,
 
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import StockSellModal from "../common/StockSellModal";
export default function PurchasePage() {
  const navigate = useNavigate();
  const [purchaselist, setpurchaselist] = useState([]);
  const [fetchagain, setFetchagain] = useState(false);

  const FetchAgain = () => {
    setFetchagain((prev) => !prev);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const fetchpurchase = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/");
    }
    try {
      const purchase = await fetch(
        "http://localhost:5000/api/v1/user/allpurchases",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (purchase.status === 401) {
        localStorage.removeItem("token");
        return navigate("/");
      }

      const purchasedetails = await purchase.json();
      //   console.log(purchasedetails);
      if (purchasedetails.success === true) {
        setIsLoading(false);
        setpurchaselist(purchasedetails.purchases);
      } else {
        setIsLoading(false);
        console.error("Failed to fetch user details:", purchasedetails.msg);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchpurchase();
  }, [fetchagain]);

  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      marginTop={"5%"}
    >
      {isLoading ? (
        <Center width={"100%"} height={"10vh"}>
          <Spinner size="xl" color="white" />
        </Center>
      ) : (
        <>
          <Box
            width={"90%"}
            display={"flex"}
            justifyContent={"center"}
            flexWrap={"wrap"}
            gap={4}
          >
            {purchaselist.length > 0 ? (
              purchaselist.map((purchase, index) => {
                return (
                  <Box
                    key={index}
                    cursor={"pointer"}
                    width={["90%", "60%", "50%", "30%"]}
                    display={"flex"}
                    borderRadius={"md"}
                    flexDir={"column"}
                    alignItems={"center"}
                    bgColor={"white"}
                    position={"relative"}
                    onClick={() => {
                      navigate(`/stock/${purchase.stock.ticker}`);
                    }}
                  >
                    <Box
                      paddingY={6}
                      display={"flex"}
                      flexDir={"column"}
                      alignItems={"center"}
                    >
                      <Text
                        fontWeight={"bold"}
                        fontFamily={"Times New Roman"}
                        fontSize={["lg", "xl", "2xl"]}
                        textAlign={"center"}
                        color="gray.600"
                      >
                        {purchase.stock.companyName}
                      </Text>
                      <Text
                        color="gray.600"
                        fontFamily={"Times New Roman"}
                        fontSize={"lg"}
                      >
                        {purchase.stock.ticker}
                      </Text>
                      <Text
                        color="gray.600"
                        fontFamily={"Times New Roman"}
                        fontSize={"lg"}
                      >
                        {`Quantity ${purchase.quantity}`}
                      </Text>
                      <Text
                        color="gray.600"
                        fontFamily={"Times New Roman"}
                        fontSize={"lg"}
                      >
                        {`Per Stock price ${purchase.price}`}
                      </Text>
                      <Text
                        color="gray.600"
                        fontFamily={"Times New Roman"}
                        fontSize={"lg"}
                      >
                        {`Date ${new Date(
                          purchase.createdAt
                        ).toLocaleString()}`}
                      </Text>
                      <Button onClick={(e)=>{
                        e.stopPropagation();
                        onOpen();
                      }} colorScheme="red" fontFamily={"Times New Roman"}>
                        Sell Stock
                      </Button>
                    </Box>
                    {isOpen ? (
                      <StockSellModal
                        ticker={purchase.stock.ticker}
                        maxquantity={purchase.quantity}
                        FetchAgain={FetchAgain}
                        isOpen={isOpen}
                        onClose={onClose}
                      ></StockSellModal>
                    ) : (
                      ""
                    )}
                  </Box>
                );
              })
            ) : (
              <Box>
                <Text fontFamily={"Times New Roman"} color={"gray.400"}>
                  No items in your purchaselist
                </Text>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
