export const VIEWPORT_PRESETS = {
  iPhone14Pro: {
    width: 393,
    height: 852,
    pixelRatio: 3,
    nativeWidth: 1179,
    nativeHeight: 2556,
  },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

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

export function getTabDockMetrics(width: number, height: number, insetBottom = 0) {
  const { isTablet, isIPhone14Pro, isLargePhone, isLandscape, isNarrowWidth, shortSide } = getDeviceClass(width, height);

  const dockHorizontalInset = isTablet
    ? clamp(Math.round(width * (isLandscape ? 0.16 : 0.12)), 84, 210)
    : isLandscape
      ? clamp(Math.round(width * 0.08), 22, 86)
      : isNarrowWidth
        ? 10
        : clamp(Math.round(width * 0.04), 12, 20);

  const dockPaddingHorizontal = isTablet ? 14 : isNarrowWidth ? 6 : 8;
  const itemTrackWidth = width - dockHorizontalInset * 2 - dockPaddingHorizontal * 2;
  const eachItemWidth = itemTrackWidth / 5;

  const canShowLabel = isTablet || (!isLandscape && shortSide >= 370);
  const showLabel = canShowLabel && eachItemWidth >= 64;

  const iconSize = isTablet
    ? isLandscape
      ? 23
      : 24
    : showLabel
      ? isIPhone14Pro
        ? 22
        : isLargePhone
          ? 21
          : 20
      : shortSide >= 390
        ? 22
        : 21;

  const slotSize = isTablet
    ? isLandscape
      ? 40
      : 42
    : showLabel
      ? isIPhone14Pro
        ? 37
        : isLargePhone
          ? 36
          : 34
      : shortSide >= 390
        ? 36
        : 34;

  const activeSlotSize = slotSize + (showLabel ? 4 : 5);
  const dockHeight = isTablet ? (showLabel ? 92 : 78) : showLabel ? (isIPhone14Pro ? 86 : 82) : 68;
  const dockBottom = Math.max(insetBottom + (isTablet ? 4 : 2), isIPhone14Pro ? 10 : 8);
  const dockPaddingTop = showLabel ? (isTablet ? 10 : 8) : 6;
  const dockPaddingBottom = showLabel ? (isTablet ? 10 : 8) : 6;
  const tabItemMarginHorizontal = isTablet ? 5 : showLabel ? 2 : 1;
  const contentBottomPadding = dockHeight + dockBottom + (showLabel ? 14 : 12);

  return {
    showLabel,
    iconSize,
    slotSize,
    activeSlotSize,
    dockHorizontalInset,
    dockHeight,
    dockBottom,
    dockPaddingTop,
    dockPaddingBottom,
    dockPaddingHorizontal,
    tabItemMarginHorizontal,
    contentBottomPadding,
  };
}
