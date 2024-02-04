import {
  Center,
  Text,
  Heading,
  VStack,
  Button,
  Input,
  HStack,
  Container,
  SimpleGrid,
  Box,
  Image,
  Spinner,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const videoUrl = `${apiUrl}/videos`;

  const [isSelected, setIsSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  useEffect(() => {
    fetch(videoUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAllVideos(data);
      });
  }, [uploadSuccessful]);

  const onInputChange = (e) => {
    console.log(e.target.files[0]);
    setIsSelected(true);

    setSelectedFile(e.target.files[0]);
  };
  const onButtonClick = (e) => {
    console.log("Button clicked..");
    e.target.value = "";
  };

  const onFileUpload = (e) => {
    setShowSpinner(true);
    setUploadInProgress(true); // Activa la carga en progreso
    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);
    fetch(videoUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success posting!!");
        setUploadSuccessful(!uploadSuccessful);
        setShowSpinner(false);
        setUploadInProgress(false);
      });
  };
  return (
    <ChakraProvider>
      <Center bg="black" color="white" padding={8}>
        <VStack spacing={7}>
          <Heading>Your Video Gallery</Heading>
          <Text>Take a look at all your uploaded videos!!</Text>
          <HStack>
            <input
              type="file"
              onChange={onInputChange}
              onClick={onButtonClick}
              disabled={uploadInProgress}
            ></input>

            <Button
              size="lg"
              colorScheme="red"
              isDisabled={!isSelected || uploadInProgress} // Desactiva el botón durante la carga
              onClick={onFileUpload}
            >
              Upload Video
            </Button>
            {showSpinner && (
              <Center>
                <Spinner size="xl" />
              </Center>
            )}
          </HStack>
          <Heading>Your Videos</Heading>
          <SimpleGrid columns={3} spacing={8}>
            {allVideos.length !== 0 &&
              allVideos.map((video) => {
                return (
                  <video
                    key={video.id} // Asegúrate de agregar una clave única
                    src={video["video_url"]}
                    autoPlay
                    controls
                    loop
                    preload="auto"
                  ></video>
                );
              })}
          </SimpleGrid>
        </VStack>
      </Center>
    </ChakraProvider>
  );
}

export default App;
