
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CoachProps {
  coach: {
    name: string;
    title: string;
    style: string;
    prompt: string;
  };
  journalData: {
    date: string;
    journal: string;
    reflection: string;
  };
  apiKey: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const Coach: React.FC<CoachProps> = ({ coach, journalData, apiKey }) => {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [localApiKey, setLocalApiKey] = useState<string>(apiKey);
  const [showApiInput, setShowApiInput] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (localApiKey) {
      fetchAdvice();
    } else {
      setLoading(false);
      setShowApiInput(true);
    }
  }, [coach, journalData, localApiKey]);

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${coach.prompt}\n\n사용자의 저널: ${journalData.journal}\n\n사용자의 회고: ${journalData.reflection}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${localApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json() as GeminiResponse;
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("API에서 응답을 받지 못했습니다.");
      }
      
      const text = data.candidates[0].content.parts[0].text;
      setAdvice(text);
    } catch (err) {
      console.error("Error fetching from Gemini API:", err);
      setError(true);
      toast({
        title: "API 오류",
        description: "코칭 조언을 가져오는 중 오류가 발생했습니다. API 키를 확인해주세요.",
        variant: "destructive",
      });
      setShowApiInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localApiKey.trim()) {
      toast({
        title: "API 키 필요",
        description: "Gemini API 키를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("geminiApiKey", localApiKey);
    setShowApiInput(false);
    fetchAdvice();
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Card className="coach-card overflow-hidden border border-border/40 h-full">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(coach.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{coach.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{coach.title}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-muted-foreground mb-4">{coach.style}</p>
        {showApiInput ? (
          <form onSubmit={handleApiKeySubmit} className="space-y-3">
            <div>
              <p className="text-sm mb-2">유효한 Gemini API 키를 입력해주세요:</p>
              <Input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Gemini API 키"
                className="text-sm"
              />
            </div>
            <Button type="submit" className="w-full text-sm">저장</Button>
            <p className="text-xs text-muted-foreground">
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                Gemini API 키는 여기서 얻을 수 있습니다
              </a>
            </p>
          </form>
        ) : loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full placeholder-animate" />
            <Skeleton className="h-4 w-[90%] placeholder-animate" />
            <Skeleton className="h-4 w-[95%] placeholder-animate" />
            <Skeleton className="h-4 w-[80%] placeholder-animate" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive space-y-3">
            <p>조언을 불러오는 데 실패했습니다.</p>
            <Button onClick={() => setShowApiInput(true)} size="sm">API 키 다시 입력</Button>
          </div>
        ) : (
          <div className="text-sm animate-scale-in whitespace-pre-line">
            {advice}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
