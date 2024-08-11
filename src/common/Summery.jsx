import React from "react";
import { Box, Text } from "@chakra-ui/react";
export default function Summery({summeryData, data }) {
  return (
    <Box display={'flex'} flexDir={['column','column','row','row']} justifyContent={'space-between'}  >
        <Box>
      <Text
        fontWeight={"bold"}
        color={"white"}
        fontFamily={"Times New Roman"}
        fontSize={["xs", "sm", "md", "lg"]}
      >{`High Price:   ${data.highPrice}`}</Text>
      <Text
        fontWeight={"bold"}
        color={"white"}
        fontFamily={"Times New Roman"}
        fontSize={["xs", "sm", "md", "lg"]}
      >{`Low Price:   ${data.lowPrice}`}</Text>
      <Text
        fontWeight={"bold"}
        color={"white"}
        fontFamily={"Times New Roman"}
        fontSize={["xs", "sm", "md", "lg"]}
      >{`Open Price:   ${data.openPrice}`}</Text>
      <Text
        fontWeight={"bold"}
        color={"white"}
        fontFamily={"Times New Roman"}
        fontSize={["xs", "sm", "md", "lg"]}
      >{`Prev Close:   ${data.prevClose}`}</Text>
      <Text
        fontWeight={"bold"}
        color={"white"}
        fontFamily={"Times New Roman"}
        fontSize={["xs", "sm", "md", "lg"]}
      >{`Volume:   ${data.volume}`}</Text>
      <Text
        fontWeight={"bold"}
        color={"white"}
        fontFamily={"Times New Roman"}
        fontSize={["xs", "sm", "md", "lg"]}
      >{`Start Date:   ${summeryData.startDate}`}</Text>
    </Box>
    <Box width={['100%','100%','60%','60%']}>
        <Text  fontWeight={"bold"}
        color={"white"}
        fontFamily={"Times New Roman"}
        textDecoration={'underline'}
        fontSize={"large"}>Company's Description</Text>
        <Text
         fontSize={["xs", "sm", "sm", "md"]}
         fontFamily={"Times New Roman"}
         fontWeight={"normal"}
         textAlign={'justify'}
         color={"white"}
         whiteSpace="normal"  // Allows text to wrap and generate new rows
        >
            {summeryData.description}
        </Text>
    </Box>
    </Box>
  );
}
