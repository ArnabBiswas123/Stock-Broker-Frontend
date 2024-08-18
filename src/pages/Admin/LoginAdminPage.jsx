import React, { useState } from "react";
import {
  Center,
  Text,
  VStack,
  FormControl,
  Input,
  FormLabel,
  Button,
  useToast,
  FormErrorMessage
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function LoginAdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
const toast=useToast();

  const submitHandler=async()=>{
    try {
      let newErrors = {};
      if (username === "") newErrors.username = "Enter Your user name";
      if (password === "") newErrors.password = "Enter your password";
      
      setError(newErrors);
      if (Object.keys(newErrors).length === 0){

        // console.log(process.env.REACT_APP_BACKEND_URL)
          const response=await fetch( `http://localhost:5000/api/v1/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_name: username,
              password: password
            }),
          })
          const data = await response.json();
          if(data.success===true){
            localStorage.setItem("admintoken",data.token);
            navigate('/admin/logs')
          }
          else{
            toast({
              title: data.msg,
              // description: "Please Enter Valid Username and Password",
              position: "top",
              status: "error",
              duration: 1000,
              isClosable: true,
            });
            return;
          }
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <Center w={"100vw"} h={"100vh"} >
      <Center
        h={"60%"}
        w={["100%", "70%", "50%", "40%", "30%"]}
        borderRadius={"2%"} 
        display={"flex"}
        flexDirection={"row"}
        bgColor={"#252B3B"}
        gap={"20%"}
        boxShadow="dark-lg"
      >
        <VStack w={"80%"} spacing={"25px"}>
          <Text
             fontSize={["2xl", "2xl", "2xl", "2xl", "4xl"]}
             as={"b"}
             mb={2}
             fontFamily={"Times New Roman"}
            
             mt={8}
             color={'white'}
          >
            {" "}
             Admin Login
          </Text>

          <FormControl id="username" isInvalid={error.username} isRequired>
            <FormLabel color={"white"}  fontFamily={"Times New Roman"}>Username</FormLabel>
            <Input
              placeholder="Enter your Username"
              color={"white"}
              fontFamily={"Times New Roman"}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError({...error,username:''})
              }}
            />
            {error.username?<FormErrorMessage fontSize={["xs", "sm", "sm", "sm", "sm"]}>{error.username}</FormErrorMessage>:''}
          </FormControl>
          <FormControl id="Password" isRequired isInvalid={error.password}>
            <FormLabel color={"white"}>Password</FormLabel>
            <Input
              placeholder="Enter your Password"
              color={"white"}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError({...error,password:''})
              }}
            />
            {error.password?<FormErrorMessage fontSize={["xs", "sm", "sm", "sm", "sm"]}>{error.password}</FormErrorMessage>:''}
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            mb={8}
            style={{ marginTop: 4 }}
            
            onClick={submitHandler}
            // isLoading={loading}
          >
            Login
          </Button>
        </VStack>
      </Center>
    </Center>
  );
}
