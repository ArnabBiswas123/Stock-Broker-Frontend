import {
  Box,
  Text,
  IconButton,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const fetchWish = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/");
    }
    try {
      const wish = await fetch(
        "http://localhost:5000/api/v1/user/getwishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (wish.status === 401) {
        localStorage.removeItem("token");
        return navigate("/");
      }

      const wishdetails = await wish.json();
      //   console.log(wishdetails);
      if (wishdetails.success === true) {
        setIsLoading(false);
        setWishlist(wishdetails.wishlist);
      } else {
        setIsLoading(false);
        console.error("Failed to fetch user details:", wishdetails.msg);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const removeFromWishlist = async (ticker) => {
    if (
      window.confirm(
        "Are you sure you want to remove this stock from your wishlist?"
      )
    ) {
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/user/removewishlist",
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ticker }),
          }
        );
        if (response.status === 401) {
          localStorage.removeItem("token");
          return navigate("/");
        }
        const result = await response.json();

        if (result.success) {
          setWishlist(wishlist.filter((item) => item.ticker !== ticker));
          toast({
            title: "Company removed from wishlist",
            position: "top",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: result.msg,
            position: "top",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          
          console.error("Failed to remove item from wishlist:", result.msg);
          return;
        }
      } catch (error) {
        console.error("Error removing item:", error);
      }
    }
  };

  useEffect(() => {
    fetchWish();
  }, []);

  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      marginTop={"5%"}
    >
      {isLoading ? (
        <Center width={"100%"} height={"10vh"}>
          <Spinner size="xl" color="white" />
        </Center>
      ) : (
        <>
          <Box
            width={"90%"}
            display={"flex"}
            justifyContent={"center"}
            flexWrap={"wrap"}
            gap={4}
          >
            {wishlist.length > 0 ? (
              wishlist.map((wish, index) => {
                return (
                  <Box
                    key={index}
                    cursor={"pointer"}
                    width={["90%", "60%", "50%", "30%"]}
                    display={"flex"}
                    borderRadius={"md"}
                    flexDir={"column"}
                    alignItems={"center"}
                    bgColor={"white"}
                    position={"relative"}
                    onClick={() => {
                      navigate(`/stock/${wish.ticker}`);
                    }}
                  >
                    <IconButton
                      icon={<CloseIcon />}
                      aria-label="Remove from wishlist"
                      size="sm"
                      color="red.500"
                      bg="transparent"
                      position={"absolute"}
                      top={1}
                      right={2}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeFromWishlist(wish.ticker);
                      }}
                    />
                    <Box
                      paddingY={6}
                      display={"flex"}
                      flexDir={"column"}
                      alignItems={"center"}
                    >
                      <Text
                        fontWeight={"bold"}
                        fontFamily={"Times New Roman"}
                        fontSize={["lg", "xl", "2xl"]}
                        textAlign={"center"}
                        color="gray.600" 
                      >
                        {wish.companyName}
                      </Text>
                      <Text  color="gray.600"  fontFamily={"Times New Roman"} fontSize={"lg"}>
                        {wish.ticker}
                      </Text>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box>
                 <Text fontFamily={"Times New Roman"} color={"gray.400"}>No items in your wishlist</Text>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
