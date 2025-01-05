import React,{useEffect, useState,useRef} from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  ListItemSecondaryAction,
  Button,
  Box,
  Typography
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InboxIcon from "@mui/icons-material/Inbox";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from '@mui/icons-material/Star';
import { grey } from '@mui/material/colors';
export default function DraggableList(props){
    const [items,setItems] = useState([])
    useEffect(()=>{
        setItems(props.data)
    },[])
    const getItems = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `item-${k}`,
        primary: `item ${k}`,
        secondary: k % 2 === 0 ? `Whatever for ${k}` : undefined
    }));

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
    });

    const getListStyle = (isDraggingOver) => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
    });
    const onDragEnd = (result) => {
        // console.log(result)
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        setItems(reorder(
            items,
            result.source.index,
            result.destination.index
        ));
    }
    const handleSave = ()=>{
        props.save(items)
    }
    return(
        <Box>
        <Typography sx={{color:grey[800],fontStyle:'italic',fontSize:'.9rem',textAlign:'right'}}>Please Drag list to reorder </Typography>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <Box ref={provided.innerRef}>
                <List style={getListStyle(snapshot.isDraggingOver)}>
                    {items.map((item, index) => (
                    <Draggable key={item.training_shortlist_id} draggableId={`item-${item.training_shortlist_id}`} index={index}>
                        {(provided, snapshot) => (
                        <ListItem
                            ContainerComponent="li"
                            ContainerProps={{ ref: provided.innerRef }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}
                            sx={{'&:hover':{background:grey[100]}}}
                        >
                            <ListItemIcon>
                            # &nbsp;{index+1}
                            {/* <StarIcon /> &nbsp;{index+1} */}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.fname}
                                secondary={item.lname}
                            />
                            <ListItemSecondaryAction>
                            {/* <IconButton>
                                <EditIcon />
                            </IconButton> */}
                            </ListItemSecondaryAction>
                        </ListItem>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </List>
                </Box>
            )}
            </Droppable>
        </DragDropContext>
        <Box sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
            <Button variant='contained' className='custom-roundbutton' color='success' size='small' onClick = {handleSave}>Save</Button>
            <Button variant='contained' className='custom-roundbutton' color='error' size='small'>Close</Button>
        </Box>
        </Box>
    )
}