import {
  Center,
  Image,
  Box,
  Input,
  InputRightElement,
  InputGroup,
  useToast,
  Text,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserSearchpage() {
  const [query, setQuery] = useState("");
  const [userdata, setUserdata] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const onsubmithandle = async () => {
    try {
      const emailRegex = /^[^\s@]+@gmail\.com$/; // Basic email regex
      if (query === "" || !emailRegex.test(query)) {
        toast({
          title: "Enter a valid Email",

          position: "top",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        return;
      }
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return navigate("/admin/login");
      }
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/searchuser?email=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        return navigate("/admin/login");
      }
      const data = await response.json();
      if (data.success === true) {
        setUserdata(data.user);
      } else {
        console.log("Error fetching suggestions:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

 const handleenable= async () => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return navigate("/admin/login");
      }
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/activeuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: userdata.email
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        return navigate("/admin/login");
      }
      const data = await response.json();
      if (data.success === true) {
        toast({
            title: data.msg,
           
            position: "top",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        setUserdata(data.user);
      } else {
        console.log("Error fetching suggestions:", data.msg);
      }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
  };

  const handledisable = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return navigate("/admin/login");
      }
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/deactiveuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: userdata.email
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        return navigate("/admin/login");
      }
      const data = await response.json();
      if (data.success === true) {
        toast({
            title: data.msg,
           
            position: "top",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        setUserdata(data.user);
      } else {
        console.log("Error fetching suggestions:", data.msg);
      }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
  };
  return (
    <Center>
      <Box
        width={["60%", "50%", "40%", "30%"]}
        display={"flex"}
        position="relative"
        flexDir={"column"}
        marginTop={"10%"}
      >
        <InputGroup
          border="1px solid #ddd"
          bgColor={"white"}
          borderRadius="md"
          overflow="hidden"
        >
          <Input
            placeholder="Search User"
            fontFamily={"Times New Roman"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <InputRightElement cursor="pointer" onClick={onsubmithandle}>
            <Image src="/assets/search.svg" alt="Search Icon" />
          </InputRightElement>
        </InputGroup>
        {userdata ? (
          <Center
            width={"100%"}
            display={"flex"}
            flexDir={"column"}
            mt={10}
            gap={2}
            alignItems={"flex-start"}
          >
            <Text
              color={"white"}
              fontSize={"xl"}
              fontFamily={"Times New Roman"}
            >
              {`Name:- ${userdata.name}`}
            </Text>
            <Text
              color={"white"}
              fontSize={"xl"}
              fontFamily={"Times New Roman"}
            >
              {`Email:- ${userdata.email}`}
            </Text>
            {userdata.active ? (
              <Button
                fontFamily={"Times New Roman"}
                colorScheme="red"
                onClick={handledisable}
              >
                Disable User
              </Button>
            ) : (
              <Button fontFamily={"Times New Roman"} colorScheme="green"  onClick={handleenable}>
                Enable User
              </Button>
            )}
          </Center>
        ) : (
          ""
        )}
      </Box>
    </Center>
  );
}
