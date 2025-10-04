import { useState } from "react";


export default function Recorder({ onStop }: { onStop: (blob: Blob) => void }) {
const [recording, setRecording] = useState(false);
let mediaRecorder: MediaRecorder;


const startRecording = async () => {
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
mediaRecorder = new MediaRecorder(stream);
const chunks: Blob[] = [];
mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
mediaRecorder.onstop = () => onStop(new Blob(chunks, { type: "audio/webm" }));
mediaRecorder.start();
setRecording(true);
};


const stopRecording = () => {
mediaRecorder.stop();
setRecording(false);
};


return (
<div>
{!recording ? <button onClick={startRecording}>Start</button> : <button onClick={stopRecording}>Stop</button>}
</div>
);
}