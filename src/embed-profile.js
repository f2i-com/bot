// The full SDK can switch features at runtime. Studio exports use a build
// containing the features selected for that particular bot.
export function embedRuntimeName(config) {
  if (config.renderMode !== "2d" && config.renderMode !== "3d") return "bot-embed.js";
  const voice = config.speechEnabled === false ? "silent" : "voice";
  const brain = config.chatEnabled === false ? "avatar" : config.baseBrain === false ? "rules" : "chat";
  return `bot-${config.renderMode}-${voice}-${brain}.js`;
}
