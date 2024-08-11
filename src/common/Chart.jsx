import { Box, useToast, Select, Center, Spinner } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useParams, useNavigate } from "react-router-dom";
export default function Chart() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [timeRange, setTimeRange] = useState("one month");

  const [chartData, setChartData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const calculateDate = () => {
    const currentDate = new Date();
    let pastDate;

    switch (timeRange) {
      case "one month":
        pastDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case "one year":
        pastDate = new Date(
          currentDate.setFullYear(currentDate.getFullYear() - 1)
        );
        break;
      case "all":
        pastDate = new Date(1970, 0, 1); // Start date as Unix epoch for 'all'
        break;
      default:
        pastDate = new Date();
    }

    return pastDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  };
  const fetchStock = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const date = calculateDate();
      const data = await fetch(
        `http://localhost:5000/api/v1/stock/stockchart/?q=${ticker}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === 401) {
        localStorage.removeItem("token");
        return navigate("/");
      }
      const stockdata = await data.json();
      if (stockdata.success === true) {
        setIsLoading(false);
        setChartData(stockdata.data);
      } else {
        if (
          stockdata.msg ===
          "You have run over your hourly request allocation. Try after some time"
        ) {
          setIsLoading(false);
          toast({
            title:
              "You have run over your hourly request allocation. Try after some time",
            position: "top",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [ticker, timeRange]);
  return (
    <Box width={"100%"}>
      <Select
        width={["40%","40%","30%","20%"]}
        fontFamily={"Times New Roman"}
        // placeholder="Select time range"
        onChange={(e) => setTimeRange(e.target.value)}
        color={'white'}
        marginBottom={4}
        defaultValue="one month"
      >
        <option style={{color:'black'}} value="one month">One Month</option>
        <option style={{color:'black'}} value="one year">One Year</option>
        <option style={{color:'black'}} value="all">All</option>
      </Select>
      <Box width={"100%"} height={[200,300,400,500]} backgroundColor={"white"}>
        {isLoading ? (
          <Center width={"100%"} height={"10vh"}>
            <Spinner size="xl" color="black" />
          </Center>
        ) : (
          <>
            {chartData ? (
              <ResponsiveContainer width="100%" height='100%'>
                <LineChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontFamily={"Times New Roman"} />
                  <YAxis fontFamily={"Times New Roman"} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="#8884d8"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="#82ca9d"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              ""
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
