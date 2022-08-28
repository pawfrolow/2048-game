import { useRef } from "react";
import { DirectionsType } from "../types";
import useEvent from "./useEvent";

const useSwipe = (callback: (event: DirectionsType) => void) => {
    const touchstartX = useRef(0);
    const touchstartY = useRef(0);
    const touchendX = useRef(0);
    const touchendY = useRef(0);

    const pageWidth = window.innerWidth || document.body.clientWidth;
    const treshold = Math.max(1, Math.floor(0.01 * pageWidth));
    const limit = Math.tan(((45 * 1.5) / 180) * Math.PI);

    const gestureZone = useRef(document.body);

    useEvent(
        "touchstart",
        (event: TouchEvent) => {
            touchstartX.current = event.changedTouches[0].screenX;
            touchstartY.current = event.changedTouches[0].screenY;
        },
        gestureZone.current
    );

    useEvent(
        "touchend",
        (event: TouchEvent) => {
            touchendX.current = event.changedTouches[0].screenX;
            touchendY.current = event.changedTouches[0].screenY;
            handleGesture();
        },
        gestureZone.current
    );

    const handleGesture = () => {
        let x = touchendX.current - touchstartX.current;
        let y = touchendY.current - touchstartY.current;
        let xy = Math.abs(x / y);
        let yx = Math.abs(y / x);
        if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
            if (yx <= limit) {
                if (x < 0) {
                    callback("left");
                    return;
                } else {
                    callback("right");
                    return;
                }
            }
            if (xy <= limit) {
                if (y < 0) {
                    callback("up");
                    return;
                } else {
                    callback("down");
                    return;
                }
            }
        } else {
            //tap
        }
    };
};

export default useSwipe;
