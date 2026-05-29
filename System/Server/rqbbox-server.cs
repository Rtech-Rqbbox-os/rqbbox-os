using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

class RQBBOXServer
{
  static string ROOT;
  static string DOWNLOADS_DIR;
  static string INSTALLED_FILE;
  static int PORT = 19777;

  static Dictionary<string, PackageInfo> PACKAGES = new Dictionary<string, PackageInfo>();

  class PackageInfo
  {
    public string title;
    public string category;
    public string type;
    public string icon;

    public PackageInfo(string t, string c, string ty, string i)
    { title = t; category = c; type = ty; icon = i; }
  }

  static void Main()
  {
    ROOT = AppDomain.CurrentDomain.BaseDirectory;
    // If RQBBOX.EXE is at root of USB, RQBBOX_OS is sibling
    string rqbboxOs = Path.Combine(ROOT, "RQBBOX_OS");
    if (Directory.Exists(rqbboxOs)) ROOT = rqbboxOs;
    // If RQBBOX.EXE is in System/ subfolder, go up 2 levels
    string parent = Path.GetFullPath(Path.Combine(ROOT, ".."));
    string parentOs = Path.Combine(parent, "RQBBOX_OS");
    if (Directory.Exists(parentOs)) ROOT = parentOs;
    DOWNLOADS_DIR = Path.Combine(ROOT, "Store", "downloads");
    INSTALLED_FILE = Path.Combine(ROOT, "Store", "catalog", "play-store-installed.json");

    Directory.CreateDirectory(DOWNLOADS_DIR);
    Directory.CreateDirectory(Path.GetDirectoryName(INSTALLED_FILE));

    InitPackages();

    Console.WriteLine("RQBBOX OS Server v1.0.0");
    Console.WriteLine("Root: " + ROOT);
    Console.WriteLine("USB Target: " + DOWNLOADS_DIR);
    Console.WriteLine("Listening on http://127.0.0.1:" + PORT + "/");
    Console.WriteLine("---");

    try
    {
      HttpListener listener = new HttpListener();
      listener.Prefixes.Add("http://127.0.0.1:" + PORT + "/");
      listener.Start();

      while (true)
      {
        var ctx = listener.GetContext();
        Task.Run(() => HandleRequest(ctx));
      }
    }
    catch (Exception)
    {
      Console.WriteLine("127.0.0.1 failed. Trying +:" + PORT + " (may need admin)...");
      try
      {
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://+:" + PORT + "/");
        listener.Start();

        while (true)
        {
          var ctx = listener.GetContext();
          Task.Run(() => HandleRequest(ctx));
        }
      }
      catch (Exception ex2)
      {
        Console.WriteLine("FATAL: " + ex2.Message);
        Console.WriteLine("Press Enter to exit...");
        Console.ReadLine();
      }
    }
  }

