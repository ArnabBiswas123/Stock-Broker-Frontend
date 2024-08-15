import { Box,Image,Card,Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const navigate=useNavigate();
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      marginTop={"2%"}
      flexDir={"row"}
      flexWrap={'wrap'}
      gap={'2%'}
      alignItems={"center"}
    >
       <Card
            direction={["column", "column", "column", "row"]}
            width={["60%","40%","20%","20%"]}
            overflow="hidden"
            variant="outline"
            alignItems={"center"}
            cursor={"pointer"}
            boxShadow="dark-lg"
            _hover={{ transform: "scale(1.02)" }}
            onClick={(e)=>{navigate('/balence')}}
            transition="transform 0.3s ease-in-out"
          >
            <Image
              objectFit="cover"
              w={"120px"}
              h={"120px"}
              src="./assets/cash.svg"
              alt="Kumbh Logo"
            />
            <Text
              as="h2"
              fontFamily="Georgia, serif"
              fontSize={20}
              fontWeight="bold"
              color={"#4169E1"}
              textAlign={"center"}
            >
              Check your Balence
            </Text>
          </Card>
       <Card
            direction={["column", "column", "column", "row"]}
            width={["60%","40%","20%","20%"]}
            overflow="hidden"
            variant="outline"
            alignItems={"center"}
            // gap={3}
            cursor={"pointer"}
            boxShadow="dark-lg"
            _hover={{ transform: "scale(1.02)" }}
            transition="transform 0.3s ease-in-out"
            onClick={(e)=>{navigate('/history')}}
          >
            <Image
              objectFit="cover"
              w={"120px"}
              h={"120px"}
              src="./assets/transaction.svg"
              alt="Kumbh Logo"
            />
            <Text
              as="h2"
              fontFamily="Georgia, serif"
              fontSize={20}
              fontWeight="bold"
              color={"#4169E1"}
              textAlign={"center"}
            >
              Check payment history
            </Text>
          </Card>
    
    </Box>
  );
}
