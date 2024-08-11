import { Box, Image, useToast, Text, Center, Spinner } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
export default function News() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [newsData, setNewsData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const fetchStock = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const data = await fetch(
        `http://localhost:5000/api/v1/stock/stocknews/?q=${ticker}`,
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
        setNewsData(stockdata.data);
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
  }, [ticker]);

  return (
    <Box
      display={"flex"}
      width={"100%"}
      flexWrap={"wrap"}
      gap={[1, 2, 3, 4]}
      justifyContent={"center"}
    >
      {isLoading ? (
        <Center width={"100%"} height={"10vh"}>
          <Spinner size="xl" color="white" />
        </Center>
      ) : (
        <>
          {newsData
            ? newsData.map((news, index) => (
                <Box
                  display={"flex"}
                  key={index}
                  padding={1.5}
                  width={["100%", "80%", "70%", "50%", "40%"]}
                  gap={2}
                  backgroundColor={"white"}
                  borderRadius={"md"}
                  cursor={'pointer'}
                  onClick={() => window.open(news.url, "_blank")}
                >
                  <Image
                    fontWeight={"bold"}
                    borderRadius={"md"}
                    width={"80px"}
                    src={news.urlToImage}
                    objectFit={"fill"}
                  ></Image>

                  <Text
                    fontSize={["xs", "xs", "xs", "sm"]}
                    fontFamily={"Times New Roman"}
                  >
                    {news.title}
                  </Text>
                </Box>
              ))
            : ""}
        </>
       )} 
    </Box>
  );
}
