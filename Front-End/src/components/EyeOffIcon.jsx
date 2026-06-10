import React from 'react';

const EyeOffIcon = ({
  size = undefined,
  color = '#FFFFFF',
  strokeWidth = 2,
  background = '#000000',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = 24 + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <g fill="currentColor">
        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a18.8 18.8 0 0 0-2.79.219l.77.77C6.756 3.393 7.379 3.3 8 3.3c4.12 0 7.33 2.808 8.828 4.7-.285.367-.624.78-1.02 1.205zM8 5.5a2.5 2.5 0 0 1 2.5 2.5c0 .35-.072.686-.2 1.004l.75.75c.28-.521.45-1.12.45-1.754a3.5 3.5 0 0 0-3.5-3.5 3.5 3.5 0 0 0-1.754.45l.75.75c.318-.128.654-.2 1.004-.2"/>
        <path d="M11.63 12.63c.48.336 1.12.83 1.754 1.464l.707-.707-1.464-1.754A18.6 18.6 0 0 1 8 12.7c-4.12 0-7.33-2.808-8.828-4.7.285-.367.624-.78 1.02-1.205L.092 6.69l.707.707 1.464 1.754A18.6 18.6 0 0 0 8 12.7c1.3 0 2.531-.284 3.63-.07zM8 10.5a2.5 2.5 0 0 1-2.5-2.5c0-.35.072-.686.2-1.004l-.75-.75c-.28.521-.45 1.12-.45 1.754a3.5 3.5 0 0 0 3.5 3.5c.633 0 1.233-.17 1.754-.45l-.75-.75c-.318.128-.654.2-1.004.2"/>
        <path d="M1.354 1.146a.5.5 0 0 1 .708 0l14 14a.5.5 0 0 1-.708.708l-14-14a.5.5 0 0 1 0-.708"/>
      </g>
    </svg>
  );
};

export default EyeOffIcon;
