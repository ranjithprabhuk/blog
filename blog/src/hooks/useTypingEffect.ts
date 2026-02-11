import { useState, useEffect, useRef } from "react";

interface UseTypingEffectOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function useTypingEffect({
  words,
  typingSpeed = 100,
  deletingSpeed = 60,
  pauseDuration = 2000,
}: UseTypingEffectOptions) {
  const [displayText, setDisplayText] = useState("");
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    function tick() {
      const currentWord = words[wordIndexRef.current];

      if (isPausedRef.current) {
        return;
      }

      if (!isDeletingRef.current) {
        // Typing forward
        charIndexRef.current += 1;
        setDisplayText(currentWord.slice(0, charIndexRef.current));

        if (charIndexRef.current === currentWord.length) {
          // Finished typing — pause before deleting
          isPausedRef.current = true;
          setTimeout(() => {
            isPausedRef.current = false;
            isDeletingRef.current = true;
            tick();
          }, pauseDuration);
          return;
        }
      } else {
        // Deleting
        charIndexRef.current -= 1;
        setDisplayText(currentWord.slice(0, charIndexRef.current));

        if (charIndexRef.current === 0) {
          // Finished deleting — move to next word
          isDeletingRef.current = false;
          wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
        }
      }

      const speed = isDeletingRef.current ? deletingSpeed : typingSpeed;
      setTimeout(tick, speed);
    }

    // Start the loop
    const timer = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return displayText;
}
