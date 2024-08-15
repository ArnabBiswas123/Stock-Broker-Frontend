import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Center, Spinner, Text, Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import AddMoneyModal from "../common/AddMoneyModal";
import WithdrawMoneyModal from "../common/WithdrawMoneyModal";
export default function BalencePage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isWithdrawOpen,
    onOpen: openWithdraw,
    onClose: closeWithdraw,
  } = useDisclosure();

  const [fetchagain, setFetchagain] = useState(false);

  const FetchAgain = () => {
    setFetchagain((prev) => !prev);
  };

  const [isLoading, setIsLoading] = useState(true);
  const fetchbalance = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/");
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/checkbalence",
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
      if (data.success === true) {
        setIsLoading(false);
        setBalance(data.balance);
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
    fetchbalance();
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
            width={"95%"}
            display={"flex"}
            justifyContent={"center"}
            flexWrap={"wrap"}
            gap={4}
          >
            {balance ? (
              <Box
                display={"flex"}
                flexDir={"column"}
                gap={6}
                justifyContent={"center"}
                width={"100%"}
              >
                <Text
                  fontSize={"2xl"}
                  textAlign={"center"}
                  fontWeight={"bold"}
                  fontFamily="Georgia, serif"
                  color={"white"}
                >
                  Your current Balance is {`${balance}`} $
                </Text>
                <Box
                  display={"flex"}
                  gap={4}
                  justifyContent={"center"}
                  width={"100%"}
                >
                  <Button
                    colorScheme="green"
                    fontFamily={"Times New Roman"}
                    onClick={onOpen}
                  >
                    Add Money
                  </Button>
                  <Button
                    colorScheme="red"
                    fontFamily={"Times New Roman"}
                    onClick={openWithdraw}
                  >
                    Withdraw Money
                  </Button>
                </Box>
              </Box>
            ) : (
              ""
            )}
          </Box>
        </>
      )}
      {isOpen ? (
        <AddMoneyModal
          FetchAgain={FetchAgain}
          isOpen={isOpen}
          onClose={onClose}
        ></AddMoneyModal>
      ) : (
        ""
      )}
      {isWithdrawOpen ? (
        <WithdrawMoneyModal
          FetchAgain={FetchAgain}
          isOpen={isWithdrawOpen}
          onClose={closeWithdraw}
        ></WithdrawMoneyModal>
      ) : (
        ""
      )}
    </Box>
  );
}
