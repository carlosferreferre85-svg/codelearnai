import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { topics } from "@/data/topics";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completedCount, totalLessons, completedLessons, setGroqApiKey, groqApiKey } = useApp();
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const webTopPad = Platform.OS === "web" ? 67 : 0;
  const webBotPad = Platform.OS === "web" ? 34 : 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    setGroqApiKey(apiKeyInput.trim());
    setApiKeyInput("");
    setShowApiInput(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const completedTopics = topics.filter((t) =>
    t.lessons.every((l) => completedLessons.includes(l.id))
  );
  const inProgressTopics = topics.filter((t) => {
    const done = t.lessons.filter((l) => completedLessons.includes(l.id)).length;
    return done > 0 && done < t.lessons.length;
  });

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
      <Text style={[styles.title, { color: colors.foreground }]}>Perfil</Text>

      {/* Stats */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Tu progreso</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{progressPercent}%</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Completado</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{completedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Lecciones</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{completedTopics.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Temas completos</Text>
          </View>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
          <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>

      {/* In Progress */}
      {inProgressTopics.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>En progreso</Text>
          {inProgressTopics.map((t) => {
            const done = t.lessons.filter((l) => completedLessons.includes(l.id)).length;
            return (
              <View key={t.id} style={styles.topicRow}>
                <Feather name={t.icon as any} size={16} color={colors.primary} />
                <Text style={[styles.topicName, { color: colors.foreground }]}>{t.title}</Text>
                <Text style={[styles.topicProgress, { color: colors.mutedForeground }]}>
                  {done}/{t.lessons.length}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Completed */}
      {completedTopics.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Completados</Text>
          {completedTopics.map((t) => (
            <View key={t.id} style={styles.topicRow}>
              <Feather name="check-circle" size={16} color={colors.primary} />
              <Text style={[styles.topicName, { color: colors.foreground }]}>{t.title}</Text>
              <Text style={[styles.badge, { backgroundColor: colors.accent, color: colors.primary }]}>
                ¡Listo!
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Groq API Key */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Asistente IA (Groq)</Text>
        <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
          {groqApiKey
            ? "Clave API configurada. El chatbot IA está activo."
            : "Para usar el chatbot IA necesitas una clave API de Groq (gratis en console.groq.com)."}
        </Text>
        {groqApiKey && (
          <View style={[styles.statusRow, { backgroundColor: colors.accent }]}>
            <Feather name="check-circle" size={14} color={colors.primary} />
            <Text style={[styles.statusText, { color: colors.primary }]}>IA Activa</Text>
          </View>
        )}
        <Pressable
          onPress={() => setShowApiInput(!showApiInput)}
          style={[styles.btn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.btnText}>{groqApiKey ? "Actualizar clave API" : "Configurar clave API"}</Text>
        </Pressable>
        {showApiInput && (
          <View style={styles.apiInputRow}>
            <TextInput
              style={[styles.apiInput, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]}
              placeholder="gsk_..."
              placeholderTextColor={colors.mutedForeground}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              secureTextEntry
              autoCapitalize="none"
            />
            <Pressable onPress={handleSaveApiKey} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={18} color="#fff" />
            </Pressable>
          </View>
        )}
      </View>

      {/* Resources */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Recursos gratuitos</Text>
        {[
          { icon: "globe", label: "MDN Web Docs (referencia HTML/CSS/JS)", url: "developer.mozilla.org" },
          { icon: "github", label: "GitHub Pages (publica tu web gratis)", url: "pages.github.com" },
          { icon: "zap", label: "Netlify (deploy gratuito)", url: "netlify.com" },
          { icon: "triangle", label: "Vercel (para React y Next.js)", url: "vercel.com" },
          { icon: "cpu", label: "Groq AI (clave API gratis)", url: "console.groq.com" },
          { icon: "code", label: "Replit (programa en el navegador)", url: "replit.com" },
        ].map((r) => (
          <View key={r.url} style={styles.resourceRow}>
            <Feather name={r.icon as any} size={16} color={colors.primary} />
            <View style={styles.resourceText}>
              <Text style={[styles.resourceLabel, { color: colors.foreground }]}>{r.label}</Text>
              <Text style={[styles.resourceUrl, { color: colors.primary }]}>{r.url}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 16 },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  statDivider: { width: 1, height: 40 },
  progressBar: { height: 6, borderRadius: 100, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 100 },
  topicRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  topicName: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  topicProgress: { fontSize: 12, fontFamily: "Inter_400Regular" },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, fontSize: 11, fontFamily: "Inter_600SemiBold", overflow: "hidden" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  btn: { paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  apiInputRow: { flexDirection: "row", gap: 8 },
  apiInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular" },
  saveBtn: { width: 44, height: 44, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  resourceRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  resourceText: { flex: 1, gap: 2 },
  resourceLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  resourceUrl: { fontSize: 12, fontFamily: "Inter_500Medium" },
});
