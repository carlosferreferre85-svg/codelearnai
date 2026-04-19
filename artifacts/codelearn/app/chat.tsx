import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatBubble from "@/components/ChatBubble";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN ?? "localhost"}/api`;

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { chatHistory, addChatMessage, clearChat } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMsg, setStreamingMsg] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const webBotPad = Platform.OS === "web" ? 34 : 0;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg = {
      id: Date.now().toString() + "_u",
      role: "user" as const,
      content: userText,
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);
    setLoading(true);
    setStreamingMsg("");

    const messages = [
      ...chatHistory.slice(-20).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userText },
    ];

    try {
      const res = await expoFetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        // @ts-ignore
        reactNative: { textStreaming: true },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${await res.text()}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content ?? "";
            fullText += delta;
            setStreamingMsg(fullText);
          } catch {}
        }
      }

      const aiMsg = {
        id: Date.now().toString() + "_a",
        role: "assistant" as const,
        content: fullText || "Lo siento, no pude generar una respuesta. Intenta de nuevo.",
        timestamp: Date.now(),
      };
      addChatMessage(aiMsg);
      setStreamingMsg("");
    } catch (err: any) {
      const errMsg = {
        id: Date.now().toString() + "_err",
        role: "assistant" as const,
        content: `Error al conectar con la IA: ${err?.message ?? "Verifica la conexión"}`,
        timestamp: Date.now(),
      };
      addChatMessage(errMsg);
      setStreamingMsg("");
    } finally {
      setLoading(false);
    }
  };

  const allMessages = [
    ...chatHistory,
    ...(streamingMsg
      ? [{ id: "streaming", role: "assistant" as const, content: streamingMsg, timestamp: Date.now() }]
      : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.aiDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Asistente IA</Text>
          <View style={[styles.liveChip, { backgroundColor: colors.accent }]}>
            <Text style={[styles.liveText, { color: colors.primary }]}>Groq</Text>
          </View>
        </View>
        <Pressable onPress={clearChat} style={styles.clearBtn}>
          <Feather name="trash-2" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior="padding" keyboardVerticalOffset={0}>
        {/* Empty state */}
        {allMessages.length === 0 ? (
          <View style={styles.welcome}>
            <View style={[styles.welcomeIcon, { backgroundColor: colors.accent }]}>
              <Feather name="cpu" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
              ¡Hola! Soy CodeLearn AI
            </Text>
            <Text style={[styles.welcomeText, { color: colors.mutedForeground }]}>
              Pregúntame cualquier cosa sobre programación, HTML, CSS, JavaScript, diseño web o cómo lanzar tu web gratis.
            </Text>
            <View style={styles.suggestions}>
              {[
                "¿Cómo creo mi primera página web?",
                "¿Qué diferencia hay entre HTML y CSS?",
                "¿Cómo publico mi web gratis en GitHub?",
                "Explícame JavaScript con un ejemplo",
                "¿Cómo uso la IA para programar más rápido?",
              ].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setInput(s)}
                  style={[styles.suggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Feather name="arrow-up-right" size={12} color={colors.primary} />
                  <Text style={[styles.suggestionText, { color: colors.foreground }]}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={[...allMessages].reverse()}
            keyExtractor={(item) => item.id}
            inverted
            renderItem={({ item }) => <ChatBubble role={item.role} content={item.content} />}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Loading indicator */}
        {loading && !streamingMsg && (
          <View style={styles.typingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.typingText, { color: colors.mutedForeground }]}>
              CodeLearn AI está pensando...
            </Text>
          </View>
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + webBotPad + 8,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            placeholder="Escribe tu pregunta..."
            placeholderTextColor={colors.mutedForeground}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!input.trim() || loading}
            style={[
              styles.sendBtn,
              { backgroundColor: input.trim() && !loading ? colors.primary : colors.muted },
            ]}
          >
            <Feather
              name="send"
              size={18}
              color={input.trim() && !loading ? "#fff" : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  aiDot: { width: 10, height: 10, borderRadius: 5 },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  liveChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100 },
  liveText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  clearBtn: { padding: 4 },
  welcome: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  welcomeTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
  welcomeText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  suggestions: { width: "100%", gap: 8, marginTop: 4 },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  messagesList: { paddingVertical: 16, paddingBottom: 8 },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  typingText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    maxHeight: 120,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
});
