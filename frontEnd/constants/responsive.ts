export const VIEWPORT_PRESETS = {
  iPhone14Pro: {
    width: 393,
    height: 852,
    pixelRatio: 3,
    nativeWidth: 1179,
    nativeHeight: 2556,
  },
} as const;

export function isIPhone14ProViewport(width: number, height: number) {
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);

  return shortSide >= 390 && shortSide <= 396 && longSide >= 844 && longSide <= 860;
}

export function getDeviceClass(width: number, height: number) {
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);
  const isLandscape = width > height;

  return {
    shortSide,
    longSide,
    isLandscape,
    isCompact: shortSide < 360,
    isNarrowWidth: width < 360,
    isTablet: shortSide >= 768,
    isLargePhone: shortSide >= 390 && shortSide < 430,
    isIPhone14Pro: isIPhone14ProViewport(width, height),
    isShortHeight: longSide < 700,
  };
}
