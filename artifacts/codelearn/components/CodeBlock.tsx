import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Clipboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

type Props = {
  code: string;
  language?: string;
};

export default function CodeBlock({ code, language }: Props) {
  const colors = useColors();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    Clipboard.setString(code);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.codeBackground, borderColor: colors.border }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {language && (
          <Text style={[styles.language, { color: colors.primary }]}>{language}</Text>
        )}
        <Pressable onPress={handleCopy} style={[styles.copyBtn, { backgroundColor: copied ? colors.accent : "transparent" }]}>
          <Feather name={copied ? "check" : "copy"} size={14} color={copied ? colors.primary : colors.mutedForeground} />
          <Text style={[styles.copyText, { color: copied ? colors.primary : colors.mutedForeground }]}>
            {copied ? "Copiado" : "Copiar"}
          </Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.code, { color: colors.codeForeground }]}>{code}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  language: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  code: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 22,
    padding: 14,
  },
});
