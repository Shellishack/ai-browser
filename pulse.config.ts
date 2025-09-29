import { ExtensionConfig, ExtensionTypeEnum } from "@pulse-editor/shared-utils";
import packageJson from "./package.json" with { type: "json" };

/**
 * Pulse Editor Extension Config
 *
 */
const config: ExtensionConfig = {
  // Do not use hyphen character '-' in the id. 
  // The id should be the same as the package name in package.json.
  id: packageJson.name,
  displayName: packageJson.displayName,
  description: packageJson.description,
  version: packageJson.version,
  extensionType: ExtensionTypeEnum.FileView,
  fileTypes: ["txt", "json", "py", "cpp", "c", "tsx", "ts", "js", "jsx"],
  visibility: packageJson["pulse-editor-marketplace"].visibility,
  recommendedHeight: 640,
  recommendedWidth: 360,
  thumbnail: "assets/thumbnail.png",
  commandsInfoList: [
    {
      name: "Agentic Web Browse",
      description: "A simple web browser with AI agent capabilities. AI will explore pages on your behalf",
      parameters: {
        url: {
          type: "string",
          description: "The URL to browse. Use the embedded link wherever possible. e.g. YouTube embed link instead of normal YouTube link.",
        }
      },
    }
  ]
};

export default config;
