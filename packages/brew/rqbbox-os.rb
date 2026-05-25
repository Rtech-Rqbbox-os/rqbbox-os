cask "rqbbox-os" do
  version "1.0.0"
  sha256 :no_check

  url "https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases/download/v#{version}/RQBBOX-OS-#{version}-macOS.dmg"
  name "RQBBOX OS"
  desc "High-performance, immersive gaming console operating system"
  homepage "https://github.com/Rtech-Rqbbox-os/rqbbox-os"

  livecheck do
    url :url
    strategy :github_latest
  end

  app "RQBBOX OS.app"

  zap trash: [
    "~/Library/Application Support/rqbbox-os",
    "~/Library/Caches/com.rtech.rqbboxos",
    "~/Library/Logs/RQBBOX OS",
    "~/Library/Preferences/com.rtech.rqbboxos.plist",
    "~/Library/Saved Application State/com.rtech.rqbboxos.savedState",
  ]
end
