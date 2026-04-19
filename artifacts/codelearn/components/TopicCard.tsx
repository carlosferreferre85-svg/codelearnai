import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Topic } from "@/data/topics";
import { useApp } from "@/context/AppContext";

type Props = {
  topic: Topic;
  onPress: () => void;
};

const TAG_COLORS: Record<string, { bg: string; text: string }> = {};

export default function TopicCard({ topic, onPress }: Props) {
  const colors = useColors();
  const { completedLessons } = useApp();
  const completedInTopic = topic.lessons.filter((l) => completedLessons.includes(l.id)).length;
  const progress = completedInTopic / topic.lessons.length;

  const tagBg = {
    html: colors.tagOrange,
    css: colors.tagBlue,
    javascript: colors.tagOrange,
    web: colors.tagPurple,
    deploy: colors.tagGreen,
    programming: colors.tagBlue,
  }[topic.tag] ?? colors.muted;

  const tagFg = {
    html: colors.tagOrangeForeground,
    css: colors.tagBlueForeground,
    javascript: colors.tagOrangeForeground,
    web: colors.tagPurpleForeground,
    deploy: colors.tagGreenForeground,
    programming: colors.tagBlueForeground,
  }[topic.tag] ?? colors.mutedForeground;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: colors.accent }]}>
          <Feather name={topic.icon as any} size={22} color={colors.primary} />
        </View>
        <View style={[styles.tag, { backgroundColor: tagBg }]}>
          <Text style={[styles.tagText, { color: tagFg }]}>{topic.tagLabel}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.foreground }]}>{topic.title}</Text>
      <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
        {topic.description}
      </Text>

      <View style={styles.footer}>
        <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
          {completedInTopic}/{topic.lessons.length} lecciones
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 14,
  },
  footer: {
    gap: 6,
  },
  progressBar: {
    height: 4,
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 100,
  },
  progressText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
