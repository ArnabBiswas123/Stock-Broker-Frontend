import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Center, Spinner, Text, Image } from "@chakra-ui/react";




export default function TrnasactionHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/");
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/alltransactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        return navigate("/");
      }

      const data = await response.json();
      //   console.log(wishdetails);
      if (data.success === true) {
        setIsLoading(false);
        setHistory(data.transactions);
      } else {
        setIsLoading(false);
        console.error("Failed to fetch user details:", data.msg);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);
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
            width={["100%","80%","70%","60%"]}
            display={"flex"}
            justifyContent={"center"}
            flexDir={"column"}
            // alignItems={'center'}
            gap={1}
          >
            {history.length > 0
              ? history.map((item, index) => {
                  return (
                    <Box key={index} gap={2} display={"flex"}>
                      <Image
                        src="/assets/history.svg"
                        alt="dashboard svg"
                        h={"25px"}
                        w={"25px"}
                        // m={2}
                        cursor={"pointer"}
                      ></Image>
                      {item.type === "deposit" && (
                        <Text
                          fontSize={["xs","sm","md","lg"]}
                          textAlign={"left"}
                          fontFamily={"Times New Roman"}
                          color="white"
                        >{`Deposited ${item.amount}$ via ${item.method} from account number "${item.account}" on ${new Date(item.createdAt).toLocaleString()}`}</Text>
                      )}
                      {item.type === "withdraw" && (
                        <Text
                        fontSize={["xs","sm","md","lg"]}
                          textAlign={"left"}
                          fontFamily={"Times New Roman"}
                          color="white"
                        >{`Withdrawn  ${item.amount} $  via  ${item.method}  from account number  "${item.account}"  on ${new Date(item.createdAt).toLocaleString()}`}</Text>
                      )}
                    </Box>
                  );
                })
              : ""}
          </Box>
        </>
      )}
    </Box>
  );
}
