
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-lg">저널코치</Link>
        </div>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={handleSignOut}>
                로그아웃
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              로그인
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
