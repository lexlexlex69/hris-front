import { Button,Grid,Box } from "@mui/material";
import React, { useRef,useCallback,useState } from "react";
import './FaceDetect.css';
// Pass imageUrl to FaceDetect component
const FaceDetect = ({ imageUrl }) => {
    
    const cameraPreviewEl = useRef();
    const beginCapture = useCallback(
        async () => {
            if (!cameraPreviewEl.current) {
            return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraPreviewEl.current.srcObject = stream;
            cameraPreviewEl.current.play();
            setCapturing(true);
        },
        [cameraPreviewEl]
    );
    const [capturing, setCapturing] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [imageURL2, setImageURL2] = useState('');
    const takeSnapshot = useCallback(
    () => {
        if (!cameraPreviewEl.current) {
        return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
        return;
        }

        ctx.drawImage(cameraPreviewEl.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageURL(dataUrl)
        // document.getElementById('frame').src = dataUrl;
        // console.log(dataUrl);
      
        // return cameras.length > 0;
        // hasCamera()
        // .then(res=>{
        //     console.log(res)
        // })
    },
    []
    );
    const takeSnapshot2 = useCallback(
    () => {
        if (!cameraPreviewEl.current) {
        return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
        return;
        }

        ctx.drawImage(cameraPreviewEl.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageURL2(dataUrl)
        // document.getElementById('frame').src = dataUrl;
        // console.log(dataUrl);
      
        // return cameras.length > 0;
        // hasCamera()
        // .then(res=>{
        //     console.log(res)
        // })
    },
    []
    );
    const hasCamera = async() => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(device => device.kind === 'videoinput');
            return cameras.length > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    const handleGo = ()=>{
        // cv.onRuntimeInitialized = () => {
        // // Load the images
        // const img1 = imageURL;
        // const img2 = imageURL2;

        // // Draw the images on Canvas elements
        // const canvas1 = imageURL;
        // canvas1.width = img1.width;
        // canvas1.height = img1.height;
        // const context1 = canvas1.getContext('2d');
        // context1.drawImage(img1, 0, 0);

        // const canvas2 = imageURL2;
        // canvas2.width = img2.width;
        // canvas2.height = img2.height;
        // const context2 = canvas2.getContext('2d');
        // context2.drawImage(img2, 0, 0);

        // // Convert the Canvas elements to Mat objects
        // const mat1 = cv.imread(canvas1);
        // const mat2 = cv.imread(canvas2);

        // // Compare the images using the Structural Similarity Index (SSIM)
        // const ssim = cv.matchTemplate(mat1, mat2, cv.TM_CCOEFF_NORMED);

        // // Output the SSIM value to the console
        // console.log(ssim.data32F[0]);
        // };
    }
    return (
        <main className='main'>
            <div className='description'>
            {/* <h1>Which Celebrity Do you look like?</h1> */}
            <a onClick={beginCapture}>Click to take a photo of yourself!</a>
            </div>
            <video className='video' ref={cameraPreviewEl} />
            {capturing &&
            (
                <button className='snapshot' onClick={takeSnapshot}>
                📸 1
                </button>
            )}
            {capturing &&
            (
                <button className='snapshot' onClick={takeSnapshot2}>
                📸 2
                </button>
            )}
            <Grid container>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                        <Box>
                            <h1>Image 1</h1>
                            <img src={imageURL} width={200} height={200}/>
                        </Box>
                        

                        <Box>
                            <h1>Image 2</h1>
                            <img src={imageURL2} width={200} height={200}/>
                        </Box>
                    </Box>
                
                </Grid>
                <Grid item xs={12}>
                    <button onClick={handleGo}>Go</button>
                </Grid>
            </Grid>
            
        </main>
    );
};
export default FaceDetect;