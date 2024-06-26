import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel} from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import React, { useState } from 'react';
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";


const Sign = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => { 
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'please select an image',
                //   description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name","dtym9rtug");
            fetch("https://api.cloudinary.com/v1_1/dtym9rtug/image/upload", {
                method: 'post',
                body: data,
            })
                .then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
});
        } else {
                toast({
                title: 'please select an image',
                //   description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
                });
            setLoading(false);
            return;
        }
    };
    const submitHandler = async () => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
        toast({
                title: 'please fill all the feilds',
                //   description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
                });
            setLoading(false);
            return;
        }

        if(password !== confirmpassword){
        toast({
                title: 'passwords do not match',
                //   description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
                });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post("api/user", { name, email, password, pic },config);
            toast({
                title: 'registration is successful',
                //   description: "We've created your account for you.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            
            localStorage.setItem('userInfo', JSON.stringify(data));

            setLoading(false);
            history.push("/chats");
        } catch (error) {
            toast({
                title: 'Error occured',
                //   description: "We've created your account for you.",
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            
        }

    };

    return (
        <VStack spacing='5px' color='black'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input
                    type={show ? "text":"password"}
                    placeholder='Enter Your Password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>confirm Password</FormLabel>
                <InputGroup>
                <Input
                    type={show ? "text":"password"}
                    placeholder='confirm password'
                    onChange={(e) => setconfirmpassword(e.target.value)}
                />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic' isRequired>
                <FormLabel>upload your pic</FormLabel>
                <InputGroup>
                <Input
                    type= "file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    );
};

export default Sign;
