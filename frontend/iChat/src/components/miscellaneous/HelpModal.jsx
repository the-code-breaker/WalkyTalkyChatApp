import React, { useState } from 'react'
import {
  Avatar,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Text,
} from "@chakra-ui/react";
import "./helpmodal.css"
    const HelpModal = ({ user, children }) => {
      const { isOpen, onOpen, onClose } = useDisclosure();


        const sub = document.getElementById("sub");
        const formid = document.getElementById("formid");
        const [data, setData] = useState({
          name: "",
          email: "",
          message: "",
        });
        const { name, email, message } = data;

        const handleChange = (e) =>
          setData({ ...data, [e.target.name]: e.target.value });

        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const response = await fetch(
              "https://v1.nocodeapi.com/souravsharma000/google_sheets/IXYkqXIEbNLzIzid?tabId=Sheet1",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify([
                  [new Date().toLocaleString(), name, email, message],
                ]),
              }
            );
            await response.json();
            sub.style.display = "block";
            sub.style.color = "gold";
            formid.style.display = "none";
            setData({ ...data, name: "", email: "", message: "" });
          } catch (err) {
            console.log(err);
          }
        };

        const handleEvent = () =>{

        }



      return (
        <>
          {children ? (
            <span onClick={onOpen}>{children}</span>
          ) : (
            <IconButton
              d={{ base: "flex" }}
              icon={<ViewIcon />}
              onClick={onClose}
            />
          )}

          <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent>
              <>
                <div className="contact-area">
                  <div className="contact-box1">
                    <div className="contact-inner-box1">
                      <div className="contact-form">
                        <h1 type="submit" id="sub" style={{ display: "none" }}>
                          {" "}
                          Your message has been sent successfully...{" "}
                          <i class="fa-solid fa-check"></i>
                        </h1>
                        <form
                          method=""
                          name="contact-us"
                          id="formid"
                          onSubmit={handleSubmit}
                        >
                           <p style={{all:"unset", color:"black"}}>You will get response within 2hours...</p>
                          <label htmlFor="name">
                            Your name <sperscript>*</sperscript>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            required
                          />
                          <label htmlFor="email" required>
                            Your email <sperscript>*</sperscript>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                          />
                          <p>Your Issue <sperscript>*</sperscript>
                          </p>
                          <textarea
                            cols="10"
                            rows="3"
                            name="message"
                            value={message}
                            onChange={handleChange}
                            placeholder="Type your issue here"
                            required
                          ></textarea>
                          <button type="submit" onClick={handleEvent}>
                            {" "}
                            Submit{" "}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </ModalContent>
          </Modal>
        </>
      );
    };

export default HelpModal