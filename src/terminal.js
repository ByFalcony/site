/**
 * TERMINAL BACKGROUND ANIMATION
 * Creates a scrolling "Linux command" effect on a canvas.
 */
export function initTerminalEffect(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to match viewport
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);

  const commands = [
    // CyberSecurity & CTI
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
    'metasploit-framework loading...',
    '[!] Intrusion detection alert: High',
    'exploit/multi/handler selected',
    'SET PAYLOAD windows/x64/meterpreter/reverse_tcp',
    '[*] Responding to LLMNR/NBT-NS/mDNS requests...',
    'hydra -l admin -P passwords.txt -t 4',
    'hashcat -m 1000 hashes.txt wordlist.txt',
    '[CRITICAL] Buffer overflow detected at 0x00401000',
    'tcpdump -i eth0 -w traffic.pcap',
    'gobuster dir -u https://target.com -w common.txt',
    '[SUCCESS] Payload executed successfully',
    'nc -lvnp 4444',
    'sqlmap -u "http://site.com/id=1" --dbs',
    '# Encrypting assets for CTI report...',
    '[LOG] Thread ID 1284 terminated normally',
    'whoami /priv',
    'net user /domain',
    'getsystem',
    'hashdump',
    'load kiwi',
    'creds_all',
    '[*] Session 1 opened (192.168.1.5:4444)',
    'aircrack-ng -w wordlist.txt capture.cap',
    'john --wordlist=rockyou.txt hashes.txt',
    'msfvenom -p windows/x64/shell_reverse_tcp',
    'exploit/multi/samba/usermap_script',
    
    // AI & Data Science
    'import torch; torch.cuda.is_available() -> True',
    'python3 train.py --epochs 100 --batch-size 32',
    'model.fit(X_train, y_train, validation_split=0.2)',
    'loading transformer weights (BERT-base)...',
    'inference time: 38ms (RTX 4090)',
    'vector_db.search("threat intelligence vector")',
    'LLM response generation in progress...',
    'embedding generation for 10^6 documents...',
    'data_cleaning.sh --dry-run completed',
    'spark-submit --master local[*] analytics.py',
    'tensorboard --logdir=runs',
    'scikit-learn: accuracy_score = 0.982',
    'pandas.read_csv("nvd_data_2024.csv")',
    
    // Dev & Ops
    'npm run build --production',
    'git push origin main [master 1a2b3c4]',
    'docker-compose up -d --build',
    'kubectl get pods -n security',
    'terraform apply -auto-approve',
    'aws s3 sync ./data s3://cti-vault',
    'systemctl restart nginx.service',
    'tail -f /var/log/nginx/access.log',
    'htop',
    'neofetch',
    'matrix-cli --connect-to-server',
    'apt-get update && apt-get upgrade -y',
    'ls -la /home/emir/projects/ai'
  ];

  const fontSizeBase = 14;
  const columns = Math.floor(canvas.width / 11);
  const drops = [];

  const colors = ['#00ff00', '#ff0000', '#00d4ff', '#888888'];

  // Initialize drops
  for (let i = 0; i < columns; i++) {
    drops[i] = {
      x: i * (canvas.width / columns),
      y: Math.random() * -1000,
      text: commands[Math.floor(Math.random() * commands.length)],
      speed: 0.5 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function draw() {
    // Semi-transparent black to create trailing effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font once per frame for all drops
    ctx.font = `bold ${fontSizeBase}px monospace`;

    // Batch rendering by color to minimize expensive state changes
    colors.forEach(color => {
      ctx.fillStyle = color;
      
      // Shadow only for accent color to save performance
      if (color === '#00d4ff') {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      } else {
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        if (drop.color === color) {
          ctx.fillText(drop.text, drop.x, drop.y);
        }
      }
    });

    // Reset shadow for next frame background clear/other operations
    ctx.shadowBlur = 0;

    // Update positions in a separate single loop
    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      drop.y += drop.speed * 2.1;

      // Reset if off bottom
      if (drop.y > canvas.height + 50) {
        drop.y = -20;
        drop.text = commands[Math.floor(Math.random() * commands.length)];
        drop.color = colors[Math.floor(Math.random() * colors.length)];
        drop.speed = 0.5 + Math.random() * 2.5;
      }
    }
    
    requestAnimationFrame(draw);
  }

  draw();
}
