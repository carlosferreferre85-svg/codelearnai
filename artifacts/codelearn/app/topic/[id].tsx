import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CodeBlock from "@/components/CodeBlock";
import { useApp } from "@/context/AppContext";
import { topics } from "@/data/topics";
import { useColors } from "@/hooks/useColors";

export default function TopicScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = topics.find((t) => t.id === id);
  const { isLessonComplete, markLessonComplete } = useApp();
  const [activeLesson, setActiveLesson] = useState(0);

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBotPad = Platform.OS === "web" ? 34 : 0;

  if (!topic) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>Tema no encontrado</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const lesson = topic.lessons[activeLesson];
  const isComplete = isLessonComplete(lesson.id);
  const allComplete = topic.lessons.every((l) => isLessonComplete(l.id));

  const handleComplete = async () => {
    await markLessonComplete(lesson.id);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (activeLesson < topic.lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  const paragraphs = lesson.content.split("\n").filter((p) => p.trim().length > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + webTopPad + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.topicTitle, { color: colors.foreground }]} numberOfLines={1}>
            {topic.title}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/chat")}
          style={[styles.aiBtn, { backgroundColor: colors.accent }]}
        >
          <Feather name="message-circle" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* Lesson tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 6, paddingVertical: 10 }}
      >
        {topic.lessons.map((l, i) => {
          const done = isLessonComplete(l.id);
          const active = i === activeLesson;
          return (
            <Pressable
              key={l.id}
              onPress={() => setActiveLesson(i)}
              style={[
                styles.tab,
                active
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.muted },
              ]}
            >
              {done && (
                <Feather name="check" size={11} color={active ? "#fff" : colors.primary} />
              )}
              <Text
                style={[
                  styles.tabText,
                  { color: active ? "#fff" : done ? colors.primary : colors.mutedForeground },
                ]}
              >
                {i + 1}. {l.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + webBotPad + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Lesson header */}
        <View style={styles.lessonHeader}>
          <Text style={[styles.lessonTitle, { color: colors.foreground }]}>{lesson.title}</Text>
          <View style={styles.lessonMeta}>
            <Feather name="clock" size={12} color={colors.mutedForeground} />
            <Text style={[styles.lessonDuration, { color: colors.mutedForeground }]}>{lesson.duration}</Text>
            {isComplete && (
              <View style={[styles.completeBadge, { backgroundColor: colors.accent }]}>
                <Feather name="check" size={10} color={colors.primary} />
                <Text style={[styles.completeBadgeText, { color: colors.primary }]}>Completada</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        {paragraphs.map((para, i) => {
          if (para.startsWith("**") && para.endsWith("**") && !para.slice(2, -2).includes("**")) {
            return (
              <Text key={i} style={[styles.boldLine, { color: colors.foreground }]}>
                {para.slice(2, -2)}
              </Text>
            );
          }
          // Handle inline bold
          const parts = para.split(/(\*\*[^*]+\*\*)/g);
          return (
            <Text key={i} style={[styles.paragraph, { color: colors.foreground }]}>
              {parts.map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <Text key={j} style={[styles.bold, { color: colors.foreground }]}>
                      {part.slice(2, -2)}
                    </Text>
                  );
                }
                return part;
              })}
            </Text>
          );
        })}

        {/* Code example */}
        {lesson.codeExample && (
          <>
            <Text style={[styles.codeTitle, { color: colors.foreground }]}>Ejemplo de código:</Text>
            <CodeBlock code={lesson.codeExample} language={lesson.codeLanguage} />
          </>
        )}

        {/* Ask AI button */}
        <Pressable
          onPress={() => router.push("/chat")}
          style={[styles.askAiBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
        >
          <Feather name="cpu" size={16} color={colors.primary} />
          <Text style={[styles.askAiText, { color: colors.foreground }]}>
            ¿Tienes dudas? Pregunta al Asistente IA
          </Text>
          <Feather name="arrow-right" size={14} color={colors.mutedForeground} />
        </Pressable>

        {/* Navigation */}
        <View style={styles.navRow}>
          {activeLesson > 0 && (
            <Pressable
              onPress={() => setActiveLesson(activeLesson - 1)}
              style={[styles.navBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="chevron-left" size={18} color={colors.foreground} />
              <Text style={[styles.navBtnText, { color: colors.foreground }]}>Anterior</Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleComplete}
            style={[
              styles.completeBtn,
              {
                backgroundColor: isComplete ? colors.accent : colors.primary,
                flex: 1,
              },
            ]}
          >
            <Feather
              name={isComplete ? "check-circle" : "check"}
              size={18}
              color={isComplete ? colors.primary : "#fff"}
            />
            <Text
              style={[
                styles.completeBtnText,
                { color: isComplete ? colors.primary : "#fff" },
              ]}
            >
              {isComplete
                ? "Completada"
                : activeLesson < topic.lessons.length - 1
                ? "Completar y siguiente"
                : "Completar tema"}
            </Text>
          </Pressable>
        </View>

        {allComplete && (
          <View style={[styles.allDoneCard, { backgroundColor: colors.primary }]}>
            <Feather name="award" size={24} color="#fff" />
            <Text style={styles.allDoneTitle}>¡Tema completado!</Text>
            <Text style={styles.allDoneText}>Has terminado todas las lecciones de este tema.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  errorText: { fontSize: 16, fontFamily: "Inter_500Medium" },
  backLink: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  topicTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  aiBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  tabsRow: { borderBottomWidth: 1, maxHeight: 56 },
  tab: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  tabText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  lessonHeader: { marginBottom: 16, gap: 6 },
  lessonTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  lessonMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  lessonDuration: { fontSize: 12, fontFamily: "Inter_400Regular" },
  completeBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100 },
  completeBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  paragraph: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 26, marginBottom: 10 },
  boldLine: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 6, marginTop: 8 },
  bold: { fontFamily: "Inter_700Bold" },
  codeTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 8, marginBottom: 2 },
  askAiBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
  },
  askAiText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  navRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  navBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  completeBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  allDoneCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  allDoneTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  allDoneText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.85)", textAlign: "center" },
});
