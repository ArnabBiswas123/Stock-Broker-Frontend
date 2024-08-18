import {
  Center,
  Text,
  HStack,
  PinInput,
  PinInputField,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//   import authAxios from "../../AuthAxios";

export default function EmailOtp() {
  const [password, setPassword] = useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword:''
  });
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const authtoken = localStorage.getItem("token");
    if (!authtoken) {
      navigate("/");
    }
  }, []);

  const handlePinChange = (value) => {
    setPin(value);
  };
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    setErrors({
      ...errors,
      password: "",
    });
  };
 
  const submitHandler = async () => {
try {
  const Passwordregx = /^[a-zA-Z][a-zA-Z\d@]{5,}$/;

  const newErrors = {};
  if (pin === "") {
    toast({
      title: "please Enter OTP",
      description: "some fields are not valid",
      position: "top",
      status: "error",
      duration: 1000,
      isClosable: true,
    });
    return;
  }

  if (Passwordregx.test(password) === false) {
    newErrors.password = "Password must be at least 5 characters long";
  }
  if(password!==confirmPassword){
    newErrors.confirmPassword = "Password doesn't match";
  }

  setErrors(newErrors);
  const token = localStorage.getItem("token");
  if (!token) {
    return navigate("/");
  }
  if (Object.keys(newErrors).length === 0) {

    setLoading(true);
    const response = await fetch(
      "http://localhost:5000/api/v1/user/verifyemail",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp:pin,
          password: password, 
        }),
      }
    );
    if (response.status === 401) {
      
      localStorage.removeItem("token");
      return navigate("/");
    }
    const result = await response.json();

    if (result.success) {
      setLoading(false)
      toast({
        title: "password changed successfully",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/");
        }, 1500);

      return;
    } else {
      setLoading(false)
      toast({
        title: result.msg,
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  }
} catch (error) {
  setLoading(false);
  console.error("Error send otp", error);
}

    
  
   
   
 
      

     
      
  
    
  };

  return (
    <Center display={"flex"} w={"100vw"} h={"100vh"}>
      <Center
        h={"75%"}
        w={["100%", "70%", "50%", "40%", "30%"]}
        borderRadius={"2%"}
        display={"flex"}
        flexDirection={"row"}
        bgColor={"white"}
        gap={"20%"}
        boxShadow="dark-lg"
      >
        <VStack w={"80%"} spacing={"10px"}>
          <Text fontSize={"3xl"} as={"b"} fontFamily={"Times New Roman"}>
            Varify your Email
          </Text>

          <Text mb={2} fontWeight={"bold"} fontFamily={"Times New Roman"}>
            An OTP has been sent to your Email
          </Text>

          <HStack>
            <PinInput
              placeholder=""
              size={["sm","md","lg","lg"]}
              onChange={handlePinChange}
              value={pin}
            >
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <PinInputField
                  key={index}
                  boxShadow={"base"}
                  borderColor={"black"}
                />
              ))}
            </PinInput>
          </HStack>
          <Center w={"100%"} display={"flex"} flexDirection={"column"} gap={4}>
            <FormControl id="password" isRequired isInvalid={errors.password}>
              <FormLabel fontFamily={"Times New Roman"}>New Password</FormLabel>
              <Input
                placeholder="Enter your new password"
                value={password}
                onChange={passwordChangeHandler}
                borderColor={"black"}
                fontFamily={"Times New Roman"}
              />
              {errors.password ? (
                <FormErrorMessage fontSize={["xs", "sm", "sm", "sm", "sm"]}>{errors.password}</FormErrorMessage>
              ) : (
                ""
              )}
            </FormControl>
            <FormControl id="password" isRequired isInvalid={errors.confirmPassword}>
              <FormLabel fontFamily={"Times New Roman"}>
                Confirm Password
              </FormLabel>
              <Input
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e)=>{
                  setConfirmPassword(e.target.value);
                  setErrors({
                    ...errors,
                    confirmPassword:''
                  })
                }}
                borderColor={"black"}
                fontFamily={"Times New Roman"}
              />
              {errors.confirmPassword? (
                <FormErrorMessage fontSize={["xs", "sm", "sm", "sm", "sm"]}>{errors.confirmPassword}</FormErrorMessage>
              ) : (
                ""
              )}
            </FormControl>
          </Center>
          <Center w={"100%"} textAlign={"center"} gap={"4%"}>
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
          </Center>
        </VStack>
      </Center>
    </Center>
  );
}
