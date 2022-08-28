import { useEffect, useRef } from "react";

const useEvent = (
    eventName: string,
    eventHandler: any,
    element?: HTMLDivElement | HTMLElement
) => {
    const cbRef = useRef(eventHandler);

    useEffect(() => {
        cbRef.current = eventHandler;
    }); // update after each render

    useEffect(() => {
        const cb = (e: any) => cbRef.current(e); // then use most recent cb value
        if (element) {
            element.addEventListener(eventName, cb);
        } else {
            window.addEventListener(eventName, cb);
        }
        return () => {
            if (element) {
                element.removeEventListener(eventName, cb);
            } else {
                window.removeEventListener(eventName, cb);
            }
        };
    }, [eventName]);
    return;
};

export default useEvent;