  static void InitPackages()
  {
    AddPkg("com.activision.callofduty.shooter","Call of Duty Mobile","FPS","Game","", "\U0001F3AF");
    AddPkg("com.miHoYo.GenshinImpact","Genshin Impact","RPG","Game","", "\u2694");
    AddPkg("com.tencent.ig","PUBG Mobile","FPS","Game","", "\U0001F3AF");
    AddPkg("com.mojang.minecraftpe","Minecraft","Sandbox","Game","", "\U0001F3D7");
    AddPkg("com.gameloft.android.ANMP.GloftA9HM","Asphalt 9","Racing","Game","", "\U0001F3CE");
    AddPkg("com.roblox.client","Roblox","Sandbox","Game","", "\U0001F3D7");
    AddPkg("com.mobile.legends","Mobile Legends","MOBA","Game","", "\u2694");
    AddPkg("com.supercell.clashroyale","Clash Royale","Strategy","Game","", "\U0001F6E1");
    AddPkg("com.innersloth.spacemafia","Among Us","Party","Game","", "\U0001F3AD");
    AddPkg("com.epicgames.fortnite","Fortnite","FPS","Game","", "\U0001F3AF");
    AddPkg("com.riotgames.league.wildrift","Wild Rift","MOBA","Game","", "\u2694");
    AddPkg("com.kiloo.subwaysurf","Subway Surfers","Arcade","Game","", "\U0001F3C3");
    AddPkg("com.android.chrome","Chrome","Browser","App","", "\U0001F310");
    AddPkg("com.termux","Termux","Tool","App","", "\U0001F4BB");
    AddPkg("org.videolan.vlc","VLC Media Player","Media","App","", "\U0001F4FA");
    AddPkg("org.fdroid.fdroid","F-Droid","Store","App","", "\U0001F4E6");
    AddPkg("com.valvesoftware.steamlink","Steam Link","Gaming","App","", "\U0001F3AE");
    AddPkg("com.limelight","Moonlight","Gaming","App","", "\U0001F3AE");
    AddPkg("com.rarlab.rar","ZArchiver","Tool","App","", "\U0001F5DC");
    AddPkg("com.joaomgcd.autonotification","Tasker","Tool","App","", "\u26A1");
    AddPkg("com.google.android.apps.maps","Google Maps","Navigation","App","", "\U0001F5FA");
    AddPkg("com.whatsapp","WhatsApp","Social","App","", "\U0001F4AC");
    AddPkg("com.instagram.android","Instagram","Social","App","", "\U0001F4F8");
    AddPkg("com.snapchat.android","Snapchat","Social","App","", "\U0001F47B");
    AddPkg("org.telegram.messenger","Telegram","Social","App","", "\u2708");
    AddPkg("com.microsoft.office.outlook","Outlook","Productivity","App","", "\U0001F4E7");
    AddPkg("com.google.android.keep","Google Keep","Productivity","App","", "\U0001F4DD");
    AddPkg("com.microsoft.office.officehubrow","Microsoft 365","Productivity","App","", "\U0001F4CA");
    AddPkg("com.adobe.reader","Adobe Reader","Productivity","App","", "\U0001F4C4");
    AddPkg("com.google.android.apps.photos","Google Photos","Media","App","", "\U0001F5BC");
    AddPkg("com.zhiliaoapp.musically","TikTok","Social","App","", "\U0001F3B5");
  }

  static void AddPkg(string id, string title, string cat, string type, string icon1, string icon2)
  {
    PACKAGES[id] = new PackageInfo(title, cat, type, icon1 + icon2);
  }

  static void HandleRequest(HttpListenerContext ctx)
  {
    try
    {
      var req = ctx.Request;
      var res = ctx.Response;
      var path = req.Url.AbsolutePath.ToLower();

      Console.WriteLine(req.HttpMethod + " " + path);

      if (path == "/api/play-store/packages")
      {
        var keys = PACKAGES.Keys.ToArray();
        var sb = new StringBuilder("[");
        for (int i = 0; i < keys.Length; i++)
        {
          if (i > 0) sb.Append(",");
          var kv = PACKAGES[keys[i]];
          sb.Append("{\"packageName\":\"" + JsonEscape(keys[i]) + "\",\"title\":\"" + JsonEscape(kv.title) + "\",\"category\":\"" + JsonEscape(kv.category) + "\",\"type\":\"" + JsonEscape(kv.type) + "\",\"icon\":\"" + JsonEscape(kv.icon) + "\",\"playStoreUrl\":\"https://play.google.com/store/apps/details?id=" + JsonEscape(keys[i]) + "\"}");
        }
        sb.Append("]");
        SendJson(res, 200, sb.ToString());
      }
      else if (path == "/api/play-store/installed")
      {
        var installed = ReadInstalled();
        SendJson(res, 200, "{\"ok\":true,\"installed\":" + installed + ",\"count\":" + CountJsonItems(installed) + "}");
      }
      else if (path == "/api/play-store/install" && req.HttpMethod == "POST")
      {
        string body = new StreamReader(req.InputStream).ReadToEnd();
        var match = Regex.Match(body, "\"id\"\\s*:\\s*\"([^\"]+)\"");
        string pkgId = match.Success ? match.Groups[1].Value : "";
        HandleInstall(res, pkgId);
      }
      else if (path == "/api/store")
      {
        var storePath = Path.Combine(ROOT, "Store", "catalog", "store.json");
        if (File.Exists(storePath))
        {
          string content = File.ReadAllText(storePath);
          SendRaw(res, 200, content, "application/json");
        }
        else SendJson(res, 404, "{\"error\":\"Store not found\"}");
      }
      else if (path == "/api/play-store/downloads")
      {
        var dlIndex = ReadDownloadsIndex();
        SendJson(res, 200, dlIndex);
      }
      else
      {
        ServeStatic(res, path);
      }
    }
    catch (Exception ex)
    {
      Console.WriteLine("Error: " + ex.Message);
    }
  }

