import * as React from 'react';
import { classNames } from '~/utils/classNames';
import styles from './GradientText.module.scss';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export function GradientText({
  children,
  className = '',
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className={classNames(styles.animatedGradientText, className)}>
      {showBorder && <div className={styles.gradientOverlay} style={gradientStyle} />}
      <div className={styles.textContent} style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}
