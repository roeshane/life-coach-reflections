
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        
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
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
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
        const text = data.candidates[0].content.parts[0].text;
        setAdvice(text);
      } catch (err) {
        console.error("Error fetching from Gemini API:", err);
        setError(true);
        toast({
          title: "API 오류",
          description: "코칭 조언을 가져오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [coach, journalData, apiKey, toast]);

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
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full placeholder-animate" />
            <Skeleton className="h-4 w-[90%] placeholder-animate" />
            <Skeleton className="h-4 w-[95%] placeholder-animate" />
            <Skeleton className="h-4 w-[80%] placeholder-animate" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">
            조언을 불러오는 데 실패했습니다. API 키가 올바른지 확인해주세요.
          </p>
        ) : (
          <div className="text-sm animate-scale-in whitespace-pre-line">
            {advice}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
