import { useTable, useSortBy, usePagination } from "react-table";
import { TriangleDownIcon, TriangleUpIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  chakra,
  Spinner,
  Center,
  Text,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import { useEffect, useState, useMemo } from "react";

import { useNavigate,NavLink } from "react-router-dom";
export default function PredictionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchprediction = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      return navigate("/");
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/prediction/getallprediction",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        return navigate("/");
      }

      const data = await response.json();
      if (data.success === true) {
        setLoading(false);
        setPrediction(data.data);
      } else {
        setLoading(false);
        console.error("Failed to fetch user details:", data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const filteredData = useMemo(() => {
    if (!searchTerm) return prediction;
    return prediction.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [prediction, searchTerm]);

  const data = useMemo(() => filteredData, [filteredData]);

  const columns = useMemo(
    () => [
      {
        Header: "Stock Name",
        accessor: "name",
        Cell: ({ value }) => <NavLink to={`/companyprediction/${value}`}>{value}</NavLink>,
      },
      {
        Header: "Close Price",
        accessor: "closeFirst",
        isNumeric: true,
      },
      {
        Header: "High Price",
        accessor: "highFirst",
        isNumeric: true,
      },
      {
        Header: "Low Price",
        accessor: "lowFirst",
        isNumeric: true,
      },
      {
        Header: "Open Price",
        accessor: "openFirst",
        isNumeric: true,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    fetchprediction();
  }, []);

  return (
    <Box
      display={"flex"}
      flex="1"
      flexDirection={"column"}
      width={"100%"}
      overflowY="auto"
      padding={[0,10,10,10]}
    >
      {loading ? (
        <Center height="100vh">
          <Spinner size="xl" color="white" />
        </Center>
      ) : (
        <>
          <Center>
            <Text
              textAlign={"center"}
              fontSize={'2xl'}
              color={"white"}
              fontFamily="Times New Roman"
              textDecoration={'underline'}
            >
              Tommorrow's Prediction
            </Text>
          </Center>
          <Box mt={4} mb={4} display="flex" justifyContent='flex-end'>
          <InputGroup width="250px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.900" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search by stock name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fontFamily="Times New Roman"
                color="gray.900"
                backgroundColor="white"
              />
            </InputGroup>
          
          </Box>
          <TableContainer mt={4} overflow={"scroll"}>
            <Table {...getTableProps()}>
              <Thead fontFamily="Times New Roman">
                {headerGroups.map((headerGroup) => {
                  const { key, ...restHeaderProps } =
                    headerGroup.getHeaderGroupProps();

                  return (
                    <Tr
                      // {...rest}
                      textAlign={"center"}
                      key={key}
                      {...restHeaderProps}
                    >
                      {headerGroup.headers.map((column) => {
                        const { key, ...restColumnProps } =
                          column.getHeaderProps(column.getSortByToggleProps());
                        return (
                          <Th
                            textAlign={"center"}
                            color={"white"}
                            key={key}
                            {...restColumnProps}
                            isNumeric={column.isNumeric}
                          >
                            {column.render("Header")}
                            <chakra.span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <TriangleDownIcon aria-label="sorted descending" />
                                ) : (
                                  <TriangleUpIcon aria-label="sorted ascending" />
                                )
                              ) : null}
                            </chakra.span>
                          </Th>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  const { key, ...restRowProps } = row.getRowProps();

                  return (
                    <Tr key={key} {...restRowProps} justifyContent={"center"}>
                      {row.cells.map((cell) => {
                        const { key, ...restcellProps } = cell.getCellProps();
                        return (
                          <Td
                            textAlign={"center"}
                            color={"white"}
                            fontFamily="Times New Roman"
                            key={key}
                            paddingY={1}
                            {...restcellProps}
                            isNumeric={cell.column.isNumeric}
                          >
                            {cell.render("Cell")}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <Box
            display={"flex"}
            mt={4}
            justifyContent={"center"}
            alignItems={"center"}
            gap={4}
          >
            <Button
              isDisabled={pageIndex === 0}
              onClick={() => gotoPage(0)}
              fontFamily={"Times New Roman"}
              backgroundColor={"white"}
            >
              First
            </Button>
            <Button
              isDisabled={!canPreviousPage}
              onClick={previousPage}
              fontFamily={"Times New Roman"}
              backgroundColor={"white"}
            >
              Prev
            </Button>
            <Text color={"white"} width={'60px'} fontFamily={"Times New Roman"}>
              {pageIndex + 1} of {pageCount}
            </Text>
            <Button
              isDisabled={!canNextPage}
              onClick={nextPage}
              fontFamily={"Times New Roman"}
            >
              Next
            </Button>
            <Button
              isDisabled={pageIndex >= pageCount - 1}
              onClick={() => gotoPage(pageCount - 1)}
              fontFamily={"Times New Roman"}
            >
              Last
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
