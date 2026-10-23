using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Cs2BoosterCore;

/// <summary>
/// Feature 11: Backup and Restore System - Backup e restauração de configurações
/// </summary>
public class BackupSystem
{
    private readonly string _backupDir;
    private readonly List<string> _configFiles;
    
    public BackupSystem()
    {
        _backupDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "Cs2Booster", "backups");
        _configFiles = new List<string>
        {
            Path.Combine(AppContext.BaseDirectory, "config", "settings.json"),
            Path.Combine(AppContext.BaseDirectory, "config", "presets.json")
        };
    }
    
    public async Task<string> CreateBackupAsync(string? backupName = null)
    {
        if (!Directory.Exists(_backupDir))
        {
            Directory.CreateDirectory(_backupDir);
        }
        
        var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
        backupName ??= $"backup_{timestamp}";
        var backupPath = Path.Combine(_backupDir, backupName);
        
        if (Directory.Exists(backupPath))
        {
            backupPath = Path.Combine(_backupDir, $"{backupName}_{timestamp}");
        }
        
        Directory.CreateDirectory(backupPath);
        
        var backedUpFiles = new List<string>();
        
        // Backup config files
        foreach (var configFile in _configFiles)
        {
            if (File.Exists(configFile))
            {
                var dest = Path.Combine(backupPath, Path.GetFileName(configFile));
                File.Copy(configFile, dest, true);
                backedUpFiles.Add(configFile);
            }
        }
        
        // Save backup metadata
        var backupInfo = new
        {
            name = backupName,
            timestamp = timestamp,
            files = backedUpFiles,
            systemInfo = await GetSystemInfoAsync()
        };
        
        var infoFile = Path.Combine(backupPath, "backup_info.json");
        await File.WriteAllTextAsync(infoFile, JsonSerializer.Serialize(backupInfo, new JsonSerializerOptions { WriteIndented = true }));
        
        return backupPath;
    }
    
    public async Task<bool> RestoreBackupAsync(string backupName)
    {
        var backupPath = Path.Combine(_backupDir, backupName);
        if (!Directory.Exists(backupPath))
        {
            throw new FileNotFoundException($"Backup '{backupName}' nao encontrado.");
        }
        
        var infoFile = Path.Combine(backupPath, "backup_info.json");
        if (File.Exists(infoFile))
        {
            var info = JsonSerializer.Deserialize<object>(await File.ReadAllTextAsync(infoFile));
        }
        
        // Restore config files
        foreach (var file in Directory.GetFiles(backupPath))
        {
            // backup_info.json é metadado do backup: não faz parte das configs do app.
            if (file.EndsWith(".json", StringComparison.OrdinalIgnoreCase)
                && !Path.GetFileName(file).Equals("backup_info.json", StringComparison.OrdinalIgnoreCase))
            {
                var relativeName = Path.GetFileName(file);
                var dest = Path.Combine(AppContext.BaseDirectory, "config", relativeName);
                Directory.CreateDirectory(Path.GetDirectoryName(dest)!);
                File.Copy(file, dest, true);
            }
        }
        
        return true;
    }
    
    public List<object> ListBackups()
    {
        var backups = new List<object>();
        if (Directory.Exists(_backupDir))
        {
            foreach (var dir in Directory.GetDirectories(_backupDir))
            {
                var infoFile = Path.Combine(dir, "backup_info.json");
                if (File.Exists(infoFile))
                {
                    try
                    {
                        var info = JsonSerializer.Deserialize<object>(File.ReadAllText(infoFile));
                        backups.Add(info);
                    }
                    catch { }
                }
            }
        }
        return backups;
    }
    
    private Task<object> GetSystemInfoAsync()
    {
        return Task.FromResult<object>(new
        {
            os = Environment.OSVersion,
            processorCount = Environment.ProcessorCount,
            cs2Running = Process.GetProcessesByName("cs2").Length > 0,
            timestamp = DateTime.Now
        });
    }
}