  static void HandleInstall(HttpListenerResponse res, string pkgId)
  {
    if (string.IsNullOrEmpty(pkgId))
    {
      SendJson(res, 400, "{\"ok\":false,\"error\":\"Missing app id\"}");
      return;
    }

    if (!PACKAGES.ContainsKey(pkgId))
    {
      SendJson(res, 400, "{\"ok\":false,\"error\":\"Unsupported package\"}");
      return;
    }

    var meta = PACKAGES[pkgId];
    var installedJson = ReadInstalled();
    var installedList = ParseInstalledArray(installedJson);
    var existing = FindInstalled(installedList, pkgId);

    var appDir = Path.Combine(DOWNLOADS_DIR, pkgId);
    Directory.CreateDirectory(appDir);
    var apkPath = Path.Combine(appDir, "app.apk");

    if (existing != null)
    {
      if (existing.downloaded)
      {
        SendJson(res, 200, MakeInstallResult(meta, existing, true, null));
        return;
      }
    }

    Console.WriteLine("Downloading " + meta.title + " (" + pkgId + ")");

    bool dlOk = DownloadAPK(pkgId, apkPath);

    InstalledEntry entry = new InstalledEntry();
    entry.packageName = pkgId;
    entry.title = meta.title;
    entry.category = meta.category;
    entry.type = meta.type;
    entry.icon = meta.icon;
    entry.installedAt = DateTime.UtcNow.ToString("o");
    entry.playStoreUrl = "https://play.google.com/store/apps/details?id=" + pkgId;
    entry.rqbboxUrl = "/play/" + pkgId;
    entry.downloaded = dlOk;
    entry.apkPath = dlOk ? "/Store/downloads/" + pkgId + "/app.apk" : null;
    entry.size = dlOk ? new FileInfo(apkPath).Length : 0;

    if (dlOk)
    {
      Console.WriteLine("Downloaded: " + entry.size + " bytes");
    }
    else
    {
      Console.WriteLine("APK download failed for " + pkgId);
    }

    installedList.Add(entry);
    WriteInstalled(installedList);
    UpdateDownloadsIndex(pkgId, meta, entry);

    var result = MakeInstallResult(meta, entry, false, dlOk ? null : "APK download failed");
    SendJson(res, 200, result);
  }

  static bool DownloadAPK(string pkgId, string destPath)
  {
    string[] sources = {
      "https://d.apkpure.com/b/APK/" + pkgId + "?version=latest"
    };

    foreach (var url in sources)
    {
      try
      {
        var req = (HttpWebRequest)WebRequest.Create(url);
        req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
        req.Timeout = 30000;
        req.AllowAutoRedirect = true;

        using (var resp = req.GetResponse())
        using (var stream = resp.GetResponseStream())
        using (var file = File.Create(destPath))
        {
          byte[] buffer = new byte[81920];
          int bytes;
          while ((bytes = stream.Read(buffer, 0, buffer.Length)) > 0)
          {
            file.Write(buffer, 0, bytes);
          }
        }

        var fi = new FileInfo(destPath);
        if (fi.Length > 1000)
        {
          Console.WriteLine("Downloaded from APKPure: " + fi.Length + " bytes");
          return true;
        }
        else
        {
          File.Delete(destPath);
          return false;
        }
      }
      catch (Exception ex)
      {
        Console.WriteLine("APKPure download failed: " + ex.Message);
      }
    }
    return false;
  }

  static string MakeInstallResult(PackageInfo meta, InstalledEntry entry, bool alreadyInstalled, string error)
  {
    string msg;
    if (alreadyInstalled) msg = meta.title + " already on RQBBOX USB";
    else if (entry.downloaded) msg = meta.title + " downloaded to RQBBOX USB!";
    else msg = meta.title + " added to RQBBOX (download failed)";

    string entryJson = EntryToJson(entry);
    return "{\"ok\":true,\"message\":\"" + JsonEscape(msg) + "\",\"entry\":" + entryJson + ",\"playStoreUrl\":\"" + JsonEscape(entry.playStoreUrl) + "\",\"apkPath\":" + (entry.apkPath != null ? "\"" + JsonEscape(entry.apkPath) + "\"" : "null") + ",\"downloaded\":" + (entry.downloaded ? "true" : "false") + ",\"alreadyInstalled\":" + (alreadyInstalled ? "true" : "false") + "}";
  }

