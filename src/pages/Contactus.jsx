import React from "react";
import { Box, Text, Image, Center } from "@chakra-ui/react";

export default function Contactus() {
  return (
    <Center display={"flex"} flexDirection={"column"} marginTop={8}>
      <Text fontSize={"4xl"} color={"white"} fontFamily={"Times New Roman"}>
        Contact Us
      </Text>
      <Box display={'flex'} flexDir={'column'} mt={4} gap={2} alignItems={'flex-start'}>

     
      <Box display={"flex"} alignItems={"center"}>
        <Image
          src="/assets/phone-call-essential-svgrepo-com.svg"
          alt="dashboard svg"
          h={"50px"}
          w={"50px"}
        ></Image>
        <Text fontSize={"xl"} color={"white"} fontFamily={"Times New Roman"}>
          +91 87776945
        </Text>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        <Image
          src="/assets/mail.svg"
          alt="dashboard svg"
          h={"50px"}
          w={"50px"}
        ></Image>
        <Text fontSize={"xl"} color={"white"} fontFamily={"Times New Roman"}>
          elenaduttaproject@gmail.com
        </Text>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        <Image
          src="/assets/location.svg"
          alt="dashboard svg"
          h={"50px"}
          w={"50px"}
        ></Image>
        <Text fontSize={"xl"} color={"white"} fontFamily={"Times New Roman"}>
          1000 Defense Pentagon, Washington, DC 20301-1000
        </Text>
      </Box>
      </Box>
    </Center>
  );
}
