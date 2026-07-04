"use client";
import { useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

const HOME_BY_ROLE: Record<string, string> = {
  admin: "/admin",
  storefront: "/storefront",
};

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }
    const { role } = await res.json().catch(() => ({ role: "" }));
    const next =
      new URLSearchParams(window.location.search).get("next") ||
      HOME_BY_ROLE[role] ||
      "/storefront";
    window.location.href = next;
  }

  return (
    <div className="flex items-start bg-canvas px-6 py-10 md:items-center md:px-14 md:py-12">
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-bold text-ink">เข้าสู่ระบบ</h2>
        <p className="mt-1.5 text-sm text-body">
          สำหรับพนักงานหน้าร้านที่ออกบิลฝากขาย
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <TextField
            label="ชื่อผู้ใช้"
            autoComplete="username"
            placeholder="storefront"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="รหัสผ่าน"
            type="password"
            autoComplete="current-password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="mt-1 w-full" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
      </div>
    </div>
  );
}
