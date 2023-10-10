import { createSignal, createMemo, onMount, onCleanup } from 'solid-js';

import { CHAR_SIZE } from './terminal-constants';
import './boot-screen.css';

const bootFiglet = `
       fb
      ffbb
     fffbbb
    ffffbbbb
   fffffbbbbb
  ffffffbbbbbb
 fffffffbbbbbbb
ffffffffbbbbbbbb
 bbbbbbbfffffff
  bbbbbbffffff
   bbbbbfffff
    bbbbffff
     ||||||
      ||||
       ||
       vv
`
  .split('\n')
  .filter((line) => line.trim().length > 0)
  .join('\n')
  .replaceAll('b', '\\')
  .replaceAll('f', '/');

export function BootScreen() {
  let bootScreen: HTMLDivElement;

  // The current frame of the animation
  const [frame, setFrame] = createSignal(0);

  onMount(() => {
    const animationInterval = setInterval(() => {
      setFrame((frame) => frame + 1);
    }, 20);

    return () => {
      clearTimeout(animationInterval);
    };
  });

  // The height of the screen in number of available lines
  const [screenHeight, setScreenHeight] = createSignal<number | null>(null);

  // The number of lines in the boot figlet, the line height is 2 in the css
  const ySize = bootFiglet.split('\n').length * 2;

  // The height of the boot screen in pixels, rounded to the nearest line
  const croppedHeight = createMemo(() => `${(screenHeight() ?? 0) * CHAR_SIZE}px`);

  // The y position of the boot figlet in pixels, rounded to the nearest line
  const yPosition = createMemo(() => {
    // The figlet appears from the bottom of the screen, moves up, and then disappears at the top.
    // So the total number of lines it moves is:
    const lines = ySize + (screenHeight() ?? 0);

    // We cycle through the animation by moving the figlet up line by line
    const currentLine = frame() % lines;

    // The y position is the number of lines from the bottom of the screen
    return Math.round((screenHeight() ?? 0) - currentLine);
  });

  onMount(() => {
    const measureYSize = () => {
      const { height } = bootScreen.getBoundingClientRect();
      setScreenHeight(Math.floor(height / CHAR_SIZE));
    };

    measureYSize();

    window.addEventListener('resize', measureYSize);

    onCleanup(() => {
      window.removeEventListener('resize', measureYSize);
    });
  });

  return (
    <div
      class="boot-screen"
      ref={bootScreen!}
      style={{
        '--y-position': yPosition(),
        '--cropped-height': croppedHeight(),
      }}
    >
      <div class="boot-screen__inner">
        <pre class="boot-screen__figlet">{bootFiglet}</pre>
        <h1 class="boot-screen__title">RAMSES</h1>
      </div>
    </div>
  );
}
