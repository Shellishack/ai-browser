import React, { useCallback, useEffect, useState } from "react";
import { Eko, LLMs } from "@eko-ai/eko";
import { BrowserAgent } from "@eko-ai/eko-web";
import { useLocation } from "react-router";
import { useCommand, usePulseEnv } from "@pulse-editor/react-api";

export default function Browser() {
  const location = useLocation();
  const { envs } = usePulseEnv();

  const [isBrowseCommandReady, setIsBrowseCommandReady] = useState(false);

  const runAgent = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (args: any) => {
      console.log("Run agent with args:", args);
      const url = args.url as string;

      const llms: LLMs = {
        default: {
          provider: "openai",
          model: "gpt-4o-mini",
          apiKey: envs.OPENAI_API_KEY ?? "",
        },
      };
      const agents = [new BrowserAgent()];
      const eko = new Eko({ llms, agents });

      const result = await eko.run(
        url
          // wrap all http links inside a param like /?uri=https%3A%2F%2Fwww.example.com%2F
          .replace(
            /https?:\/\/[^\s]+/g,
            (url) => `local url /?uri=${encodeURIComponent(url)}`
          )
      );

      return result.result;
    },
    [envs]
  );

  // Register command
  useCommand(
    {
      name: "Agentic Web Browse",
      description:
        "A simple web browser with AI agent capabilities. AI will explore pages on your behalf",
      parameters: {
        url: {
          type: "string",
          description: "The URL to browse. Use the embedded link wherever possible. e.g. YouTube embed link instead of normal YouTube link.",
        },
      },
    },
    runAgent,
    isBrowseCommandReady
  );

  const [uri, setUri] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setUri(params.get("uri") ?? "");
  }, [location.search]);

  useEffect(() => {
    if (envs.OPENAI_API_KEY) {
      setIsBrowseCommandReady(true);
    }
  }, [envs]);

  return (
    <div className="w-full h-full p-2 flex flex-col">
      <div className="grid grid-rows-[max-content_auto] gap-2 h-full">
        {/* Simple address bar */}
        <div className="w-full flex space-x-2">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-sm px-2 py-1"
            placeholder="Enter URL"
            value={uri !== "" ? decodeURIComponent(uri) : ""}
            onChange={(e) => setUri(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                window.history.replaceState(
                  null,
                  "",
                  `/?uri=${encodeURIComponent(uri)}`
                );
              }
            }}
          />
        </div>
        <div className="w-full h-full rounded-sm overflow-hidden">
          {uri !== "" ? (
            <iframe
              className="w-full h-full"
              title="proxy-frame"
              src={decodeURIComponent(uri)}
              style={{ width: "100%", height: "90vh", border: "none" }}
            ></iframe>
          ) : (
            // Make a simple welcome page and input to enter URL
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <h1 className="text-2xl font-bold">Welcome to AI Browser</h1>
              <p className="text-center text-gray-600">
                Enter a URL in the address bar to start browsing with AI agents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
