import { Box,Image,Card,Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const navigate=useNavigate();
  return (
    <Box
    width={"98%"}
    display={"flex"}
    justifyContent={"center"}
    flexWrap={"wrap"}
    gap={4}
    marginTop={10}
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
              objectFit="contain"
              w={"120px"}
              h={"120px"}
              src="./assets/cash.svg"
              alt="Purchase"
            />
            <Text
              as="h2"
              fontFamily="Georgia, serif"
              fontSize={['xs','sm','md','lg']}
              fontWeight="bold"
              color={"#4169E1"}
              textAlign={"center"}
            >
              Check Balence
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
              objectFit="contain"
              w={"120px"}
              h={"120px"}
              src="./assets/history-svgrepo-com (4).svg"
              alt="Purchase"
            />
            <Text
              as="h2"
              fontFamily="Georgia, serif"
              fontSize={['xs','sm','md','lg']}
              fontWeight="bold"
              color={"#4169E1"}
              textAlign={"center"}
            >
              Payment history
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
            onClick={(e)=>{navigate('/purchase')}}
          >
            <Image
               objectFit="contain"
              w={"120px"}
              h={"120px"}
              src="./assets/purchase.svg"
              alt="Purchase"
            />
            <Text
              as="h2"
              fontFamily="Georgia, serif"
              fontSize={['xs','sm','md','lg']}
              fontWeight="bold"
              color={"#4169E1"}
              textAlign={"center"}
            >
          My purchases
            </Text>
          </Card>
    
    </Box>
  );
}
