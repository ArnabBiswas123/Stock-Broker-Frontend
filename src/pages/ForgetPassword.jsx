import {
  Center,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: "",
  });
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
    setErrors({
      ...errors,
      email: "",
    });
  };
  const submitHandler = async () => {
    try {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

      const newErrors = {};

      if (emailRegex.test(email) === false) {
        newErrors.email = "Enter a valid email";
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setLoading(true);
        const result = await fetch(
          `http://localhost:5000/api/v1/user/sendemail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );
        const data = await result.json();
        setLoading(false);
        // console.log(data);
        if (data.success === false) {
          if (data.msg === "User not exists") {
            toast({
              title: "This Email doesn't exists",
              description: "Resgister first",
              position: "top",
              status: "error",
              duration: 1000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Something went wrong",
              description: "Try after some time",
              position: "top",
              status: "error",
              duration: 1000,
              isClosable: true,
            });
          }
        } else {
          toast({
            title: "OTP sent successfully",
            position: "top",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          setLoading(false);
          localStorage.setItem("token", data.token);
          setTimeout(() => {
            navigate("/emailotp");
          }, 1500);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Center w={"100vw"} h={"100vh"}>
      <Center
        h={"40%"}
        w={["100%", "70%", "50%", "40%", "30%"]}
        borderRadius={"2%"}
        display={"flex"}
        flexDirection={"row"}
        bgColor={"white"}
        gap={"20%"}
        boxShadow="dark-lg"
      >
        <VStack w={"80%"} spacing={"10px"}>
          <Text fontSize={"4xl"} as={"b"} fontFamily={"Times New Roman"} mb={4}>
            {" "}
            Varify Email
          </Text>

          <FormControl id="Email" isRequired isInvalid={errors.email}>
            <FormLabel fontFamily={"Times New Roman"}>Email</FormLabel>
            <Input
              placeholder="Enter your Email"
              value={email}
              onChange={emailChangeHandler}
              borderColor={"black"}
              fontFamily={"Times New Roman"}
            />
            {errors.email ? (
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            ) : (
              ""
            )}
          </FormControl>

          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
            // fontFamily={"Times New Roman"}
          >
            Submit
          </Button>
        </VStack>
      </Center>
    </Center>
  );
}
