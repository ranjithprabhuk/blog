---
title: "WebRTC: Building Real-Time Communication in the Browser"
slug: "webrtc-real-time-communication-browser"
excerpt: "A deep dive into WebRTC — how it works under the hood, its core APIs, signaling, NAT traversal, and how to build peer-to-peer audio, video, and data channels from scratch."
author: "Ranjithprabhu K"
date: 2026-02-11
updated: 2026-02-11
category: "Frontend"
tags: ["webrtc", "real-time", "javascript", "networking"]
featuredImage: "./assets/hero.jpg"
readingTime: 12
draft: false
seo:
  ogImage: "./assets/hero.jpg"
  canonicalUrl: ""
---

# WebRTC: Building Real-Time Communication in the Browser

WebRTC (Web Real-Time Communication) lets browsers talk directly to each other — voice, video, and arbitrary data — without routing through a server. It powers Google Meet, Discord, and countless other real-time apps. In this post, we'll break down how WebRTC works under the hood and build a working peer-to-peer connection from scratch.

## How WebRTC Works — The Big Picture

At its core, WebRTC establishes a **peer-to-peer** connection between two browsers. But getting there isn't straightforward because of firewalls, NATs, and the fact that browsers don't know each other's network addresses.

Here's the high-level flow:

1. **Signaling** — Peers exchange connection metadata (SDP offers/answers) through your server
2. **ICE Candidate Gathering** — Each peer discovers its possible network paths using STUN/TURN servers
3. **Connection** — Peers negotiate the best direct path and establish a secure DTLS/SRTP connection
4. **Media/Data Flow** — Audio, video, or data flows directly between browsers

```
Browser A                    Your Server                    Browser B
   |                             |                             |
   |--- SDP Offer -------------->|                             |
   |                             |--- SDP Offer -------------->|
   |                             |                             |
   |                             |<--- SDP Answer -------------|
   |<--- SDP Answer -------------|                             |
   |                             |                             |
   |--- ICE Candidates -------->|--- ICE Candidates --------->|
   |<--- ICE Candidates --------|<--- ICE Candidates ---------|
   |                             |                             |
   |<========== Direct P2P Connection ========================>|
```

## The Three Core APIs

WebRTC gives you three main APIs to work with:

### 1. RTCPeerConnection — The Heart of WebRTC

This is the main API that handles the entire peer-to-peer connection lifecycle — negotiation, ICE gathering, DTLS handshake, and media transport.

```javascript
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:your-turn-server.com:3478",
      username: "user",
      credential: "pass",
    },
  ],
});

// Handle incoming tracks from the remote peer
pc.ontrack = (event) => {
  const remoteVideo = document.getElementById("remoteVideo");
  remoteVideo.srcObject = event.streams[0];
};

// Handle ICE candidates — send them to the remote peer via signaling
pc.onicecandidate = (event) => {
  if (event.candidate) {
    signalingServer.send({
      type: "ice-candidate",
      candidate: event.candidate,
    });
  }
};
```

### 2. MediaStream — Capturing Audio and Video

`getUserMedia` captures the user's camera and microphone. `getDisplayMedia` captures screen shares.

```javascript
// Get camera + microphone
const localStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
});

// Display local video
document.getElementById("localVideo").srcObject = localStream;

// Add tracks to the peer connection
localStream.getTracks().forEach((track) => {
  pc.addTrack(track, localStream);
});
```

### 3. RTCDataChannel — Arbitrary Peer-to-Peer Data

Data channels let you send any data directly between peers — chat messages, file transfers, game state, whatever you need.

```javascript
// Caller creates the data channel
const dataChannel = pc.createDataChannel("chat", {
  ordered: true, // guarantee order (like TCP)
});

dataChannel.onopen = () => {
  dataChannel.send("Hello from peer A!");
};

dataChannel.onmessage = (event) => {
  console.log("Received:", event.data);
};

// Callee listens for incoming data channels
pc.ondatachannel = (event) => {
  const channel = event.channel;
  channel.onmessage = (e) => console.log("Received:", e.data);
};
```

## Signaling — The Part WebRTC Doesn't Handle

