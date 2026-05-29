// RQBBOX OS — Discord Bot Command
// Run with: node discord-bot.js
// Requires: npm install discord.js

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log('RQBBOX OS Bot ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rqbbox') {
    const embed = new EmbedBuilder()
      .setTitle('RQBBOX OS — Portable USB Gaming OS')
      .setDescription('A portable USB-based gaming OS by RhysTech. PS5-inspired UI, pro audio engine, 43+ store packages, phone bootloader. Powered by the RQBBOX Kernel — a modular microkernel with process manager, memory manager, virtual file system, device drivers, and system call API. Runs from a USB drive without installation.')
      .setColor(0x00D4FF)
      .setThumbnail('https://rtech-rqbbox-os.github.io/rqbbox-os/System/Branding/rqbbox-logo.svg')
      .addFields(
        { name: '🎮 Features', value: '6 Games · 43+ Packages · PS5 UI · Pro Audio · Phone Boot · Multi-User · ⚙️ RQBBOX Kernel', inline: false },
        { name: '📱 Platforms', value: 'Windows · macOS · Linux · Android · iOS · KaiOS', inline: true },
        { name: '📦 Version', value: 'v1.2.0 · Free · MIT', inline: true },
        { name: '⬇ Download', value: '[GitHub Releases](https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases)', inline: false },
        { name: '🔗 Links', value: '[GitHub](https://github.com/Rtech-Rqbbox-os/rqbbox-os) · [Info Card](https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html) · [YouTube](https://www.youtube.com/@RQBBOX-REAL)', inline: false },
      )
      .setFooter({ text: 'RhysTech · rqbbox.support@groups.outlook.com', iconURL: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Branding/rqbbox-logo.svg' });

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);
