import React,{useState} from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import FirstStep from '../../../../.././assets/img/ob-oft/1.png';
import SecondStep from '../../../../.././assets/img/ob-oft/2.png';
import ThirdStep from '../../../../.././assets/img/ob-oft/3.png';
import FourthStep from '../../../../.././assets/img/ob-oft/4.png';
export default function OBOFTInstruction(props){
    return(
        <Carousel showArrows={true}>
            <div>
                <img src={FirstStep}/>
                <p className="legend">First Step</p>
            </div>
            <div>
                <img src={SecondStep}/>
                <p className="legend">Second Step</p>
            </div>
            <div>
                <img src={ThirdStep}/>
                <p className="legend">Third Step</p>
            </div>
            <div>
                <img src={FourthStep}/>
                <p className="legend">Last Step</p>
            </div>
        </Carousel>
    )
}