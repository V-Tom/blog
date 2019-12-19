import { render } from 'react-dom';
import React, { useRef } from 'react';
import clamp from 'lodash-es/clamp';
import { useSprings, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

import useLongPress from './useLongPress';
import './styles.css';

const pages = window.__gallery__;

function Viewpager() {
  const index = useRef(0);
  const backspaceLongPress = useLongPress(function(e) {
    window.location.href = pages[index.current].photo;
  }, 5e3);

  const [props, set] = useSprings(pages.length, i => ({
    x: i * window.innerWidth,
    scale: 1,
    display: 'block'
  }));
  
  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (down && distance > window.innerWidth / 2) {
        const current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pages.length - 1
        );

        index.current = current;
        cancel();
      }

      set(i => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: 'none' };
        const x = (i - index.current) * window.innerWidth + (down ? mx : 0);
        const scale = down ? 1 - distance / window.innerWidth / 2 : 1;
        return { x, scale, display: 'block' };
      });
    }
  );
  return (
    <>
      {props.map(({ x, display, scale }, i) => {
        return (
          <animated.section
            className="photo"
            {...bind()}
            key={i}
            style={{ display, x }}
          >
            <animated.div
              {...backspaceLongPress}
              style={{ scale, backgroundImage: `url(${pages[i].photo})` }}
            >
              <div className="desc">
                <div>👉{pages[i].desc}</div>
              </div>
            </animated.div>
          </animated.section>
        );
      })}
    </>
  );
}

render(<Viewpager />, document.getElementById('root'));
