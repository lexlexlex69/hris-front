import React from 'react';
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { Box, Button } from '@mui/material';
import { Close } from '@mui/icons-material';


const DndcomponentIPCR = ({ title, setAction, fileName }) => {

    const [dragActive, setDragActive] = React.useState(false);
    // ref
    const inputRef = React.useRef(null);

    // handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // handleFiles(e.dataTransfer.files);
            setAction(e.target.files[0])
        }
    };

    // triggers when file is selected with click
    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            // handleFiles(e.target.files);
            setAction(e.target.files[0])
        }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div className='DnDApplication'>
            <form id="form-file-upload2" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={inputRef} type="file" id="input-file-upload2" onChange={handleChange} />
                <label id="label-file-upload2" htmlFor="input-file-upload2" className={dragActive ? "drag-active" : ""}>
                    <Box display='flex' gap={.5} flexDirection='column'>
                        {fileName?.name ? (
                            <>
                                <Typography variant="body2" sx={{ color: 'success.main' }}>{fileName?.name}</Typography>
                                <Typography variant="body2" sx={{ color: 'error.main' }}>( click anywhere inside to re-try )</Typography>
                            </>
                        ) : (
                            <>
                                <p>(.jpg, .png, .jpeg, .pdf)</p>
                                <p>Drag and drop your file here or</p>
                                <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
                            </>
                        )}
                    </Box>
                </label>
                {dragActive && <div id="drag-file-element2" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            </form>
            <Box display='flex' justifyContent='space-between'>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' gap={1}>
                <Typography variant="body1" color="primary" align='center'>{title}</Typography>
                <Tooltip title="Cancel/remove uploaded file">
                    <span>
                        {fileName?.name && <Close sx={{ borderRadius: '100%', p: .2, fontSize: 20, bgcolor: 'error.main', color: '#fff', cursor: 'pointer' }} onClick={() => setAction('')} />}
                    </span>
                </Tooltip>
            </Box>
        </div>
    );
};

export default DndcomponentIPCR;