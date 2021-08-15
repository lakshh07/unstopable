import "../App.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Avatar,
  Flex,
  Tag,
  TagLabel,
  Image,
  Heading,
  Stack,
  HStack,
  SimpleGrid,
  Icon,
  Text,
  Container,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import svgAvatarGenerator from "../utils/avatar";
import {
  FcAdvertising,
  FcAssistant,
  FcDonate,
  FcInTransit,
  FcOrgUnit,
  FcReddit,
} from "react-icons/fc";
import image from "../images/20945479.jpg";
import ClubCard from "./Usercard";
import CreateUser from "./CreateClub";
import { getPubKeyFromMetamask } from "../utils/utils";

const fetchAccountClub = (a) => {
  return {
    name: "BESTOF WORLD",
  };
};

export default function Hero({ currentAccount, clubService, graphService }) {
  const [avatar, setAvatar] = useState(undefined);
  const [accountClub, setAccountClub] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allClubs, setClubs] = useState([]);
  const [subClubSet, setSubClubs] = useState(new Set());
  const [transHash, setTransHash] = useState();
  const toast = useToast();

  useEffect(async () => {
    let svg = svgAvatarGenerator(currentAccount, { dataUri: true });
    setAvatar(svg);
    let aClub = fetchAccountClub(currentAccount);
    setAccountClub(aClub);
    let subscribedClubs = await graphService.fetchClubsOfMember(currentAccount);
    setSubClubs(new Set(subscribedClubs.map((c) => c.address)));
  }, [currentAccount]);

  useEffect(async () => {
    let clubs = await graphService.fetchClubs();
    setClubs(clubs);
    console.log("GRAPHT SERVICE CALLED WITH RESULT", clubs);
  }, []);

  const Feature = ({ icon, title, text }) => {
    return (
      <Stack align="center">
        <Flex
          w={32}
          h={32}
          align={"center"}
          justify={"center"}
          color={"white"}
          rounded={"full"}
          bg={"gray.100"}
          mb={1}
        >
          {icon}
        </Flex>
        <Text fontWeight={600} fontSize={26}>
          {title}
        </Text>
        <Text color={"gray.600"} fontSize={20}>
          {text}
        </Text>
      </Stack>
    );
  };
  return (
    <div className="hero">
      <Flex
        h={20}
        w="100%"
        align="center"
        alignItems={"center"}
        pt={10}
        // alignItems="baseline"
        justifyContent={"space-between"}
        pl={40}
        pr={20}
        className="Header"
      >
        <HStack>{/*  FOR LOGO  */}</HStack>
        <div className="headercomp" align="center">
          {/* {if/else between two buttons for club owner and club subscriber} */}
          {currentAccount !== "0x0000" ? (
            <Tag
              size="sm"
              zIndex="99"
              pt={1}
              pb={1}
              ml={3}
              mr={2}
              background="rgba(255, 255, 255, 0.3)"
            >
              <TagLabel color="rgba(245,245,245)">
                {`${currentAccount.substr(0, 6)}...${currentAccount.substr(
                  -4
                )}`}
              </TagLabel>
              <Avatar
                borderStyle="solid"
                borderColor="blue"
                borderWidth="2px"
                padding="1px"
                ml={4}
                size="sm"
                bg="transparent"
                src={avatar}
              />
            </Tag>
          ) : (
            <Button colorScheme="teal" variant="solid">
              Connect Wallet
            </Button>
          )}
        </div>
      </Flex>
      <Flex
        align="center"
        justify={{ base: "center", md: "space-around", xl: "space-between" }}
        direction={{ base: "column-reverse", md: "row" }}
        wrap="no-wrap"
        minH="90vh"
        mx={20}
        mt={-4}
      >
        <Stack
          spacing={4}
          w={{ base: "80%", md: "40%" }}
          align={["center", "center", "flex-start", "flex-start"]}
        >
          <Heading
            as="h1"
            fontSize="6vw"
            fontWeight="bold"
            color="primary.800"
            textAlign={["center", "center", "left", "left"]}
          >
            Unstoppable Clubs
          </Heading>
          <Heading
            as="h2"
            size="md"
            color="primary.800"
            opacity="0.8"
            fontWeight="normal"
            lineHeight={1.5}
            textAlign={["center", "center", "left", "left"]}
          >
            Connect to your audience without worrying about censorship
          </Heading>
          <div>
            {currentAccount !== "0x0000" ? (
              <div>
                {accountClub ? (
                  <Link to="/dashboard">
                    <Button colorScheme="blue">Dashboard</Button>
                  </Link>
                ) : (
                  <Button onClick={onOpen} colorScheme="blue">
                    Create Club
                  </Button>
                )}
                <Link to="/clubs">
                  <Button ml={5} colorScheme="blue">
                    Explore Clubs
                  </Button>
                </Link>
              </div>
            ) : (
              <Button colorScheme="blue">Connect Wallet</Button>
            )}
          </div>
        </Stack>
        <Box
          w={{ base: "90%", sm: "60%", md: "50%" }}
          zIndex="999"
          mb={{ base: 12, md: 0 }}
        >
          <Image
            src={image}
            size="100%"
            rounded="1rem"
            boxShadow={
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
            }
          />
        </Box>
      </Flex>

      <Box p={10} m={10} mt="5% ">
        <Heading
          fontWeight={600}
          align="center"
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          p="20"
        >
          We Are Different
        </Heading>
        <SimpleGrid align="center" columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={<Icon as={FcAdvertising} w={20} h={20} />}
            title={"Connect Directly"}
            text={"Own your members"}
          />
          <Feature
            icon={<Icon as={FcOrgUnit} w={20} h={20} />}
            title={"Unstoppable"}
            text={"Everything on Blockchain and Decentralized Storage"}
          />
          <Feature
            icon={<Icon as={FcReddit} w={20} h={20} />}
            title={"NFT Memberships"}
            text={"Mint limited memberships as NFT"}
          />
        </SimpleGrid>
      </Box>

      <Flex align="center" justifyContent="center">
        <Box
          p={10}
          mt="8%"
          w="1200px"
          minH="100vh"
          className="gradient"
          rounded="1rem"
          boxShadow={
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
          }
        >
          <Heading
            fontWeight={600}
            align="center"
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
            pb="10"
          >
            Clubs
          </Heading>
          <Flex justify-content="center" mr="10px">
            <div className="cards">
              {subClubSet && allClubs? allClubs
                .filter((c) => !subClubSet.has(c.address))
                .map((club, index) => (
                  <ClubCard
                    key={index}
                    clubName={club.name}
                    lockAddress={club.address}
                    clubPrice={club.price}
                    totalMembership={"100"}
                    subscribeToClub={async () => {
                      let pubkey = await getPubKeyFromMetamask();
                      const hash = clubService.subscribeToClub(
                        club.address,
                        pubkey
                      );
                      setTransHash(hash);
                      console.log(transHash);
                    }}
                  ></ClubCard>
                )):null}
              {/* {transHash === undefined
                ? toast({
                    position: "top-right",
                    title: `Transaction Failed`,
                    description: `Can't subscribe your club`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  })
                : toast({
                    position: "top-right",
                    title: `Subscribed Successfully`,
                    description: `Transaction Hash : ${transHash}`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  })} */}
            </div>
          </Flex>
        </Box>
      </Flex>

      <div className="footer">
        <Box p={4} mt="10%" className="foot">
          <Container as={Stack} maxW={"4xl"} py={10}>
            <SimpleGrid
              templateColumns={{ sm: "1fr 1fr", md: "2fr 2fr " }}
              spacing={6}
            >
              <Stack spacing={4}>
                <Box>
                  <Text mt={2} fontSize="2xl" fontWeight="800">
                    Unstoppable
                    <br />
                    Clubs
                  </Text>
                </Box>
              </Stack>
              <Stack align={"flex-start"}>
                <Box>
                  <Text fontSize="20px" fontWeight="600">
                    Created By
                  </Text>
                </Box>
                <Text fontSize="15px">
                  Crypto enthusiasts: Mohit Jandwani & Lakshay Maini
                </Text>
                <Text fontSize="15px">
                  FUD (Fake UI Designer): Priya Jandwani
                </Text>
              </Stack>
            </SimpleGrid>
          </Container>
        </Box>
      </div>
    </div>
  );
}
