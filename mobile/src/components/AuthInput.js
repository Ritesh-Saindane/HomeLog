import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function AuthInput({ label, ...props }) {
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        {...props}
        autoCapitalize={props.autoCapitalize || 'none'}
        placeholderTextColor={colors.muted}
        selectionColor={colors.accent}
        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
});

