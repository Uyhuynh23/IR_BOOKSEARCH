import { motion } from "framer-motion";

interface FloatingElement {
  id: number;
  type: string;
  x: number;
  delay: number;
  duration: number;
}

interface FloatingElementsProps {
  elements: FloatingElement[];
  windowWidth: number;
}

export default function FloatingElements({
  elements,
  windowWidth,
}: FloatingElementsProps) {
  if (windowWidth < 1024) return null;

  return (
    <>
      {elements.map((elem) => (
        <motion.div
          key={elem.id}
          initial={{ y: "100vh", x: `${elem.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "-20vh",
            x: `${elem.x + Math.sin(elem.id) * 5}vw`,
            opacity: [0, 0.6, 0.6, 0],
            rotate:
              elem.type === "lixi"
                ? [0, 360]
                : elem.type === "lantern"
                ? [0, 15, -15, 0]
                : 360,
          }}
          transition={{
            duration: elem.duration,
            delay: elem.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "fixed",
            fontSize: elem.type === "lantern" ? "2.5rem" : "2rem",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {elem.type === "blossom" ? "🌸" : elem.type === "lixi" ? "🧧" : "🏮"}
        </motion.div>
      ))}
    </>
  );
}
