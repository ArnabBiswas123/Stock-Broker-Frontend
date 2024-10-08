import { useState, useCallback, useEffect } from "react";
import {
  Text,
  Image,
  Box,
  InputGroup,
  InputRightElement,
  Input,
  List,
  ListItem,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AdminStockPage from "../../pages/Admin/AdminStockPage";
import UserSearchpage from "../../pages/Admin/UserSearchpage";

export default function AdminSidebar() {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    const token = localStorage.getItem("admintoken");

    if (!token) {
      return navigate("/");
    }
    try {
      const userd = await fetch(
        "http://localhost:5000/api/v1/admin/myprofile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userd.status === 401) {
        localStorage.removeItem("admintoken");
        return navigate("/admin/login");
      }

      const userdetails = await userd.json();
      if (userdetails.success === true) {
        setUser({ email: userdetails.user.user_name });
      } else {
        console.error("Failed to fetch user details:", userdetails.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSuggestions([]);
    navigate(`/admin/stock/${suggestion.ticker}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    return navigate("/");
  };

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query) {
        const token = localStorage.getItem("admintoken");
        if (!token) {
          return navigate("/");
        }
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/admin/search/?q=${query}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 401) {
            localStorage.removeItem("admintoken");
            return navigate("/admin/login");
          }
          const res = await response.json();

          if (res.success === true) {
            setSuggestions(res.data);
          } else {
            console.log("Error fetching suggestions:", res.msg);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300), // 300ms delay
    []
  );

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  return (
    <Box width={"100%"}>
      <Box
        minW={"100%"}
        display={"flex"}
        bgColor={"white"}
        position={"sticky"}
        top={0}
        zIndex={99}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={[0, 2, 3, 4]}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          gap={3}
          alignItems={"center"}
        >
          <NavLink to={"/admin/logs"}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Image
                src="/assets/stocklogo.svg"
                alt="dashboard svg"
                h={"40px"}
                w={"40px"}
                m={2}
                cursor={"pointer"}
              ></Image>
              <Text
                color={"Black"}
                fontFamily="Cursive"
                as={"b"}
                fontStyle="italic"
                textTransform="uppercase"
                fontSize={["xs", "sm", "lg", "2xl"]}
              >
                Stock Broker
              </Text>
            </Box>
          </NavLink>
        </Box>
        <Box
          width={["60%", "50%", "40%", "30%"]}
          display={"flex"}
          position="relative"
          flexDir={"column"}
        >
          <InputGroup
            border="1px solid #ddd"
            bgColor={"white"}
            borderRadius="md"
            overflow="hidden"
          >
            <Input
              placeholder="Search..."
              fontFamily={"Times New Roman"}
              value={query}
              onChange={handleChange}
            />
            <InputRightElement cursor="pointer">
              <Image src="/assets/search.svg" alt="Search Icon" />
            </InputRightElement>
          </InputGroup>
          {suggestions.length > 0 && (
            <List
              position={"absolute"}
              width={["100%"]}
              top={"41px"}
              border="1px solid #ddd"
              bgColor={"white"}
            >
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={index}
                  padding="2"
                  fontFamily={"Times New Roman"}
                  cursor="pointer"
                  _hover={{ bgColor: "gray.300" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {`${suggestion.ticker} | ${suggestion.companyName}`}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            cursor="pointer"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
          >
            <Image
              src="/assets/user.png"
              alt="dashboard svg"
              h={"40px"}
              w={"40px"}
              m={2}
              cursor={"pointer"}
            ></Image>
          </MenuButton>
          <MenuList>
            {user ? (
              <MenuItem
                display={"flex"}
                maxW={"300px"}
                flexDir={"column"}
                textOverflow={"ellipsis"}
                alignItems={"flex-start"}
              >
                <Text fontFamily={"Times New Roman"} noOfLines={1}>
                  {user.email}
                </Text>
              </MenuItem>
            ) : (
              ""
            )}

            <MenuItem
              display={"flex"}
              gap={2}
              onClick={handleLogout}
              fontFamily={"Times New Roman"}
            >
              <Image
                src="/assets/logout.svg"
                alt="dashboard svg"
                h={"25px"}
                w={"25px"}
                // m={2}
                cursor={"pointer"}
              ></Image>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      {pathname.startsWith("/admin/stock/") ? <AdminStockPage></AdminStockPage> : ""}
      {pathname==="/admin/logs" ? <UserSearchpage></UserSearchpage> : ""}
    </Box>
  );
}
