/* eslint-disable jsx-a11y/alt-text */
import {
    useState, cloneElement, ReactElement, useEffect,
} from 'react';
import useIntersect from './intersect';
import styles from './index.module.scss';

const IntersectionPlaceholder = ({
    src,
    lqip,
    children,
    style,
    observerOptions,
    stdDeviation,
    className,
    onLoad,
    placeholderClassName,
}:{
    src: ImgSrc,
    lqip: ImgSrc,
    children: ReactElement,
    style?: any,
    observerOptions?: IntersectionObserverInit,
    stdDeviation?: string,
    className?: string,
    onLoad?: () => void,
    placeholderClassName?: string,
}) => {
    const [loaded, setLoaded] = useState(false);
    const { ref, isIntersecting } = useIntersect(observerOptions, true);
    /**
    * NOTE: we have to clone the element since passing down the src from the props does currently not work.
    * and because we can only extend the props of a cloned element and not the orginial one:
    * https://github.com/cyrilwanner/next-optimized-images/issues/186 see comment No. 3
    * */
    const clonedChildren = cloneElement(children, {
        className: loaded
            ? `${children.props?.className || ''} ${styles.loaded} ${stdDeviation === '0' ? styles.skipAnim : ''} ${styles.original}`
            : `${children.props?.className || ''} ${styles.original}`,
        onLoad: () => setLoaded(true),
        onLoadedData: () => setLoaded(true),
        style: { ...children.props?.style, marginTop: `${-((src.height / src.width) * 100)}%` },
    });
    const blurId = `blur_${src.format}_${stdDeviation}`;
    // HACK: we have to manually trigger the onload since safari is not supporting onLoad on svg image tag
    useEffect(() => {
        if (onLoad) {
            // trigger onload immediatly if we have an base64 encoded img
            if (lqip.src.indexOf('data:image') >= 0) onLoad();
            else {
                // otherwise load image again and trigger when loaded
                const img = new Image();
                img.src = lqip.src;
                img.onload = onLoad;
            }
        }
    }, []);
    return (
        <div ref={ref} className={`${className} ${styles.container}`} style={style}>
            <svg className={placeholderClassName} viewBox={`0 0 ${src.width} ${src.height}`}>
                <defs>
                    <filter id={blurId} x="0%" y="0%" width="100%" height="100%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation={stdDeviation} colorInterpolationFilters="sRGB" />
                        { src.format !== 'png' && (
                            <feComponentTransfer colorInterpolationFilters="sRGB">
                                <feFuncA type="table" tableValues="1 1" colorInterpolationFilters="sRGB" />
                            </feComponentTransfer>
                        )}
                    </filter>
                </defs>
                <image
                    preserveAspectRatio="none"
                    filter={`url(#${blurId})`}
                    className={loaded
                        ? `${styles.svgImageDisable} ${styles.svgImage} ${stdDeviation === '0' ? styles.skipAnim : ''}`
                        : styles.svgImage}
                    xlinkHref={lqip.src}
                    onLoad={onLoad}
                    width={src.width}
                    height={src.height}
                />
            </svg>
            { isIntersecting && clonedChildren }
        </div>
    );
};
IntersectionPlaceholder.defaultProps = {
    style: undefined,
    observerOptions: {},
    stdDeviation: '18',
    placeholderClassName: '',
    className: '',
    onLoad: undefined,
};
export default IntersectionPlaceholder;