  static void UpdateDownloadsIndex(string pkgId, PackageInfo meta, InstalledEntry entry)
  {
    var idxPath = Path.Combine(DOWNLOADS_DIR, "index.json");
    string idxJson = "{}";
    try
    {
      if (File.Exists(idxPath))
        idxJson = File.ReadAllText(idxPath);
    }
    catch {}

    // Simple append to apps object
    string appEntry = "\"" + JsonEscape(pkgId) + "\":{\"title\":\"" + JsonEscape(meta.title) + "\",\"category\":\"" + JsonEscape(meta.category) + "\",\"type\":\"" + JsonEscape(meta.type) + "\",\"icon\":\"" + JsonEscape(meta.icon) + "\",\"downloadedAt\":\"" + JsonEscape(entry.installedAt) + "\",\"apkPath\":" + (entry.apkPath != null ? "\"" + JsonEscape(entry.apkPath) + "\"" : "null") + ",\"size\":" + entry.size + ",\"downloaded\":" + (entry.downloaded ? "true" : "false") + "}";

    // Build new index
    string newIdx = "{\"apps\":{" + appEntry + "},\"updated\":\"" + DateTime.UtcNow.ToString("o") + "\"}";
    try { File.WriteAllText(idxPath, newIdx); } catch {}
  }

