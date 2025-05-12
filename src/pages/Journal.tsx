
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Journal = () => {
  const [journalEntry, setJournalEntry] = useState("");
  const [reflection, setReflection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const currentDate = format(new Date(), "yyyy년 MM월 dd일");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!journalEntry.trim() || !reflection.trim()) {
      toast({
        title: "입력 필요",
        description: "일기와 회고를 모두 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // 저널 데이터를 Supabase에 저장
      const { error } = await supabase.from('journals').insert({
        user_id: user?.id,
        journal_text: journalEntry,
        reflection_text: reflection
      });

      if (error) {
        throw error;
      }
      
      // 로컬 세션 스토리지에도 저장 (코칭 페이지에서 사용)
      sessionStorage.setItem("journalData", JSON.stringify({
        date: currentDate,
        journal: journalEntry,
        reflection: reflection,
      }));
      
      navigate("/coaching");
    } catch (error: any) {
      toast({
        title: "저장 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-4 bg-background animate-fade-in">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">오늘의 저널</h1>
        <p className="text-muted-foreground text-center mb-8">{currentDate}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="overflow-hidden border border-border/40">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-2">오늘 있었던 일</label>
              <Textarea
                placeholder="오늘 있었던 일들을 자유롭게 기록해보세요..."
                className="min-h-[180px] resize-none bg-background"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-border/40">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-2">오늘의 회고</label>
              <Textarea
                placeholder="오늘 하루를 되돌아보며 생각이나 느낀 점을 적어보세요..."
                className="min-h-[180px] resize-none bg-background"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="w-full max-w-xs" 
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "코칭 받기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Journal;
