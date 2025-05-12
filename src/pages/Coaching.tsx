
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Coach } from "@/components/Coach";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JournalData {
  date: string;
  journal: string;
  reflection: string;
}

const Coaching = () => {
  const [journalData, setJournalData] = useState<JournalData | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedData = sessionStorage.getItem("journalData");
    if (!storedData) {
      toast({
        title: "데이터 없음",
        description: "저널 데이터가 없습니다. 먼저 저널을 작성해 주세요.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    setJournalData(JSON.parse(storedData));
    
    // Check if API key exists in localStorage
    const savedApiKey = localStorage.getItem("geminiApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setIsEditing(true); // API 키가 없으면 입력 폼 표시
    }
  }, [navigate, toast]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API 키 필요",
        description: "Gemini API 키를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("geminiApiKey", apiKey);
    setIsEditing(false);
    
    toast({
      title: "API 키 저장됨",
      description: "Gemini API 키가 성공적으로 저장되었습니다.",
    });
  };

  const coaches = [
    {
      name: "윤미래",
      title: "마인드풀니스 코치",
      style: "평온하고 명상적인 접근을 통해 내면의 평화를 찾는 데 중점을 둡니다.",
      prompt: "당신은 마인드풀니스와 명상에 중점을 둔 인생 코치입니다. 사용자의 저널과 회고를 바탕으로 내면의 평화를 찾고 현재에 집중할 수 있는 통찰력 있는 조언을 한국어로 제공하세요. 조언은 짧고 명확하게 해주세요.",
    },
    {
      name: "김성공",
      title: "목표 달성 전문가",
      style: "구체적인 목표 설정과 실행 계획을 통해 성공으로 이끌어줍니다.",
      prompt: "당신은 목표 설정과 성취에 초점을 맞춘 성공 코치입니다. 사용자의 저널과 회고를 바탕으로 구체적인 목표를 세우고 달성하기 위한 실용적인 조언을 한국어로 제공하세요. 조언은 짧고 명확하게 해주세요.",
    },
    {
      name: "이지혜",
      title: "관계 전문 코치",
      style: "대인 관계와 소통 능력 향상에 초점을 맞춰 조언합니다.",
      prompt: "당신은 인간관계와 의사소통에 특화된 코치입니다. 사용자의 저널과 회고를 바탕으로 더 건강한 관계를 형성하고 효과적으로 소통하는 방법에 대한 조언을 한국어로 제공하세요. 조언은 짧고 명확하게 해주세요.",
    },
    {
      name: "박창의",
      title: "창의적 사고 코치",
      style: "새로운 관점과 창의적 접근법을 통해 문제 해결을 돕습니다.",
      prompt: "당신은 창의적 사고와 혁신에 특화된 코치입니다. 사용자의 저널과 회고를 바탕으로 문제를 새로운 관점에서 바라보고 창의적인 해결책을 찾을 수 있는 통찰력 있는 조언을 한국어로 제공하세요. 조언은 짧고 명확하게 해주세요.",
    },
    {
      name: "최균형",
      title: "일과 삶의 균형 전문가",
      style: "일과 개인 생활의 조화로운 균형을 찾도록 도와줍니다.",
      prompt: "당신은 일과 삶의 균형에 초점을 맞춘 웰빙 코치입니다. 사용자의 저널과 회고를 바탕으로 일과 개인 생활 사이의 건강한 균형을 찾고 전반적인 웰빙을 향상시키기 위한 조언을 한국어로 제공하세요. 조언은 짧고 명확하게 해주세요.",
    },
  ];

  if (!journalData) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-16 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 p-0 hover:bg-transparent"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            저널로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold">라이프 코치 조언</h1>
          <p className="text-muted-foreground">{journalData.date}</p>
        </div>

        {/* API 키 입력 섹션 */}
        <Card className="mb-8 overflow-hidden border border-border/40">
          <CardHeader className="bg-muted/50 px-6 py-4">
            <CardTitle className="text-lg">Gemini API 설정</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Gemini API 키</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="API 키를 입력하세요"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Gemini API 키는 여기서 얻을 수 있습니다
                    </a>
                  </p>
                </div>
                <Button onClick={handleSaveApiKey}>저장</Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">API 키가 설정되었습니다.</p>
                  <p className="text-xs text-muted-foreground">API 키: ••••••••{apiKey.slice(-4)}</p>
                </div>
                <Button variant="outline" onClick={() => setIsEditing(true)}>변경</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mb-8">
          <Card className="bg-secondary/40">
            <CardContent className="p-6">
              <h2 className="font-medium mb-1">오늘의 저널</h2>
              <p className="text-sm text-muted-foreground mb-4">{journalData.journal}</p>
              <Separator className="my-4" />
              <h2 className="font-medium mb-1">오늘의 회고</h2>
              <p className="text-sm text-muted-foreground">{journalData.reflection}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {coaches.map((coach) => (
            <Coach 
              key={coach.name}
              coach={coach}
              journalData={journalData}
              apiKey={apiKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coaching;
