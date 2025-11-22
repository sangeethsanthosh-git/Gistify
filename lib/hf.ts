// lib/hf.ts
export async function hfRequest<T>(
  model: string,
  payload: unknown
): Promise<T> {
  const token = process.env.HF_API_TOKEN;

  if (!token || token.trim() === "") {
    throw new Error("HF_API_TOKEN is not set in environment.");
  }

  const res = await fetch(
    `https://router.huggingface.co/hf-inference/models/${model}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new Error(`HF API ${model} failed: ${res.status} ${body}`);
  }

  return (await res.json()) as T;
}
