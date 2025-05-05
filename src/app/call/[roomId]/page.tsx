"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  deleteDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
};

export default function CallPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId || "";

  const [isDoctor, setIsDoctor] = useState(true); // Set based on user role
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const [pendingCandidates, setPendingCandidates] = useState<RTCIceCandidate[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const roomRef = useRef<ReturnType<typeof doc> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(() => {});

  // Initialize WebRTC connection
  useEffect(() => {
    const setupConnection = async () => {
      try {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnection.current = pc;

        // Add local tracks to the connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendIceCandidate(event.candidate);
          }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          setConnectionStatus(`Connection: ${pc.connectionState}`);
          
          // Handle disconnection
          if (pc.connectionState === "disconnected" || 
              pc.connectionState === "failed" || 
              pc.connectionState === "closed") {
            setConnectionStatus("Disconnected");
          }
        };

        // Handle incoming tracks
        pc.ontrack = (event) => {
          if (event.streams[0]) {
            setRemoteStream(event.streams[0]);
            setConnectionStatus("Connected");
          }
        };

        // Reference to the room document
        if (roomId) {
          roomRef.current = doc(db, "rooms", roomId);
        } else {
          throw new Error("Room ID is undefined");
        }

        // Check if the room exists
        const roomSnapshot = await getDoc(roomRef.current);
        
        if (!roomSnapshot.exists() && isDoctor) {
          // Create a new room if doctor and room doesn't exist
          setConnectionStatus("Creating room...");
          await createOffer(roomRef.current, pc);
        } else if (!roomSnapshot.exists() && !isDoctor) {
          // Handle error if patient tries to join non-existent room
          setConnectionStatus("Error: Room does not exist");
          return;
        } else {
          // Listen for updates on the room document
          setConnectionStatus("Joining room...");
          listenForUpdates(roomRef.current, pc);
        }
      } catch (error) {
        console.error("Error setting up connection:", error);
        setConnectionStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    };

    if (roomId) {
      setupConnection();
    }

    // Cleanup function
    return () => {
      cleanupConnection();
    };
  }, [roomId, isDoctor]);

  // Update remote video when stream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Process pending ICE candidates when remote description is set
  useEffect(() => {
    const processIceCandidates = async () => {
      if (peerConnection.current?.remoteDescription && pendingCandidates.length > 0) {
        for (const candidate of pendingCandidates) {
          try {
            await peerConnection.current.addIceCandidate(candidate);
          } catch (e) {
            console.error("Error adding pending ICE candidate", e);
          }
        }
        setPendingCandidates([]);
      }
    };

    processIceCandidates();
  }, [pendingCandidates, peerConnection.current?.remoteDescription]);

  // Create and send offer
  const createOffer = async (roomRef: ReturnType<typeof doc>, pc: RTCPeerConnection) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      // Convert RTCSessionDescription to plain object for Firestore
      const offerData = {
        type: offer.type,
        sdp: offer.sdp
      };
      
      await setDoc(roomRef, { 
        offer: offerData,
        createdAt: new Date(),
        status: "waiting"
      });
      
      // Start listening for updates after creating the offer
      listenForUpdates(roomRef, pc);
    } catch (error) {
      console.error("Error creating offer:", error);
      setConnectionStatus("Error creating offer");
    }
  };

  // Listen for updates on the room document
  const listenForUpdates = (roomRef: ReturnType<typeof doc>, pc: RTCPeerConnection) => {
    const unsubscribe = onSnapshot(roomRef, async (docSnapshot: DocumentSnapshot<DocumentData>) => {
      const data = docSnapshot.data();
      if (!data) return;

      try {
        // Handle offer (patient side)
        if (data.offer && !isDoctor && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          // Convert answer to plain object for Firestore
          const answerData = {
            type: answer.type,
            sdp: answer.sdp
          };
          
          await updateDoc(roomRef, { 
            answer: answerData,
            status: "connected" 
          });
        }

        // Handle answer (doctor side)
        if (data.answer && isDoctor && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          await updateDoc(roomRef, { status: "connected" });
        }

        // Handle ICE candidates
        if (data.candidates) {
          for (const candidateData of data.candidates) {
            const candidate = new RTCIceCandidate(candidateData);
            
            if (pc.remoteDescription) {
              await pc.addIceCandidate(candidate);
            } else {
              // Store candidate for later if remote description isn't set yet
              setPendingCandidates(prev => [...prev, candidate]);
            }
          }
        }
      } catch (error) {
        console.error("Error processing room updates:", error);
      }
    });

    unsubscribeRef.current = unsubscribe;
  };

  // Send ICE candidate to the room document
  const sendIceCandidate = async (candidate: RTCIceCandidate) => {
    if (!roomRef.current) return;
    
    try {
      // Convert RTCIceCandidate to plain object
      const candidateData = {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
        usernameFragment: candidate.usernameFragment
      };
      
      await updateDoc(roomRef.current, {
        candidates: arrayUnion(candidateData),
      });
    } catch (error) {
      console.error("Error sending ICE candidate:", error);
    }
  };

  // Clean up connection
  const cleanupConnection = () => {
    // Stop all tracks in the local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Unsubscribe from Firestore
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
  };

  // Handle ending the call
  const handleEndCall = async () => {
    cleanupConnection();
    
    // Delete or update the room document
    if (roomRef.current) {
      try {
        if (isDoctor) {
          // Doctor can delete the room
          await deleteDoc(roomRef.current);
        } else {
          // Patient can mark as disconnected
          await updateDoc(roomRef.current, { status: "ended" });
        }
      } catch (error) {
        console.error("Error ending call in database:", error);
      }
    }
    
    // Redirect to home or another page
    router.push("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Video Call Room: {roomId}</h1>
      <p className="mb-4 text-gray-600">{connectionStatus}</p>

      <div className="relative w-full h-[70vh] bg-black rounded-xl overflow-hidden">
        {/* Local video (small picture-in-picture) */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute bottom-4 right-4 w-40 h-40 object-cover border-2 border-white rounded-lg z-10"
        />

        {/* Remote video (full screen) */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white text-lg">Waiting for other participant...</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
          onClick={handleEndCall}
        >
          End Call
        </button>
      </div>
    </div>
  );
}