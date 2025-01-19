"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";

export default function Home() {
  const [language, setLanguage] = useState<"ink" | "move">("ink");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");

  const generateCode = async () => {
    setResult("");
    setError("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.code || "");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while generating code. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blockchain Code Generator</h1>
      <div className="mb-4">
        <Select
          value={language}
          onValueChange={(value: "ink" | "move") => setLanguage(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ink">Ink</SelectItem>
            <SelectItem value="move">Move</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        className="mb-4"
        placeholder="Enter your code generation prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex space-x-2 mb-4">
        <Button onClick={generateCode} disabled={isStreaming}>
          {isStreaming ? "Generating..." : "Generate Code"}
        </Button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Card className="relative">
        <CardContent className="p-4">
          {result ? (
            <div className="relative">
              <DynamicSyntaxHighlighter language={language}>
                {result}
              </DynamicSyntaxHighlighter>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-gray-500">Generated code will appear here</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