  static void ServeStatic(HttpListenerResponse res, string path)
  {
    string filePath = null;

    if (path == "/" || path == "")
      filePath = Path.Combine(ROOT, "index.html");
    else if (path.StartsWith("/store/"))
      filePath = Path.Combine(ROOT, "Store", path.Substring(7).Replace('/', Path.DirectorySeparatorChar));
    else if (path.StartsWith("/games/"))
      filePath = Path.Combine(ROOT, "Games", path.Substring(7).Replace('/', Path.DirectorySeparatorChar));
    else if (path.StartsWith("/apps/"))
      filePath = Path.Combine(ROOT, "Apps", path.Substring(6).Replace('/', Path.DirectorySeparatorChar));
    else if (path.StartsWith("/system/"))
      filePath = Path.Combine(ROOT, "System", path.Substring(8).Replace('/', Path.DirectorySeparatorChar));
    else if (path.StartsWith("/media/"))
      filePath = Path.Combine(ROOT, "Media", path.Substring(7).Replace('/', Path.DirectorySeparatorChar));
    else if (path.StartsWith("/website/"))
      filePath = Path.Combine(ROOT, "System", "Website", path.Substring(9).Replace('/', Path.DirectorySeparatorChar));
    else if (path.StartsWith("/ai/"))
      filePath = Path.Combine(ROOT, "AI", path.Substring(4).Replace('/', Path.DirectorySeparatorChar));
    else
      filePath = Path.Combine(ROOT, "System", "Launcher", path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

    if (File.Exists(filePath))
    {
      string ext = Path.GetExtension(filePath).ToLower();
      string contentType = "application/octet-stream";
      if (ext == ".html" || ext == ".htm") contentType = "text/html; charset=utf-8";
      else if (ext == ".css") contentType = "text/css; charset=utf-8";
      else if (ext == ".js") contentType = "application/javascript; charset=utf-8";
      else if (ext == ".json") contentType = "application/json; charset=utf-8";
      else if (ext == ".png") contentType = "image/png";
      else if (ext == ".svg") contentType = "image/svg+xml";
      else if (ext == ".ico") contentType = "image/x-icon";
      else if (ext == ".woff2") contentType = "font/woff2";

      byte[] data = File.ReadAllBytes(filePath);
      res.ContentType = contentType;
      res.ContentLength64 = data.Length;
      res.OutputStream.Write(data, 0, data.Length);
      res.OutputStream.Close();
    }
    else
    {
      SendJson(res, 404, "{\"error\":\"Not found\"}");
    }
  }

  static string ReadInstalled()
  {
    try
    {
      if (File.Exists(INSTALLED_FILE))
        return File.ReadAllText(INSTALLED_FILE);
    }
    catch {}
    return "[]";
  }

  static void WriteInstalled(List<InstalledEntry> list)
  {
    try
    {
      var sb = new StringBuilder("[");
      for (int i = 0; i < list.Count; i++)
      {
        if (i > 0) sb.Append(",");
        sb.Append(EntryToJson(list[i]));
      }
      sb.Append("]");
      File.WriteAllText(INSTALLED_FILE, sb.ToString());
    }
    catch (Exception ex)
    {
      Console.WriteLine("Failed to write installed: " + ex.Message);
    }
  }

  static string EntryToJson(InstalledEntry e)
  {
    return "{\"packageName\":\"" + JsonEscape(e.packageName) + "\",\"title\":\"" + JsonEscape(e.title) + "\",\"category\":\"" + JsonEscape(e.category) + "\",\"type\":\"" + JsonEscape(e.type) + "\",\"icon\":\"" + JsonEscape(e.icon) + "\",\"installedAt\":\"" + JsonEscape(e.installedAt) + "\",\"playStoreUrl\":\"" + JsonEscape(e.playStoreUrl) + "\",\"rqbboxUrl\":\"" + JsonEscape(e.rqbboxUrl) + "\",\"downloaded\":" + (e.downloaded ? "true" : "false") + ",\"apkPath\":" + (e.apkPath != null ? "\"" + JsonEscape(e.apkPath) + "\"" : "null") + ",\"size\":" + e.size + "}";
  }

  static string ReadDownloadsIndex()
  {
    var idxPath = Path.Combine(DOWNLOADS_DIR, "index.json");
    try
    {
      if (File.Exists(idxPath))
        return File.ReadAllText(idxPath);
    }
    catch {}
    return "{\"apps\":{},\"updated\":\"" + DateTime.UtcNow.ToString("o") + "\"}";
  }

  static List<InstalledEntry> ParseInstalledArray(string json)
  {
    var list = new List<InstalledEntry>();
    try
    {
      var matches = Regex.Matches(json, "\"packageName\"\\s*:\\s*\"([^\"]+)\"");
      var titles = Regex.Matches(json, "\"title\"\\s*:\\s*\"([^\"]+)\"");
      var cats = Regex.Matches(json, "\"category\"\\s*:\\s*\"([^\"]+)\"");
      var types = Regex.Matches(json, "\"type\"\\s*:\\s*\"([^\"]+)\"");
      var icons = Regex.Matches(json, "\"icon\"\\s*:\\s*\"([^\"]+)\"");
      var dls = Regex.Matches(json, "\"downloaded\"\\s*:\\s*(true|false)");
      var apks = Regex.Matches(json, "\"apkPath\"\\s*:\\s*\"([^\"]+)\"");

      for (int i = 0; i < matches.Count; i++)
      {
        var e = new InstalledEntry();
        e.packageName = matches[i].Groups[1].Value;
        if (i < titles.Count) e.title = titles[i].Groups[1].Value;
        if (i < cats.Count) e.category = cats[i].Groups[1].Value;
        if (i < types.Count) e.type = types[i].Groups[1].Value;
        if (i < icons.Count) e.icon = icons[i].Groups[1].Value;
        if (i < dls.Count) e.downloaded = dls[i].Groups[1].Value == "true";
        if (i < apks.Count) e.apkPath = apks[i].Groups[1].Value;
        list.Add(e);
      }
    }
    catch {}
    return list;
  }

  static InstalledEntry FindInstalled(List<InstalledEntry> list, string pkgId)
  {
    foreach (var e in list)
    {
      if (e.packageName == pkgId) return e;
    }
    return null;
  }

  static int CountJsonItems(string json)
  {
    int count = 0;
    int idx = 0;
    while ((idx = json.IndexOf("\"packageName\"", idx)) != -1)
    {
      count++;
      idx++;
    }
    return count;
  }

  static string JsonEscape(string s)
  {
    if (s == null) return "";
    return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "\\r");
  }

  static void SendJson(HttpListenerResponse res, int status, string json)
  {
    byte[] buffer = Encoding.UTF8.GetBytes(json);
    res.StatusCode = status;
    res.ContentType = "application/json; charset=utf-8";
    res.ContentLength64 = buffer.Length;
    res.OutputStream.Write(buffer, 0, buffer.Length);
    res.OutputStream.Close();
  }

  static void SendRaw(HttpListenerResponse res, int status, string content, string contentType)
  {
    byte[] buffer = Encoding.UTF8.GetBytes(content);
    res.StatusCode = status;
    res.ContentType = contentType;
    res.ContentLength64 = buffer.Length;
    res.OutputStream.Write(buffer, 0, buffer.Length);
    res.OutputStream.Close();
  }
}

class InstalledEntry
{
  public string packageName = "";
  public string title = "";
  public string category = "";
  public string type = "";
  public string icon = "";
  public string installedAt = "";
  public string playStoreUrl = "";
  public string rqbboxUrl = "";
  public bool downloaded = false;
  public string apkPath = null;
  public long size = 0;
}