WebRTC intentionally leaves signaling up to you. You need a mechanism to exchange SDP offers/answers and ICE candidates between peers before the direct connection is established.

Common approaches:

- **WebSocket server** — Most common, low latency
- **HTTP polling** — Simple but slower
- **Firebase Realtime Database** — Quick prototyping
- **Any message relay** — Even copy-paste works for testing

Here's a complete signaling flow using WebSockets:

```javascript
const ws = new WebSocket("wss://your-signaling-server.com");

// --- Caller side ---
async function startCall() {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  ws.send(
    JSON.stringify({
      type: "offer",
      sdp: pc.localDescription,
    })
  );
}

// --- Callee side ---
ws.onmessage = async (message) => {
  const data = JSON.parse(message.data);

  switch (data.type) {
    case "offer":
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ws.send(JSON.stringify({ type: "answer", sdp: pc.localDescription }));
      break;

    case "answer":
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      break;

    case "ice-candidate":
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      break;
  }
};
```

## NAT Traversal — STUN and TURN

Most devices sit behind NATs and firewalls. WebRTC uses **ICE** (Interactive Connectivity Establishment) to find a working path between peers.

### STUN — Discovering Your Public Address

A STUN server simply tells your browser its public IP and port. It's lightweight and free — Google runs public STUN servers.

```
Browser -----> STUN Server
         "What's my public IP?"

Browser <----- STUN Server
         "You're 203.0.113.5:54321"
```

This works when both peers can reach each other directly (no symmetric NAT).

### TURN — The Fallback Relay

When direct connection fails (roughly 10-15% of cases), TURN relays all media through a server. It's expensive in bandwidth but guarantees connectivity.

```javascript
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:turn.example.com:3478",
      username: "user",
      credential: "pass",
    },
    {
      urls: "turns:turn.example.com:5349", // TURN over TLS
      username: "user",
      credential: "pass",
    },
  ],
});
```

### ICE Candidate Types

ICE gathers candidates in priority order:

| Type | Description | Speed |
|------|-------------|-------|
| `host` | Local network address | Fastest |
| `srflx` | Public address via STUN (Server Reflexive) | Fast |
| `prflx` | Discovered during connectivity checks (Peer Reflexive) | Fast |
| `relay` | Routed through TURN server | Slowest |

## Building a Complete Video Call

Let's put it all together into a working video call:

```javascript
class VideoCall {
  constructor(signalingUrl) {
    this.ws = new WebSocket(signalingUrl);
    this.pc = null;
    this.localStream = null;

    this.ws.onmessage = (msg) => this.handleSignal(JSON.parse(msg.data));
  }

  async init() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    document.getElementById("localVideo").srcObject = this.localStream;

    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.localStream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.localStream);
    });

    this.pc.ontrack = (event) => {
      document.getElementById("remoteVideo").srcObject = event.streams[0];
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.ws.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    this.pc.onconnectionstatechange = () => {
      console.log("Connection state:", this.pc.connectionState);
      if (this.pc.connectionState === "disconnected") {
        this.handleDisconnect();
      }
    };
  }

  async call() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.ws.send(JSON.stringify({ type: "offer", sdp: offer }));
  }

  async handleSignal(data) {
    switch (data.type) {
      case "offer":
        await this.pc.setRemoteDescription(data.sdp);
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        this.ws.send(JSON.stringify({ type: "answer", sdp: answer }));
        break;

      case "answer":
        await this.pc.setRemoteDescription(data.sdp);
        break;

      case "ice-candidate":
        if (data.candidate) {
          await this.pc.addIceCandidate(data.candidate);
        }
        break;
    }
  }

  toggleMute() {
    const audioTrack = this.localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    return audioTrack.enabled;
  }

  toggleVideo() {
    const videoTrack = this.localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    return videoTrack.enabled;
  }

  handleDisconnect() {
    this.pc.close();
    this.localStream.getTracks().forEach((track) => track.stop());
  }
}

// Usage
const call = new VideoCall("wss://your-server.com/signal");
await call.init();
call.call(); // initiate the call
```

## Handling Real-World Challenges

