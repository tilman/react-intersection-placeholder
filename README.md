# Placeholder Component for React using an Intersection Observer. Especially designed for [next-optimized-images](https://github.com/cyrilwanner/react-optimized-image) new canary version.

## Usage Examples:
### Normal LQIP Placeholder for an Image
```js
import Img from 'react-optimized-image';
import TestImg from 'test.png';
import TestImgLqip from 'test.png?lqip';
...
<IntersectionPlaceholder
    src={TestImg} // original image needed for having the right dimensions
    lqip={TestImgLqip} // pass your placeholder image here
    observerOptions={{ threshold: 0.5 }} // you can also pass options for the intersection observer. Use the same config object as you would use to init the intersection observer.
>
    <Img src={TestImg} />
</IntersectionPlaceholder>
```

### Works also with video tags (uses onLoadedData instead of onLoad)
```js
import TestImg from 'test.png';
import TestImgLqip from 'test.png?lqip';
...
<IntersectionPlaceholder
    src={TestImg} 
    lqip={TestImgLqip}
    observerOptions={{ threshold: 0.5 }}
>
    <video
        preload="auto"
        width="100%"
        autoPlay
        playsInline
        loop
        muted
    >
        <source src="/static/test.mp4" type="video/mp4" />
        <source src="/static/test.webm" type="video/webm" />
        Your browser does not support the video tag.
    </video>
</IntersectionPlaceholder>
```

### Can also get nested to support multiple Placeholders like: LQIP => normal Image => Video
```js
import TestImg from 'test.png';
import TestImgLqip from 'test.png?lqip';
...
<IntersectionPlaceholder
    src={TestImg} 
    lqip={TestImgLqip}
>
    <IntersectionPlaceholder
        src={TestImg} 
        lqip={TestImg}
        stdDeviation={0}
    >
        <video
            preload="auto"
            width="100%"
            autoPlay
            playsInline
            loop
            muted
        >
            <source src="/static/test.mp4" type="video/mp4" />
            <source src="/static/test.webm" type="video/webm" />
            Your browser does not support the video tag.
        </video>
    </IntersectionPlaceholder>
</IntersectionPlaceholder>
```

## Options (props):
* src: original image. Needed for right dimensions 
* lqip: the placeholder image.
* children: any react component which has an onLoad or onLoadedData event
* observerOptions (optional): options for the intersection observer
* stdDeviation (optional, default 18px): the amount of blured pixels for the placeholders
* className (optional): set the className of the wrapper div to style this component
* placeholderClassName (optional): set the className of the svg placeholder to style your placeholder
