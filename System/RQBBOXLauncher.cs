using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace RhysTech.RQBBOX
{
    static class RQBBOXProgram
    {
        const int Port = 19777;
        const string LaunchUrl = "http://127.0.0.1:19777/";

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string root = FindRQBRoot();
            if (root == null)
            {
                MessageBox.Show(
                    "RQBBOX OS not found.\n\nPlace RQBBOX.exe on the USB next to the RQBBOX_OS folder.",
                    "RQBBOX OS Portable USB",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
                return;
            }

            string drive = root.Substring(0, 1);
            if (!StartServer(root, drive))
            {
                MessageBox.Show("Could not start RQBBOX system server.", "RQBBOX OS", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }

            Thread.Sleep(2500);

            if (!LaunchBrowser())
            {
                Process.Start(new ProcessStartInfo(LaunchUrl) { UseShellExecute = true });
            }
        }

        static string FindRQBRoot()
        {
            string exeDir = Path.GetDirectoryName(Application.ExecutablePath);
            string[] candidates = new string[]
            {
                Path.Combine(exeDir ?? "", "RQBBOX_OS"),
                exeDir ?? "",
                Path.Combine(exeDir ?? "", "..", "RQBBOX_OS"),
            };

            foreach (string c in candidates)
            {
                try
                {
                    string full = Path.GetFullPath(c);
                    if (Directory.Exists(Path.Combine(full, "System", "Launcher")))
                        return full;
                }
                catch { }
            }

            foreach (DriveInfo d in DriveInfo.GetDrives())
            {
                try
                {
                    if (!d.IsReady || d.DriveType != DriveType.Removable) continue;
                    string p = Path.Combine(d.Name, "RQBBOX_OS");
                    if (Directory.Exists(Path.Combine(p, "System", "Launcher")))
                        return p;
                }
                catch { }
            }
            return null;
        }

        static bool StartServer(string root, string driveLetter)
        {
            string script = Path.Combine(root, "System", "RQBBOX-Server.ps1");
            string pidFile = Path.Combine(root, "System", "rqbbox-server.pid");

            if (File.Exists(pidFile))
            {
                try
                {
                    int pid = int.Parse(File.ReadAllText(pidFile).Trim());
                    Process.GetProcessById(pid);
                    return true;
                }
                catch { }
            }

            if (!File.Exists(script)) return false;

            var psi = new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = string.Format("-ExecutionPolicy Bypass -WindowStyle Hidden -File \"{0}\" -DriveLetter {1} -Port {2}", script, driveLetter, Port),
                WindowStyle = ProcessWindowStyle.Hidden,
                CreateNoWindow = true,
                UseShellExecute = false
            };
            Process.Start(psi);
            return true;
        }

        static bool LaunchBrowser()
        {
            string[] edges = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft", "Edge", "Application", "msedge.exe")
            };

            foreach (string edge in edges)
            {
                if (!File.Exists(edge)) continue;
                var psi = new ProcessStartInfo
                {
                    FileName = edge,
                    Arguments = string.Format("--app={0} --start-fullscreen --disable-extensions --no-first-run --edge-kiosk-type=fullscreen", LaunchUrl),
                    UseShellExecute = false
                };
                Process.Start(psi);
                return true;
            }
            return false;
        }
    }
}
