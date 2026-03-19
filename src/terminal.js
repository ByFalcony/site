/**
 * TERMINAL BACKGROUND ANIMATION
 * Creates a scrolling "Linux command" effect on a canvas.
 */
export function initTerminalEffect(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to match parent
  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);

  const commands = [
    'root@emir:~# nmap -sV 192.168.1.1',
    '[+] Port 443 open: SSL/TLS',
    'systemctl status ai-analyzer',
    'grep -r "malware" /var/log/syslog',
    'whoami -> emir_kilic',
    'bash init_threat_intel.sh',
    'python3 collector.py --stream',
    'ssh root@93.184.216.34',
    '# CVE-2024-38077 PoC active',
    'curl -X POST https://api.cti.local',
    'docker ps | grep icsti',
    'cat /proc/cpuinfo | grep "model name"',
    'ls -la /home/emir/projects/ai',
    'metasploit-framework loading...',
    '[!] Intrusion detection alert: High',
    'exploit/multi/handler selected',
    'SET PAYLOAD windows/x64/meterpreter/reverse_tcp',
    '[*] Responding to LLMNR/NBT-NS/mDNS requests...',
    'hydra -l admin -P passwords.txt -t 4',
    'hashcat -m 1000 hashes.txt wordlist.txt',
    '[CRITICAL] Buffer overflow detected at 0x00401000',
    'apt-get update && apt-get upgrade -y',
    'tcpdump -i eth0 -w traffic.pcap',
    'wireshark loading dissectors...',
    'gobuster dir -u https://target.com -w common.txt',
    '[SUCCESS] Payload executed successfully',
    'nc -lvnp 4444',
    'sqlmap -u "http://site.com/id=1" --dbs',
    '# Encrypting assets for CTI report...',
    '[LOG] Thread ID 1284 terminated normally'
  ];

  const fontSize = 14;
  const columns = Math.floor(canvas.width / 180); // Increased frequency (smaller spacing)
  const drops = [];

  const colors = ['#00ff00', '#ff0000']; // Green and Red

  // Initialize drops - each drop is an object with position and current text
  for (let i = 0; i < columns; i++) {
    drops[i] = {
      x: i * (canvas.width / columns),
      y: Math.random() * -500,
      text: commands[Math.floor(Math.random() * commands.length)],
      speed: 1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function draw() {
    // Semi-transparent black to create trailing effect - slightly more opaque for better contrast
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `bold ${fontSize}px monospace`; // Added bold for better readability
    
    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      
      // Dynamic color (Green or Red) with glow
      ctx.fillStyle = drop.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = drop.color;
      
      ctx.fillText(drop.text, drop.x, drop.y);
      
      // Reset shadow for performance
      ctx.shadowBlur = 0;

      // Update position - slightly slower for readability
      drop.y += drop.speed * 0.8;

      // Reset if off bottom
      if (drop.y > canvas.height) {
        drop.y = -20;
        drop.text = commands[Math.floor(Math.random() * commands.length)];
        drop.color = colors[Math.floor(Math.random() * colors.length)]; // Randomize color on reset
        drop.speed = 1 + Math.random() * 2;
      }
    }
    
    requestAnimationFrame(draw);
  }

  draw();
}
