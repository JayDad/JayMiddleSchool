"use client";

import { useState } from "react";

export default function ParentLogin({ notice }: { notice?: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/parent-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        window.location.reload();
      } else {
        setError(data.error ?? "로그인 실패");
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-2">부모 대시보드</h1>
      <p className="text-slate-600 text-sm mb-6">
        아들의 자가점검 결과를 확인하려면 비밀번호를 입력하세요.
      </p>
      {notice && (
        <p className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3">
          {notice}
        </p>
      )}
      <form onSubmit={submit} className="space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full rounded-lg border border-slate-300 px-3 py-3 min-h-[44px]"
          autoFocus
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full rounded-lg bg-brand-600 text-white px-4 py-3 min-h-[44px] disabled:bg-slate-300"
        >
          {busy ? "확인 중…" : "들어가기"}
        </button>
      </form>
    </div>
  );
}
