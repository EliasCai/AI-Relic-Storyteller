import React from 'react';
import { Text as RNText, StyleSheet, TextStyle, TextProps as RNTextProps } from 'react-native';
import { colors, fontFamilies, fontSizes } from '@/constants/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body1' | 'body2' | 'caption' | 'button';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  color?: string;
  style?: TextStyle;
  children: React.ReactNode;
}

export default function Text({
  variant = 'body1',
  weight = 'regular',
  align = 'left',
  color = colors.gray[900],
  style,
  children,
  ...rest
}: TextProps) {
  const getFamily = () => {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'button'].includes(variant)) {
      if (weight === 'bold') return fontFamilies.heading.bold;
      if (weight === 'semibold') return fontFamilies.heading.semibold;
      return fontFamilies.heading.regular;
    } else {
      if (weight === 'bold') return fontFamilies.body.bold;
      if (weight === 'medium') return fontFamilies.body.medium;
      return fontFamilies.body.regular;
    }
  };

  const getFontSize = () => {
    switch (variant) {
      case 'h1':
        return fontSizes['3xl'];
      case 'h2':
        return fontSizes['2xl'];
      case 'h3':
        return fontSizes.xl;
      case 'h4':
        return fontSizes.lg;
      case 'h5':
        return fontSizes.md;
      case 'body1':
        return fontSizes.md;
      case 'body2':
        return fontSizes.sm;
      case 'caption':
        return fontSizes.xs;
      case 'button':
        return fontSizes.md;
      default:
        return fontSizes.md;
    }
  };

  const getLineHeight = () => {
    switch (variant) {
      case 'h1':
        return fontSizes['3xl'] * 1.2;
      case 'h2':
        return fontSizes['2xl'] * 1.2;
      case 'h3':
        return fontSizes.xl * 1.2;
      case 'h4':
        return fontSizes.lg * 1.2;
      case 'h5':
        return fontSizes.md * 1.2;
      case 'body1':
        return fontSizes.md * 1.5;
      case 'body2':
        return fontSizes.sm * 1.5;
      case 'caption':
        return fontSizes.xs * 1.5;
      case 'button':
        return fontSizes.md * 1.2;
      default:
        return fontSizes.md * 1.5;
    }
  };

  const textStyle = [
    {
      fontFamily: getFamily(),
      fontSize: getFontSize(),
      lineHeight: getLineHeight(),
      color,
      textAlign: align,
    },
    style,
  ];

  return (
    <RNText style={textStyle} {...rest}>
      {children}
    </RNText>
  );
}