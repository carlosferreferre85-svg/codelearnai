import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { topics } from "@/data/topics";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type AppContextType = {
  completedLessons: string[];
  markLessonComplete: (lessonId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  totalLessons: number;
  completedCount: number;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  groqApiKey: string | null;
  setGroqApiKey: (key: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [groqApiKey, setGroqApiKeyState] = useState<string | null>(null);

  const totalLessons = topics.reduce((sum, t) => sum + t.lessons.length, 0);
  const completedCount = completedLessons.length;

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("completedLessons");
        if (saved) setCompletedLessons(JSON.parse(saved));
        const chat = await AsyncStorage.getItem("chatHistory");
        if (chat) setChatHistory(JSON.parse(chat));
        const key = await AsyncStorage.getItem("groqApiKey");
        if (key) setGroqApiKeyState(key);
      } catch {}
    })();
  }, []);

  const markLessonComplete = useCallback(async (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      AsyncStorage.setItem("completedLessons", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isLessonComplete = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons]
  );

  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatHistory((prev) => {
      const next = [...prev, message];
      AsyncStorage.setItem("chatHistory", JSON.stringify(next.slice(-100))).catch(() => {});
      return next;
    });
  }, []);

  const clearChat = useCallback(() => {
    setChatHistory([]);
    AsyncStorage.removeItem("chatHistory").catch(() => {});
  }, []);

  const setGroqApiKey = useCallback((key: string) => {
    setGroqApiKeyState(key);
    AsyncStorage.setItem("groqApiKey", key).catch(() => {});
  }, []);

  return (
    <AppContext.Provider
      value={{
        completedLessons,
        markLessonComplete,
        isLessonComplete,
        totalLessons,
        completedCount,
        chatHistory,
        addChatMessage,
        clearChat,
        groqApiKey,
        setGroqApiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
