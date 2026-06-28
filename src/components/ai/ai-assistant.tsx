"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

type Props = {
  streamTitle: string;
  streamDescription: string;
};

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  code?: string;
};

export default function AIAssistant({ streamTitle, streamDescription }: Props) {
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I'm your Codoro AI Assistant. Paste your code below or ask me any questions about the stream.",
    }
  ]);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() && !code.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      code: code,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setCode("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMsg.content,
          code: userMsg.code,
          streamTitle,
          streamDescription,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response || "No response generated.",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Error communicating with the AI. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[600px] border border-border rounded-lg bg-base overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <h2 className="text-sm font-bold text-primary">AI Coding Assistant</h2>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            {msg.role === "ai" && (
              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <span className="h-4 px-1.5 rounded bg-accent/20 text-accent text-[9px] font-bold font-mono uppercase border border-accent/30 flex items-center justify-center">
                  AI
                </span>
              </div>
            )}
            
            <div
              className={`p-3.5 text-sm ${
                msg.role === "user"
                  ? "bg-elevated text-primary rounded-lg rounded-tr-none border border-border"
                  : "bg-surface text-secondary rounded-lg rounded-tl-none border border-border w-full"
              }`}
            >
              <ReactMarkdown
                components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        customStyle={{
                          background: '#08080F',
                          border: '1px solid #1E1E3A',
                          borderRadius: '6px',
                          fontSize: '12px',
                          margin: '8px 0',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code style={{
                        background: '#16162A',
                        border: '1px solid #1E1E3A',
                        borderRadius: '3px',
                        padding: '1px 5px',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono, monospace',
                        color: '#A78BFA'
                      }}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({children}) => <h1 style={{fontSize:'16px', fontWeight:700, color:'#F1F0FF', margin:'16px 0 8px'}}>{children}</h1>,
                  h2: ({children}) => <h2 style={{fontSize:'14px', fontWeight:600, color:'#F1F0FF', margin:'14px 0 6px'}}>{children}</h2>,
                  h3: ({children}) => <h3 style={{fontSize:'13px', fontWeight:600, color:'#C4B5FD', margin:'12px 0 4px'}}>{children}</h3>,
                  p: ({children}) => <p style={{fontSize:'13px', color:'#A09DC0', lineHeight:'1.7', margin:'6px 0'}}>{children}</p>,
                  ul: ({children}) => <ul style={{paddingLeft:'16px', margin:'6px 0'}}>{children}</ul>,
                  ol: ({children}) => <ol style={{paddingLeft:'16px', margin:'6px 0'}}>{children}</ol>,
                  li: ({children}) => <li style={{fontSize:'13px', color:'#A09DC0', lineHeight:'1.7', margin:'3px 0'}}>{children}</li>,
                  strong: ({children}) => <strong style={{color:'#F1F0FF', fontWeight:600}}>{children}</strong>,
                  blockquote: ({children}) => (
                    <blockquote style={{
                      borderLeft:'2px solid #7C3AED',
                      paddingLeft:'12px',
                      margin:'8px 0',
                      color:'#6B7280'
                    }}>
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>

              {msg.code && msg.role === "user" && (
                <div className="mt-3 bg-base border border-border rounded-md overflow-hidden">
                  <div className="bg-elevated border-b border-border px-3 py-1.5 text-xs text-muted font-mono flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-syntax-blue"></span>
                    Attached Code
                  </div>
                  <pre className="p-3 text-xs font-mono text-secondary overflow-x-auto">
                    {msg.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mr-auto items-start flex flex-col max-w-[85%]">
            <div className="flex items-center gap-2 mb-1.5 ml-1">
              <span className="h-4 px-1.5 rounded bg-accent/20 text-accent text-[9px] font-bold font-mono uppercase border border-accent/30 flex items-center justify-center">
                AI
              </span>
            </div>
            <div className="p-3.5 text-sm bg-surface text-secondary rounded-lg rounded-tl-none border border-border flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-surface border-t border-border shrink-0">
        <div className="flex flex-col gap-2">
          {code.length > 0 && (
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste code context here..."
                className="w-full h-24 bg-base border border-border focus:border-border-bright rounded-md text-primary font-mono text-xs p-3 outline-none resize-none"
              />
              <button 
                onClick={() => setCode("")}
                className="absolute top-2 right-2 text-muted hover:text-live-red text-xs"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 min-h-[44px] max-h-32 bg-base border border-border focus:border-border-bright rounded-md text-primary text-sm p-2.5 outline-none resize-none"
              rows={1}
            />
            {code.length === 0 && (
              <button
                onClick={() => setCode(" ")}
                className="h-[44px] px-3 rounded-md bg-transparent border border-border text-secondary hover:border-border-bright hover:text-primary transition-colors text-sm font-medium"
                title="Attach Code"
              >
                {`</>`}
              </button>
            )}
            <button
              onClick={handleAsk}
              disabled={loading || (!question.trim() && !code.trim())}
              className="h-[44px] px-4 rounded-md bg-accent hover:bg-violet-600 disabled:bg-accent/50 text-white font-medium text-sm transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
