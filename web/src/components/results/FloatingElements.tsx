import { motion } from "framer-motion";

interface FloatingElementsProps {
  elements: Array<{
    id: number;
    type: string;
    x: number;
    delay: number;
    duration: number;
  }>;
  windowWidth: number;
}

export default function FloatingElements({
  elements,
  windowWidth,
}: FloatingElementsProps) {
  if (windowWidth < 1200) return null;

  return (
    <>
      {elements.map((elem) => (
        <motion.div
          key={elem.id}
          initial={{ y: "100vh", x: `${elem.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "-20vh",
            x: `${elem.x + Math.sin(elem.id) * 5}vw`,
            opacity: [0, 0.7, 0.7, 0],
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

      {/* Corner Flourishes */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle at 0% 0%, rgba(196,30,58,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle at 100% 0%, rgba(245,199,122,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
}
