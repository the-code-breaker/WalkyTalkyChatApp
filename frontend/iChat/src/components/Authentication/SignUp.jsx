import React, { useEffect, useState } from 'react'
import { Button, FormControl, FormHelperText, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import {useHistory} from 'react-router-dom';
import axios from 'axios'

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const toast = useToast();

    const handleClick = () =>{
        setShow(!show);
    }
   
    const postDetails = (pic) =>{
        setLoading(true);
        if(pic === undefined){
               toast({
                 title: "Please Select an Image!",
                 status: "warning",
                 duration: 5000,
                 isClosable: true,
                 position: "bottom",
               });
               return;
        }
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
          const data = new FormData();
          data.append("file", pic);
          data.append("upload_preset", "chatapp");
          data.append("cloud_name", "dszagws9u");
          fetch("https://api.cloudinary.com/v1_1/dszagws9u/image/upload", {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              setPic(data.url.toString());
              // console.log(data.url.toString())
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        } else {
          toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return
        }
    }
    const submitHandler = async  () =>{
          setLoading(true);
          if(!name || !email || !password || !confirmPassword){
            toast({
              title: "Please Fill all the Fields",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
            return;
          }

          if(password !== confirmPassword){
            toast({
              title: "Passwords not Matched",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
            return;
          }


          try{
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            const { data } = await axios.post(
              '/api/user',
               {name, email, password, pic}, 
                config
            );
             toast({
               title: "Registration Successful",
               status: "success",
               duration: 5000,
               isClosable: true,
               position: "bottom",
              });
              
              localStorage.setItem("userInfo", JSON.stringify(data))
              history.push('/chats')
             setLoading(false)
            }catch(err){
              toast({
                title: "Error Occured!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false)
          }

    };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="username" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="your name"
          border={"1px solid"}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="youremail@gamil.com"
          border={"1px solid"}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="***********"
            border={"1px solid"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="***********"
            border={"1px solid"}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <FormControl margin={"1.1rem"}>
        <Button colorScheme="blue" w={"100%"}
           onClick={submitHandler}
           isLoading={loading}
        >
          Signup
        </Button>
      </FormControl>
    </VStack>
  );
}

export default SignUp