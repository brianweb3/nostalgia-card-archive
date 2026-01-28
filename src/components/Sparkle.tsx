import { useEffect, useState, CSSProperties } from 'react';

interface SparkleProps {
  color?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

interface SparkleInstance {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const Sparkle = ({ color = 'hsl(var(--sparkle))', size = 20, className = '', style }: SparkleProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M12 0L13.5 9.5L24 12L13.5 14.5L12 24L10.5 14.5L0 12L10.5 9.5L12 0Z"
        fill={color}
      />
    </svg>
  );
};

export const SparkleGroup = ({ 
  count = 5, 
  className = '' 
}: { 
  count?: number; 
  className?: string;
}) => {
  const [sparkles, setSparkles] = useState<SparkleInstance[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 12,
      delay: Math.random() * 2,
    }));
    setSparkles(generated);
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <Sparkle size={sparkle.size} />
        </div>
      ))}
    </div>
  );
};

export default Sparkle;
