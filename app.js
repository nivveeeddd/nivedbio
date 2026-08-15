/* ==========================================================================
   KIZAKI // CLEAN WHITE & CRIMSON THEME ENGINE
   ========================================================================== */

const KizakiApp = (function () {
    // Sound FX Web Audio Synthesizer
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playHitSound() {
        try {
            initAudio();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    /* ----------------------------------------------------------------------
       1. INTERACTIVE CLI TERMINAL
       ---------------------------------------------------------------------- */
    const commands = {
        help: `Available commands:<br>
        • <span class="text-crimson">about</span> - Kizaki user profile<br>
        • <span class="text-crimson">specs</span> - Hardware &amp; PC specs<br>
        • <span class="text-crimson">games</span> - Top gaming picks<br>
        • <span class="text-crimson">socials</span> - View Discord &amp; Steam handles<br>
        • <span class="text-crimson">clear</span> - Clear output`,

        about: `▶ <strong>NAME:</strong> Kizaki (Male)<br>
        ▶ <strong>FOCUS:</strong> Gaming, PC hardware, and Tech overall`,

        specs: `💻 <strong>GAMING &amp; TECH SPECS:</strong><br>
        • CPU: AMD Ryzen 5 5500 (6C/12T)<br>
        • GPU: NVIDIA GeForce GTX 1660 OC 6GB<br>
        • RAM: 16GB DDR4 RAM<br>
        • DISPLAY: 200Hz Acer Gaming Monitor<br>
        • MOUSE: HyperX Pulsefire Haste 2<br>
        • MIC: Fifine A6V (AmpliGame)`,

        games: `🎮 <strong>KIZAKI'S GAMING VAULT:</strong><br>
        1. Minecraft [10/10 - "i love it 10/10"]<br>
        2. Elden Ring [9.9/10 - "boss of games"]<br>
        3. Forza Horizon 6 [10/10 - "visuals are damn good"]<br>
        4. EA FC 26 [8/10]<br>
        5. Valorant [3/10 - "only with friends lol"]`,

        socials: `🌐 <strong>CONTACT HANDLES:</strong><br>
        • Discord: <span class="text-crimson">honestly.nived</span><br>
        • Steam: <span class="text-crimson">Kizaki [Gaming Rig]</span><br>
        • GitHub: <span class="text-crimson">@nivveeeddd</span>`
    };

    function initTerminal() {
        const form = document.getElementById('termForm');
        const input = document.getElementById('termInput');
        const output = document.getElementById('termOutput');
        const clearBtn = document.getElementById('clearTermBtn');

        if (!form || !input || !output) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const cmd = input.value.trim().toLowerCase();
            if (cmd) {
                execCmd(cmd);
                input.value = '';
            }
        });

        document.querySelectorAll('.chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.getAttribute('data-cmd');
                playHitSound();
                execCmd(cmd);
            });
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                playHitSound();
                output.innerHTML = `<div class="term-row system">Output cleared. Type <span class="text-crimson">'help'</span> for command list.</div>`;
            });
        }
    }

    function execCmd(cmd) {
        const output = document.getElementById('termOutput');
        playHitSound();

        const pLine = document.createElement('div');
        pLine.className = 'term-row';
        pLine.innerHTML = `<span class="prompt">kizaki@dev-rig:~$</span> <span class="input-text">${escapeHTML(cmd)}</span>`;
        output.appendChild(pLine);

        const rLine = document.createElement('div');
        rLine.className = 'term-row response';

        if (cmd === 'clear') {
            output.innerHTML = '';
            return;
        } else if (commands[cmd]) {
            rLine.innerHTML = commands[cmd];
        } else {
            rLine.innerHTML = `Unknown command: '<span class="text-crimson">${escapeHTML(cmd)}</span>'. Type '<span class="text-crimson">help</span>' for available commands.`;
        }

        output.appendChild(rLine);
        output.scrollTop = output.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    /* ----------------------------------------------------------------------
       2. HARDWARE BENCHMARK ESTIMATOR
       ---------------------------------------------------------------------- */
    const benchData = {
        minecraft: {
            '1080p': { fps: '250–300', ft: '3.5 ms', gpu: '50–75%', preset: 'High' },
            '1440p': { fps: '180–220', ft: '5.2 ms', gpu: '70–88%', preset: '1440p High' }
        },
        valorant: {
            '1080p': { fps: '200–300', ft: '4.0 ms', gpu: '40–70%', preset: 'Low/Competitive' },
            '1440p': { fps: '160–220', ft: '5.5 ms', gpu: '65–85%', preset: '1440p Low' }
        },
        elden: {
            '1080p': { fps: '55–60', ft: '16.6 ms', gpu: '85–99%', preset: 'High' },
            '1440p': { fps: '40–50', ft: '22.0 ms', gpu: '95–99%', preset: '1440p High' }
        },
        forza: {
            '1080p': { fps: '45–60', ft: '18.1 ms', gpu: '90–99%', preset: 'Medium/High' },
            '1440p': { fps: '35–45', ft: '25.0 ms', gpu: '98–99%', preset: '1440p Medium' }
        },
        easports: {
            '1080p': { fps: '60', ft: '16.6 ms', gpu: '60–95%', preset: 'High/Ultra' },
            '1440p': { fps: '50–60', ft: '18.5 ms', gpu: '80–98%', preset: '1440p High' }
        }
    };

    function initBenchmark() {
        const gameSel = document.getElementById('benchGame');
        const resSel = document.getElementById('benchRes');

        if (!gameSel || !resSel) return;

        const updateBench = () => {
            const g = gameSel.value;
            const r = resSel.value;

            if (benchData[g] && benchData[g][r]) {
                const d = benchData[g][r];
                document.getElementById('fpsNum').textContent = d.fps;
                document.getElementById('fpsFrameTime').textContent = d.ft;
                document.getElementById('fpsGpuUtil').textContent = d.gpu;
                document.getElementById('fpsPreset').textContent = d.preset;
                playHitSound();
            }
        };

        gameSel.addEventListener('change', updateBench);
        resSel.addEventListener('change', updateBench);
    }

    /* ----------------------------------------------------------------------
       3. LIVE DISCORD RICH PRESENCE ENGINE (Lanyard API Integration)
       ---------------------------------------------------------------------- */
    let lanyardSocket = null;

    const DEFAULT_DISCORD_ID = '1292809455733440522';

    function initDiscordPresence() {
        const connectBtn = document.getElementById('connectDiscordBtn');
        const idInput = document.getElementById('discordIdInput');

        // Preset user ID
        const activeId = localStorage.getItem('kizaki_discord_id') || DEFAULT_DISCORD_ID;
        if (idInput) {
            idInput.value = activeId;
        }
        fetchLanyardPresence(activeId);

        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                const userId = idInput ? idInput.value.trim() : DEFAULT_DISCORD_ID;
                if (userId) {
                    localStorage.setItem('kizaki_discord_id', userId);
                    fetchLanyardPresence(userId);
                    playHitSound();
                } else {
                    showToast('Please paste a valid Discord User ID');
                }
            });
        }
    }

    function fetchLanyardPresence(userId) {
        fetch(`https://api.lanyard.rest/v1/users/${userId}`)
            .then(res => res.json())
            .then(res => {
                if (res.success && res.data) {
                    updateDiscordUI(res.data);
                } else {
                    showToast('Could not fetch presence. Ensure you are in Lanyard Discord server.');
                }
            })
            .catch(() => {
                showToast('Lanyard connection notice.');
            });
    }

    function updateDiscordUI(data) {
        const badge = document.getElementById('discordStatusBadge');
        const heroBadge = document.getElementById('heroDiscordBadge');
        const pill = document.getElementById('discordStatusPill');
        const heroPill = document.getElementById('heroStatusPill');
        const username = document.getElementById('discordUsername');
        const tag = document.getElementById('discordTag');
        const avatar = document.getElementById('discordAvatar');
        const heroAvatar = document.getElementById('profileImage');

        const name = idName(data);
        const status = data.discord_status || 'offline';

        if (username) username.textContent = name;
        if (tag) tag.textContent = `@${data.discord_user.username}`;
        
        if (avatar && data.discord_user.avatar) {
            avatar.src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
        }

        if (badge) {
            badge.className = `status-badge ${status}`;
        }
        if (heroBadge) {
            heroBadge.className = `hero-discord-badge ${status}`;
            heroBadge.title = `Discord Status: ${status.toUpperCase()}`;
        }

        if (pill) {
            const statusLabels = { online: '🟢 ONLINE', idle: '🌙 IDLE', dnd: '⛔ DO NOT DISTURB', offline: '⚪ OFFLINE' };
            pill.className = `status-pill ${status}`;
            pill.textContent = statusLabels[status] || '🟢 ONLINE';
        }

        if (heroPill) {
            const statusLabels = { online: '🟢 ONLINE', idle: '🌙 IDLE', dnd: '⛔ DO NOT DISTURB', offline: '⚪ OFFLINE' };
            heroPill.className = `status-indicator ${status}`;
            heroPill.innerHTML = `<span class="status-dot"></span> DISCORD // ${statusLabels[status] || 'ONLINE'}`;
        }

        // Activities & Spotify Sync
        const actBox = document.getElementById('discordActivityBox');
        const actIcon = document.getElementById('activityIcon');
        const spotTitle = document.getElementById('spotifyCardTitle');
        const spotSub = document.getElementById('spotifyCardSub');

        const actName = document.getElementById('activityName');
        const actState = document.getElementById('activityState');
        const actTime = document.getElementById('activityTime');
        const actType = document.getElementById('activityType');

        if (data.listening_to_spotify) {
            const s = data.spotify;
            if (actIcon) {
                actIcon.className = 'fa-brands fa-spotify activity-icon';
                actIcon.style.color = '#1ed760';
            }
            if (actType) actType.textContent = 'LISTENING TO SPOTIFY';
            if (actName) actName.textContent = s.song;
            if (actState) actState.textContent = `by ${s.artist} • ${s.album}`;
            if (actTime) actTime.textContent = '🎵 Spotify Live Sync Active';

            // Connect section Spotify Card
            if (spotTitle) spotTitle.textContent = s.song;
            if (spotSub) spotSub.textContent = `by ${s.artist}`;
        } else if (data.activities && data.activities.length > 0) {
            const a = data.activities.find(x => x.type === 0) || data.activities[0];
            if (actIcon) {
                actIcon.className = 'fa-solid fa-gamepad activity-icon text-crimson';
                actIcon.style.color = '';
            }
            if (actType) actType.textContent = a.type === 0 ? 'PLAYING GAME' : 'LIVE ACTIVITY';
            if (actName) actName.textContent = a.name;
            if (actState) actState.textContent = a.details || a.state || 'In Progress';
            if (actTime) actTime.textContent = '⚡ Live Presence Active';

            if (spotTitle) spotTitle.textContent = 'Spotify Live';
            if (spotSub) spotSub.textContent = 'Not currently playing Spotify';
        } else {
            if (actIcon) {
                actIcon.className = 'fa-solid fa-gamepad activity-icon text-crimson';
                actIcon.style.color = '';
            }
            if (actType) actType.textContent = 'CURRENT STATUS';
            if (actName) actName.textContent = 'Chilling / Coding';
            if (actState) actState.textContent = 'No active game detected';
            if (actTime) actTime.textContent = 'Status: Ready for Gaming';

            if (spotTitle) spotTitle.textContent = 'Spotify Live';
            if (spotSub) spotSub.textContent = 'Not currently playing Spotify';
        }
    }

    function idName(data) {
        return data.discord_user.global_name || data.discord_user.username || 'Kizaki';
    }

    /* ----------------------------------------------------------------------
       4. COPY DISCORD & UTILITIES
       ---------------------------------------------------------------------- */
    function copyDiscord() {
        const handle = "honestly.nived";
        navigator.clipboard.writeText(handle).then(() => {
            showToast(`Discord tag "${handle}" copied to clipboard!`);
            playHitSound();
        });
    }

    function showToast(msg) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        if (!toast || !toastMsg) return;

        toastMsg.textContent = msg;
        toast.classList.add('show');

        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function init() {
        initTerminal();
        initBenchmark();
        initDiscordPresence();

        const copyHeroBtn = document.getElementById('copyDiscordHeroBtn');
        const copyNavBtn = document.getElementById('copyDiscordNavBtn');

        if (copyHeroBtn) copyHeroBtn.addEventListener('click', copyDiscord);
        if (copyNavBtn) copyNavBtn.addEventListener('click', copyDiscord);
    }

    window.addEventListener('DOMContentLoaded', init);

    return {
        copyDiscord
    };
})();
