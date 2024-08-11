import { Box } from "@chakra-ui/react";
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel,  } from "@chakra-ui/react";
import Summery from "./Summery";
import News from "./News";
import Chart from "./Chart";


export default function TabNavigation({ summeryData, data }) {
 

  return (
    <Box
      marginTop={"2%"}
      width={["95%", "80%", "60%", "60%"]}
      justifyContent={"center"}
      marginBottom={"10%"}
    >
      <Tabs  isLazy>
        <TabList
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <Tab
            fontSize={["sm", "md", "lg", "xl"]}
            fontWeight={"bold"}
            color={"white"}
            fontFamily={"Times New Roman"}
            _selected={{ color: "blue.500", bg: "none" }}
          >
            Summery
          </Tab>
          <Tab
            fontSize={["sm", "md", "lg", "xl"]}
            fontWeight={"bold"}
            color={"white"}
            fontFamily={"Times New Roman"}
            _selected={{ color: "blue.500", bg: "none" }}
          >
            Top News
          </Tab>
          <Tab
            fontSize={["sm", "md", "lg", "xl"]}
            fontWeight={"bold"}
            color={"white"}
            fontFamily={"Times New Roman"}
            _selected={{ color: "blue.500", bg: "none" }}
          >
            Charts
          </Tab>
        </TabList>
        <TabPanels>
          {/* initially mounted */}
          <TabPanel>
            <Summery summeryData={summeryData} data={data}></Summery>
          </TabPanel>
          {/* initially not mounted */}
          <TabPanel>
            <News ></News>
          </TabPanel>
          <TabPanel>
            <Chart ></Chart>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
