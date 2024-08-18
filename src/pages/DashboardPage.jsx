import { Center,Box,  Text } from "@chakra-ui/react";
import React from "react";

export default function DashboardPage() {
  return (
    <Center >
        <Box width={'80%'} mt={'5%'}>
      <Text color={"white"} textAlign={'justify'} fontSize={['xs','sm','md','lg','xl']} fontFamily={"Times New Roman"}>
        Welcome to StockBroker your trusted partner in efficient and effective
        stock management. Our mission is to streamline your inventory processes,
        providing you with the tools you need to manage your stock effortlessly,
        accurately, and in real-time. At StockBroker, we envision a world where
        businesses of all sizes can manage their inventories with precision and
        ease. Our application is designed to eliminate the complexities of stock
        management, enabling you to focus on what truly matters—growing your
        business. We understand the challenges that come with managing stock in
        today’s fast-paced business environment. That’s why we’ve created a
        solution that not only simplifies stock management but also empowers you
        to operate more efficiently. With StockBroker, you can reduce
        operational costs, increase efficiency, and ensure that your stock
        levels align perfectly with your business needs. We are committed to
        continuous improvement, regularly updating our application with the
        latest features and enhancements to ensure that you always have access
        to the best tools in stock management. Our team is dedicated to
        providing exceptional customer support, ready to assist you with any
        questions or concerns. Thank you for choosing StockBroker. We look
        forward to being a key part of your business’s success.
      </Text>
      </Box>
    </Center>
  );
}
