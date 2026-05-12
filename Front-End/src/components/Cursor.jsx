import React, {useEffect} from 'react'
import { gsap } from 'gsap'

const Cursor = () =>{
    useEffect(() =>{
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            gsap.to("#cursor", {
                x: clientX - 20 / 2,
                y: clientY - 20 / 2,
                duration: 1,
                delay: 0,
                ease: "power.out",
                
            });
        };
        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, []);


    return (
        <div id="cursor" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
        }}></div>
    )
} 


export default Cursor;
