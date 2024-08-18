import {
  Box,
  Image,
  Text,
  useToast,
  Spinner,
  Center,
  Button,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TabNavigation from "../common/TabNavigation";
import { useDisclosure } from "@chakra-ui/react";
import StockBuyModal from "../common/StockBuyModal";

export default function StockPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [stocksData, setStocksData] = useState();
  const [stocksSummery, setStocksSummery] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addTowishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const wishlist = await fetch(
        `http://localhost:5000/api/v1/user/addwishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticker: ticker,
          }),
        }
      );

      if (wishlist.status === 401) {
        localStorage.removeItem("token");
        return navigate("/");
      }
      const wishdata = await wishlist.json();
      if (wishdata.success === true) {
        toast({
          title: "Company added to wishlist",
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        if (wishdata.msg === "Stock already in wishlist") {
          toast({
            title: "Stock is already in the wishlist",
            position: "top",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStock = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const data = await fetch(
        `http://localhost:5000/api/v1/stock/stockdetails/?q=${ticker}`,
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
        setStocksData(stockdata.data);
        setStocksSummery(stockdata.otherData);
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
        else{
          if(stockdata.msg==="company does not exists"){
            setIsLoading(false);
            toast({
              title:
                "Company does not exists",
  
              position: "top",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            navigate('/dashboard')
            return;
          }
          else{
            setIsLoading(false);
            console.log(stockdata.msg)
              navigate('/dashboard')
            return
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [ticker]);
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      marginTop={"2%"}
      flexDir={"column"}
      alignItems={"center"}
    >
      <Box
        width={["95%", "90%", "60%", "60%"]}
        display={"flex"}
        justifyContent={"space-between"}
      >
        {isLoading ? (
          <Center width={"100%"} height={"100vh"}>
            <Spinner size="xl" color="white" />
          </Center>
        ) : (
          <>
            {stocksData ? (
              <Box
                display={"flex"}
                justifyContent={"center"}
                flexDir={"column"}
                width={"50%"}
              >
                <Text
                  color={"white"}
                  fontFamily={"Times New Roman"}
                  fontSize={["sm", "md", "xl", "2xl"]}
                  fontWeight={"bold"}
                >
                  {stocksData.name}
                </Text>
                <Text
                  fontFamily={"Times New Roman"}
                  fontSize={["xs", "sm", "md", "lg"]}
                  fontWeight={"bold"}
                  color={"white"}
                >
                  {stocksData.ticker}
                </Text>
                <Text
                  fontFamily={"Times New Roman"}
                  fontSize={["xs", "sm", "md", "lg"]}
                  fontWeight={"bold"}
                  color={"white"}
                >
                  {stocksData.exchangeCode}
                </Text>
                <Box
                  display={"flex"}
                  marginLeft={1}
                  gap={2}
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                >
                  <Button
                    fontWeight={"bold"}
                    fontFamily={"Times New Roman"}
                    size={["xs", "xs", "sm", "sm"]}
                    onClick={onOpen}
                  >
                    BUY
                  </Button>
                  <Image
                    height={6}
                    width={6}
                    src="/assets/star.svg"
                    onClick={addTowishlist}
                    cursor={"pointer"}
                  ></Image>
                </Box>
              </Box>
            ) : (
              ""
            )}
            {stocksSummery ? (
              <Box display={"flex"} alignItems={"flex-end"} flexDir={"column"}>
                <Text
                  color={"white"}
                  fontFamily={"Times New Roman"}
                  textAlign={"right"}
                  fontSize={["sm", "md", "xl", "2xl"]}
                  fontWeight={"bold"}
                >
                  {stocksSummery.lastPrice}
                </Text>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  textAlign={"right"}
                  alignItems={"center"}
                >
                  {stocksSummery.change > 0 ? (
                    <Image
                      height={8}
                      width={8}
                      src="/assets/upIcon.svg"
                    ></Image>
                  ) : (
                    <Image
                      height={8}
                      width={8}
                      src="/assets/downIcon.svg"
                    ></Image>
                  )}

                  <Text
                    fontFamily={"Times New Roman"}
                    textAlign={"right"}
                    fontSize={["xs", "sm", "md", "lg"]}
                    fontWeight={"bold"}
                    color={"white"}
                  >
                    {`${stocksSummery.change}  (${stocksSummery.changePercent}%)`}
                  </Text>
                </Box>
                <Text
                  fontFamily={"Times New Roman"}
                  fontSize={["xs", "sm", "md", "lg"]}
                  fontWeight={"bold"}
                  color={"white"}
                  textAlign={"right"}
                >
                  {stocksSummery.currentTimeStamp}
                </Text>
              </Box>
            ) : (
              ""
            )}
          </>
        )}
      </Box>
    
{isLoading?'':<>
  {stocksSummery ? (
        <Box
          marginTop={"4%"}
          paddingLeft={"1.5%"}
          display={"flex"}
          justifyContent={"center"}
        >
          {!stocksSummery.marketStatus ? (
            <Text
              color={"white"}
              fontSize={["sm", "md", "lg", "xl"]}
              textAlign={"center"}
              fontWeight={"bold"}
              fontFamily={"Times New Roman"}
            >
              Market is Open
            </Text>
          ) : (
            <Text
              color={"white"}
              fontWeight={"bold"}
              fontFamily={"Times New Roman"}
            >{`Market Closed on ${stocksSummery.timestamp}`}</Text>
          )}
        </Box>
      ) : (
        ""
      )}
       {stocksSummery ? (
        <TabNavigation
          summeryData={stocksData}
          data={stocksSummery}
        ></TabNavigation>
      ) : (
        ""
      )}
</>}

     
      {isOpen ? (
        <StockBuyModal ticker={ticker} isOpen={isOpen} onClose={onClose}></StockBuyModal>
      ) : (
        ""
      )}
    </Box>
  );
}
