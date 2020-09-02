import { useEffect, useState } from 'react';

/**
 * Returns a setter for setting the node ref and entry to see if the node is intersecting
 * @observerOptions is the Options Object passed to the intersection observer
 * @triggerOnce will specify if the observer should only get isIntersecting once or also retrigger if it goes out of viewport and back in
 * Example:
 * const [ref, entry] = useIntersect({ rootMargin: "20px", threshold: 0.9 });
 * console.log(entry.intersectionRatio)
 * <Component ref={ref} />
 */
const useIntersect = (observerOptions:IntersectionObserverInit = {}, triggerOnce:boolean = false) => {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();
    const [observer, setObserver] = useState(undefined);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [node, ref] = useState<HTMLDivElement>(null);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (process.browser && window.IntersectionObserver) {
            const obv = new window.IntersectionObserver(([newEntry]) => {
                if (triggerOnce && !isIntersecting) {
                    if (newEntry.isIntersecting) setIsIntersecting(true);
                    setEntry(newEntry);
                } else if (!triggerOnce) {
                    setEntry(newEntry);
                }
            }, observerOptions);
            setObserver(obv);
            return () => obv.disconnect();
        }
        setEntry({ isIntersecting: true } as IntersectionObserverEntry);
        setIsIntersecting(true);
    }, [isIntersecting]);

    useEffect(() => {
        if (observer) {
            observer.disconnect();
            if (node) observer.observe(node);
            return () => observer.disconnect();
        }
        return undefined;
    }, [node]);

    return { ref, entry, isIntersecting };
};
export default useIntersect;
