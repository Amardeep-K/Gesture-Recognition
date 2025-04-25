import React, { useContext, useState, useEffect, useRef } from "react";
import { VideoCallContext } from "../../context/Context";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCallEnd, MdOutlineMessage, MdIosShare } from "react-icons/md";
import { Button, Col, Row } from "react-bootstrap";
import { Avatar } from "antd";
import { FaUserLarge, FaVolumeXmark } from "react-icons/fa6";
import { socket } from "../../config/config";
import Loading from "../Loading/Loading";
import ChatModal from "../Chat/Chat";
import * as fp from "fingerpose";
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "./utilities"; // Assuming this is a utility file for drawing on canvas
import "./Video.css";
import thumbs_up from '../../assets/thumbs_up.png';
import victory from '../../assets/victory.png';
import * as tf from '@tensorflow/tfjs';

const Video = () => {
  const {
    call,
    isCallAccepted,
    myVideoRef,
    partnerVideoRef,
    userStream,
    name,
    isCallEnded,
    sendMessage: sendMessageFunc,
    receivedMessage,
    chatMessages,
    setChatMessages,
    endCall,
    opponentName,
    isMyVideoActive,
    isPartnerVideoActive,
    toggleVideo,
    isMyMicActive,
    isPartnerMicActive,
    toggleMicrophone,
    toggleFullScreen,
    toggleScreenSharingMode,
  } = useContext(VideoCallContext);

  const [sendMessage, setSendMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [emoji, setEmoji] = useState(null); // State for hand gesture
  const [isHandGestureDetected, setIsHandGestureDetected] = useState(false); // To track gesture detection
  const webcamRef = useRef(null); // For hand gesture webcam
  const canvasRef = useRef(null); // For hand gesture drawing

  const images = { thumbs_up, victory };

  // Initialize the Handpose model
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");

    // Start the gesture detection
    setInterval(() => {
      detectHandGesture(net);
    }, 100); // Run detection at an interval
  };

  // Function to detect hand gestures
  const detectHandGesture = async (net) => {
    const video = partnerVideoRef.current; // Use partner's video ref for gesture detection

    // Ensure the video element is ready
    if (video && video.readyState === 4) {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set canvas size to match video dimensions
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Detect hands from the video
      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);

        // Estimate gestures from the hand landmarks
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map((prediction) => prediction.score);
          const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));

          setEmoji(gesture.gestures[maxConfidence].name);
          setIsHandGestureDetected(true); // Mark gesture as detected
        } else {
          setIsHandGestureDetected(false); // Reset when no gesture is detected
        }
      }

      // Draw the detected hand landmarks on the canvas
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    runHandpose(); // Start handpose detection once component mounts
  }, []);

  useEffect(() => {
    const handleMessage = ({ message, senderName }) => {
      const newMessage = {
        message,
        type: "received",
        senderName,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev, newMessage]);
      if (!isModalVisible) {
        setHasUnreadMessages(true);
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [setChatMessages, isModalVisible]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (!isModalVisible) {
      setHasUnreadMessages(false);
    }
  };

  const onSearch = (message) => {
    if (message) {
      sendMessageFunc(message);
      setSendMessage("");
    }
  };

  return (
    <div>
      <div className="video-container">
        <Row>
          {userStream ? (
            <Col xl={isCallAccepted && 6} md={isCallAccepted && 6} sm={isCallAccepted && 12}>
              <div className="video-paper">
                <h5 className="video-name">{name || "Name"}</h5>
                <div className="video-avatar">
                  <video
                    playsInline
                    muted
                    ref={myVideoRef}
                    onClick={toggleFullScreen}
                    autoPlay
                    className={isCallAccepted ? "video-main" : "video-small"}
                    style={{ opacity: isMyVideoActive ? 1 : 0 }}
                  />
                  <Avatar className={`avatar-background ${isMyVideoActive ? "avatar-hidden" : "avatar-visible"}`} size={100}>
                    {name?.[0]?.toUpperCase()}
                  </Avatar>
                  {!isMyMicActive && <FaVolumeXmark className="mic-off-icon" size={42} />}
                </div>
              </div>
            </Col>
          ) : (
            <Loading />
          )}

          {isCallAccepted && !isCallEnded && partnerVideoRef && (
            <Col xl={isCallAccepted && 6} md={isCallAccepted && 6} sm={isCallAccepted && 12}>
              <div className="video-paper">
                <h5 className="video-name">{call.name || opponentName || "Name"}</h5>
                <div className="video-avatar">
                  <video
                    playsInline
                    ref={partnerVideoRef}
                    onClick={toggleFullScreen}
                    autoPlay
                    className="video-main"
                    style={{ opacity: isPartnerVideoActive ? 1 : 0 }}
                  />
                  <Avatar className={`avatar-background ${isPartnerVideoActive ? "avatar-hidden" : "avatar-visible"}`} size={100}>
                    {(opponentName || call.name)?.slice(0, 1).toUpperCase()}
                  </Avatar>
                  {!isPartnerMicActive && <FaVolumeXmark className="mic-off-icon" size={42} />}
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>

      {userStream && (
        <div className="video-controls">
          <Button onClick={toggleMicrophone} className="video-control-btn">
            {isMyMicActive ? <MdMic size={25} /> : <MdMicOff size={25} />}
          </Button>
          <Button onClick={toggleVideo} className="video-control-btn">
            {isMyVideoActive ? <MdVideocam size={25} /> : <MdVideocamOff size={25} />}
          </Button>
          {isCallAccepted && !isCallEnded && (
            <Button className="video-control-btn" onClick={toggleScreenSharingMode}>
              <MdIosShare size={23} />
            </Button>
          )}
          {isCallAccepted && !isCallEnded && (
            <Button className="video-control-btn" onClick={toggleModal}>
              <MdOutlineMessage size={22} />
              {hasUnreadMessages && <div className="notification-dot" />}
            </Button>
          )}
          {isCallAccepted && !isCallEnded && (
            <Button className="decline-call-btn" onClick={endCall}>
              <MdCallEnd size={22} />
            </Button>
          )}
        </div>
      )}

      {/* Hand Gesture Canvas */}
      <canvas ref={canvasRef} style={{ position: "fixed", zIndex: 10, width: "30%", right:"10"  }} />
      {emoji && <img src={images[emoji]} alt="emoji" style={{ position: "absolute", bottom: "10%", left: "10%", height:"100px"}} />}

      <ChatModal
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        chatMessages={chatMessages}
        sendMessage={sendMessage}
        setSendMessage={setSendMessage}
        onSearch={onSearch}
        receivedMessage={receivedMessage}
      />
    </div>
  );
};

export default Video;
