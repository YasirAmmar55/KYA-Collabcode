import { useState, useEffect, useRef } from 'react';

export const useWebRTC = (roomId, userId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  
  const peerConnections = useRef({});
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  useEffect(() => {
    // Initialize local stream
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        localStreamRef.current = stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initLocalStream();

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, []);

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const newMutedState = !isAudioMuted;
        audioTracks[0].enabled = !newMutedState;
        setIsAudioMuted(newMutedState);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const newVideoState = !isVideoOff;
        videoTracks[0].enabled = !newVideoState;
        setIsVideoOff(newVideoState);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      screenStreamRef.current = stream;
      setIsSharingScreen(true);

      // Replace video track in all peer connections
      const videoTrack = stream.getVideoTracks()[0];
      Object.values(peerConnections.current).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      videoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    setIsSharingScreen(false);

    // Restore camera video track
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      Object.values(peerConnections.current).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
  };

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send candidate to signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStreams(prev => [
        ...prev.filter(s => s.id !== event.streams[0].id),
        event.streams[0]
      ]);
    };

    peerConnections.current[peerId] = pc;
    return pc;
  };

  return {
    localStream,
    remoteStreams,
    isAudioMuted,
    isVideoOff,
    isSharingScreen,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    createPeerConnection
  };
};