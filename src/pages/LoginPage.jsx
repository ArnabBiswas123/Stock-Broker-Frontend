import React from "react";
import {
  Center,
  Text,
  VStack,
  FormControl,
  Input,
  FormLabel,
  Button,
  useToast,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const toast = useToast();

  const submitHandler = async () => {
    try {
      let newErrors = {};
      const emailRegex = /^[^\s@]+@gmail\.com$/; // Basic email regex
      const Passwordregx = /^[a-zA-Z][a-zA-Z\d@]{5,}$/;

      // Trim the password before validation
      const trimmedPassword = password.trim();

      // Perform validations
      if (email === "" || !emailRegex.test(email)) {
        newErrors.email = "Enter a valid email";
      }
      if (trimmedPassword === "" || Passwordregx.test(trimmedPassword) === false) {
        newErrors.password = "Password must be alphanumeric 5 characters long";
      }

      setError(newErrors);
      if (Object.keys(newErrors).length === 0) {
        const response = await fetch(
          `http://localhost:5000/api/v1/user/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: trimmedPassword,
            }),
          }
        );
        const data = await response.json();
        if (data.success === true) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          toast({
            title: data.msg,
            // description: "Please Enter Valid Username and Password",
            position: "top",
            status: "error",
            duration: 1500,
            isClosable: true,
          });
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Center w={"100vw"} h={"100vh"}>
      <Center
        h={"70%"}
        w={["100%", "70%", "50%", "40%", "30%"]}
        borderRadius={"2%"}
        display={"flex"}
        flexDirection={"row"}
        bgColor={"white"}
        gap={"20%"}
        boxShadow="dark-lg"
      >
        <VStack w={"80%"} spacing={"25px"}>
          <Text
            fontSize={["2xl", "2xl", "2xl", "2xl", "4xl"]}
            as={"b"}
            mb={2}
            fontFamily={"Times New Roman"}
            color={"black"}
            mt={8}
          >
            {" "}
            Stock Broker
          </Text>

          <FormControl id="username" isInvalid={error.email} isRequired>
            <FormLabel color={"black"} fontFamily={"Times New Roman"}>
              Email
            </FormLabel>
            <Input
              placeholder="Enter your Email"
              color={"black"}
              fontFamily={"Times New Roman"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError({ ...error, email: "" });
              }}
            />
            {error.email ? (
              <FormErrorMessage fontSize={["xs", "sm", "sm", "sm", "sm"]}>{error.email}</FormErrorMessage>
            ) : (
              ""
            )}
          </FormControl>
          <FormControl id="Password" isRequired isInvalid={error.password}>
            <FormLabel color={"black"} fontFamily={"Times New Roman"}>
              Password
            </FormLabel>
            <Input
              placeholder="Enter your Password"
              color={"black"}
              type="password"
              fontFamily={"Times New Roman"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError({ ...error, password: "" });
              }}
            />
            {error.password ? (
              <FormErrorMessage fontSize={["xs", "sm", "sm", "sm", "sm"]}>
                {error.password}
              </FormErrorMessage>
            ) : (
              ""
            )}
          </FormControl>
          <Box width={'100%'}>
          <Box display={'flex'} width={'100%'} justifyContent={'flex-end'}>
            <Text
              fontSize={["sm", "sm", "sm", "sm", "lg"]}
              display={"flex"}
         
              fontFamily={"Times New Roman"}
              color={"#2B6CB0"}
              cursor={'pointer'}
              onClick={()=>{navigate('/forgetpassword')}}
            >
              Forget Password
            </Text>
          </Box>
          
          <Button
            colorScheme="blue"
            width="100%"
            // mb={}
            style={{ marginTop: 4 }}
            // fontFamily={"Times New Roman"}
            onClick={submitHandler}
            // isLoading={loading}
          >
            Login
          </Button>
          </Box>
          <Text
            fontSize={["sm", "sm", "sm", "sm", "lg"]}
            display={"flex"}
            mb={8}
            fontFamily={"Times New Roman"}
            color={"black"}
          >
            {" "}
            Are you a new User?
            <Text
              textDecoration={"underline"}
              textColor={"blue"}
              ml={2}
              cursor={"pointer"}
              onClick={() => {
                navigate("/register");
              }}
            >
              Register now
            </Text>
          </Text>
        </VStack>
      </Center>
    </Center>
  );
}
