import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Spinner,
  Center,
  useToast,
  Card,
  Image,
  Text,
} from "@chakra-ui/react";

export default function CompanyPredictionPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [predictionData, setPredictionData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const fetchPrediction = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const data = await fetch(
        `http://localhost:5000/api/v1/prediction/getpredictionbyname/${name}`,
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
      //   console.log(stockdata)
      if (stockdata.success === true) {
        setIsLoading(false);
        setPredictionData(stockdata.prediction);
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
        } else {
          if (stockdata.msg === "company does not exists") {
            setIsLoading(false);
            toast({
              title: "Company does not exists",

              position: "top",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            navigate("/dashboard");
            return;
          } else {
            setIsLoading(false);
            console.log(stockdata.msg);
            navigate("/dashboard");
            return;
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [name]);

  return (
    <Box
      display={"flex"}
      flex="1"
      flexDirection={"column"}
      width={"100%"}
      overflowY="auto"
    >
      {isLoading ? (
        <Center height="100vh">
          <Spinner size="xl" color="white" />
        </Center>
      ) : (
        <>
          <Center>
            <Text
              textAlign={"center"}
              fontSize={"2xl"}
              color={"white"}
              fontFamily="Times New Roman"
              textDecoration={"underline"}
              margin={10}
            >
              {`7 days prediction of ${predictionData.name}`}
            </Text>
          </Center>
          <Center
            margin={"auto"}
            width={"80%"}
            gap={10}
            display={"flex"}
            flexWrap={"wrap"}
          >
            <Card
              display={"flex"}
              
              width={["60%", "40%", "30%","25%"]}
              justifyContent={"center"}
              direction={["column", "column", "column", "row"]}
             
              alignItems={"center"}
              backgroundColor={"white"}
             
            >
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Image
                  objectFit="contain"
                  w={"90px"}
                  h={"90px"}
                  src="/assets/prediction.svg"
                  alt="Purchase"
                />
              </Box>

              <Box display={"flex"} flexDir={"column"}>
                <Text fontWeight={"bold"} fontFamily="Times New Roman">
                  Closing Price
                </Text>
                {predictionData.close.length > 0
                  ? predictionData.close.map((item, index) => {
                      return (
                        <Text
                          key={index}
                          fontSize={"small"}
                          fontFamily="Times New Roman"
                        >
                          {item}
                        </Text>
                      );
                    })
                  : ""}
              </Box>
            </Card>
            <Card
            display={"flex"}
              
            width={["60%", "40%", "30%","25%"]}
            justifyContent={"center"}
            direction={["column", "column", "column", "row"]}
           
            alignItems={"center"}
            backgroundColor={"white"}
            >
              <Image
                objectFit="contain"
                w={"90px"}
                h={"90px"}
                src="/assets/prediction.svg"
                alt="Purchase"
              />
              <Box display={"flex"} flexDir={"column"}>
                <Text fontWeight={"bold"} fontFamily="Times New Roman">
                  opening Price
                </Text>
                {predictionData.open.length > 0
                  ? predictionData.open.map((item, index) => {
                      return (
                        <Text
                          key={index}
                          fontSize={"small"}
                          fontFamily="Times New Roman"
                        >
                          {item}
                        </Text>
                      );
                    })
                  : ""}
              </Box>
            </Card>
            <Card
             display={"flex"}
              
             width={["60%", "40%", "30%", "25%"]}
             justifyContent={"center"}
             direction={["column", "column", "column", "row"]}
            
             alignItems={"center"}
             backgroundColor={"white"}
            >
              <Image
                objectFit="contain"
                w={"90px"}
                h={"90px"}
                src="/assets/prediction.svg"
                alt="Purchase"
              />
              <Box display={"flex"} flexDir={"column"}>
                <Text fontWeight={"bold"} fontFamily="Times New Roman">
                  High Price
                </Text>
                {predictionData.high.length > 0
                  ? predictionData.high.map((item, index) => {
                      return (
                        <Text
                          key={index}
                          fontSize={"small"}
                          fontFamily="Times New Roman"
                        >
                          {item}
                        </Text>
                      );
                    })
                  : ""}
              </Box>
            </Card>
            <Card
              display={"flex"}
              
              width={["60%", "40%", "30%", "25%"]}
              justifyContent={"center"}
              direction={["column", "column", "column", "row"]}
             
              alignItems={"center"}
              backgroundColor={"white"}
            >
              <Image
                objectFit="contain"
                w={"90px"}
                h={"90px"}
                src="/assets/prediction.svg"
                alt="Purchase"
              />
              <Box display={"flex"} flexDir={"column"}>
                <Text fontWeight={"bold"} fontFamily="Times New Roman">
                  Low Price
                </Text>
                {predictionData.low.length > 0
                  ? predictionData.low.map((item, index) => {
                      return (
                        <Text
                          key={index}
                          fontSize={"small"}
                          fontFamily="Times New Roman"
                        >
                          {item}
                        </Text>
                      );
                    })
                  : ""}
              </Box>
            </Card>
          </Center>
        </>
      )}
    </Box>
  );
}