### Renegotiation — Adding/Removing Tracks Mid-Call

Users might toggle their camera or start a screen share during a call. This requires renegotiation:

```javascript
async function startScreenShare() {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  });

  const screenTrack = screenStream.getVideoTracks()[0];
  const sender = pc.getSenders().find((s) => s.track?.kind === "video");

  // Replace the camera track with the screen track
  await sender.replaceTrack(screenTrack);

  // Switch back to camera when screen share stops
  screenTrack.onended = async () => {
    const cameraTrack = localStream.getVideoTracks()[0];
    await sender.replaceTrack(cameraTrack);
  };
}
```

### Connection Quality Monitoring

WebRTC exposes detailed statistics through `getStats()`:

```javascript
async function monitorConnection() {
  const stats = await pc.getStats();

  stats.forEach((report) => {
    if (report.type === "inbound-rtp" && report.kind === "video") {
      console.log({
        packetsReceived: report.packetsReceived,
        packetsLost: report.packetsLost,
        bytesReceived: report.bytesReceived,
        framesPerSecond: report.framesPerSecond,
        jitter: report.jitter,
      });
    }
  });
}

// Poll every 2 seconds
setInterval(monitorConnection, 2000);
```

### Adaptive Bitrate

Adjust quality based on network conditions:

```javascript
async function adjustBitrate(maxBitrate) {
  const sender = pc.getSenders().find((s) => s.track?.kind === "video");
  const params = sender.getParameters();

  if (!params.encodings || params.encodings.length === 0) {
    params.encodings = [{}];
  }

  params.encodings[0].maxBitrate = maxBitrate;
  await sender.setParameters(params);
}

// Reduce to 500kbps on poor connections
adjustBitrate(500000);

// Full quality on good connections
adjustBitrate(2500000);
```

## SFU vs Mesh — Scaling Beyond Two Peers

For group calls, you have two main architectures:

### Mesh (Direct P2P)
Each peer connects to every other peer. Simple but doesn't scale — with N peers, each sends N-1 streams.

```
   A --- B
   |  X  |
   C --- D

   4 peers = 12 connections
```

### SFU (Selective Forwarding Unit)
All peers send their stream to a central server, which forwards selectively to others. Used by Meet, Zoom, Teams.

```
   A --\
   B --- SFU
   C --/    \--- All peers receive
   D --/        selected streams

   4 peers = 4 upload + 4 download connections
```

Popular open-source SFUs:
- **mediasoup** — Node.js based, excellent TypeScript support
- **Janus** — C-based, very mature and feature-rich
- **LiveKit** — Go-based, cloud-native, great developer experience
- **Pion** — Go WebRTC library for building custom solutions

## Security in WebRTC

WebRTC has strong security built in:

- **DTLS** — All data channels are encrypted (TLS equivalent for UDP)
- **SRTP** — All media is encrypted
- **Mandatory encryption** — There's no way to send unencrypted media
- **Origin isolation** — Camera/mic access requires user permission per origin

The only trust point is your signaling server — if it's compromised, an attacker could perform a man-in-the-middle attack by substituting their own SDP. Always use WSS (WebSocket Secure) for signaling.

## Key Takeaways

1. **WebRTC is peer-to-peer** — Media flows directly between browsers after the initial signaling handshake
2. **Signaling is your responsibility** — Use WebSockets, HTTP, or any message relay to exchange SDP and ICE candidates
3. **STUN discovers, TURN relays** — STUN finds your public IP; TURN is the fallback when direct connection fails
4. **Data channels are powerful** — Send any data P2P with configurable reliability (ordered/unordered, reliable/unreliable)
5. **Use an SFU for group calls** — Mesh doesn't scale; SFUs like mediasoup or LiveKit handle the complexity
6. **Security is built in** — DTLS and SRTP encryption is mandatory and automatic

## Further Reading

- [WebRTC API - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebRTC for the Curious](https://webrtcforthecurious.com/) — Free open-source book
- [High Performance Browser Networking - WebRTC Chapter](https://hpbn.co/webrtc/)
- [mediasoup Documentation](https://mediasoup.org/documentation/)
