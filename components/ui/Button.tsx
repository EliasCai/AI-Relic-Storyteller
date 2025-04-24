import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, fontFamilies, spacing, borderRadius } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  containerStyle,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.button_fullWidth,
    disabled && styles.button_disabled,
    containerStyle,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  const getContentColor = () => {
    if (disabled) return colors.gray[400];
    switch (variant) {
      case 'primary':
        return colors.white;
      case 'secondary':
        return colors.white;
      case 'outline':
        return colors.primary[500];
      case 'ghost':
        return colors.primary[500];
      default:
        return colors.white;
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getContentColor()}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  button_primary: {
    backgroundColor: colors.primary[500],
  },
  button_secondary: {
    backgroundColor: colors.secondary[500],
  },
  button_outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  button_ghost: {
    backgroundColor: colors.transparent,
  },
  button_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  button_md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  button_lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  button_fullWidth: {
    width: '100%',
  },
  button_disabled: {
    backgroundColor: colors.gray[200],
    borderColor: colors.gray[300],
  },
  text: {
    fontFamily: fontFamilies.body.medium,
    textAlign: 'center',
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.white,
  },
  text_outline: {
    color: colors.primary[500],
  },
  text_ghost: {
    color: colors.primary[500],
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  text_disabled: {
    color: colors.gray[500],
  },
});