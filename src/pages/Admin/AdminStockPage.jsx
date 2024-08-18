import {
    Box,
    Image,
    Text,
    useToast,
    Spinner,
    Center,
  
  } from "@chakra-ui/react";
  import React, { useState, useEffect } from "react";
  import { useParams, useNavigate } from "react-router-dom";


  
  export default function AdminStockPage() {
    const { ticker } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [stocksData, setStocksData] = useState();
    const [stocksSummery, setStocksSummery] = useState();
    const [isLoading, setIsLoading] = useState(true);
    
  
  
  
    const fetchStock = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("admintoken");
        if (!token) {
          return navigate("/admin/login");
        }
        const data = await fetch(
          `http://localhost:5000/api/v1/admin/stockdetails/?q=${ticker}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (data.status === 401) {
          localStorage.removeItem("admintoken");
          return navigate("/admin/login");
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
              navigate('/admin/logs')
              return;
            }
            else{
              setIsLoading(false);
              console.log(stockdata.msg)
              navigate('/admin/logs')
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
      
      </Box>
    );
  }
  