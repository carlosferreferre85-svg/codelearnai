import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { topics, learningPaths } from "@/data/topics";
import TopicCard from "@/components/TopicCard";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completedCount, totalLessons, completedLessons } = useApp();
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBotPad = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + webTopPad + 16,
        paddingBottom: insets.bottom + webBotPad + 100,
        paddingHorizontal: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Bienvenido a</Text>
          <Text style={[styles.appName, { color: colors.foreground }]}>CodeLearn AI</Text>
        </View>
        <Pressable
          onPress={() => router.push("/chat")}
          style={[styles.aiBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="message-circle" size={18} color="#fff" />
        </Pressable>
      </View>

      {/* Progress Card */}
      <View style={[styles.progressCard, { backgroundColor: colors.codeBackground }]}>
        <View style={styles.progressTop}>
          <View>
            <Text style={[styles.progressLabel, { color: "#8b949e" }]}>Tu progreso</Text>
            <Text style={[styles.progressValue, { color: "#e6edf3" }]}>
              {completedCount} / {totalLessons} lecciones
            </Text>
          </View>
          <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
            <Text style={[styles.progressPct, { color: colors.primary }]}>{progressPercent}%</Text>
          </View>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: "#30363d" }]}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: colors.primary }]} />
        </View>
        {progressPercent === 0 && (
          <Text style={[styles.progressHint, { color: "#8b949e" }]}>
            ¡Empieza con cualquier tema!
          </Text>
        )}
        {progressPercent > 0 && progressPercent < 100 && (
          <Text style={[styles.progressHint, { color: "#8b949e" }]}>
            ¡Vas muy bien! Sigue aprendiendo.
          </Text>
        )}
        {progressPercent === 100 && (
          <Text style={[styles.progressHint, { color: colors.primary }]}>
            ¡Completaste todo! Eres increíble.
          </Text>
        )}
      </View>

      {/* Quick Access to AI Chat */}
      <Pressable
        onPress={() => router.push("/chat")}
        style={({ pressed }) => [
          styles.chatBanner,
          { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={styles.chatBannerLeft}>
          <Text style={styles.chatBannerTitle}>Pregunta al Asistente IA</Text>
          <Text style={styles.chatBannerSub}>Resuelve cualquier duda de programación</Text>
        </View>
        <Feather name="arrow-right" size={22} color="#fff" />
      </Pressable>

      {/* Learning Paths */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Rutas de Aprendizaje</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pathsRow}>
        {learningPaths.map((path) => {
          const done = path.topicIds.reduce((sum, tid) => {
            const topic = topics.find((t) => t.id === tid);
            if (!topic) return sum;
            return sum + topic.lessons.filter((l) => completedLessons.includes(l.id)).length;
          }, 0);
          const total = path.topicIds.reduce((sum, tid) => {
            const topic = topics.find((t) => t.id === tid);
            return sum + (topic?.lessons.length ?? 0);
          }, 0);

          return (
            <Pressable
              key={path.id}
              onPress={() => router.push("/learn")}
              style={[styles.pathCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.pathIconWrap, { backgroundColor: colors.accent }]}>
                <Feather name={path.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.pathTitle, { color: colors.foreground }]}>{path.title}</Text>
              <Text style={[styles.pathDuration, { color: colors.mutedForeground }]}>{path.duration}</Text>
              <Text style={[styles.pathProgress, { color: colors.primary }]}>{done}/{total}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Topics */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Todos los Temas</Text>
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onPress={() => router.push({ pathname: "/topic/[id]", params: { id: topic.id } })}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  appName: { fontSize: 26, fontFamily: "Inter_700Bold" },
  aiBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  progressCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  progressLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 2 },
  progressValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  progressCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPct: { fontSize: 14, fontFamily: "Inter_700Bold" },
  progressBarBg: { height: 6, borderRadius: 100, overflow: "hidden", marginBottom: 8 },
  progressBarFill: { height: "100%", borderRadius: 100 },
  progressHint: { fontSize: 12, fontFamily: "Inter_400Regular" },
  chatBanner: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  chatBannerLeft: { flex: 1 },
  chatBannerTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff", marginBottom: 2 },
  chatBannerSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)" },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
    marginTop: 4,
  },
  pathsRow: { marginBottom: 22 },
  pathCard: {
    width: 150,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 10,
    gap: 6,
  },
  pathIconWrap: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  pathTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  pathDuration: { fontSize: 11, fontFamily: "Inter_400Regular" },
  pathProgress: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
