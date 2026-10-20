"""
CS2 Booster - Interface moderna (PyQt5 + pyqtgraph)
Orquestra o motor Cs2BoosterApp (--apply / --revert / --status / --monitor)
e monitora CS2 / sistema em tempo real.
"""
import os
import sys
import subprocess
import threading
import time
from collections import deque

import psutil
from PyQt5.QtCore import Qt, QTimer, QObject, pyqtSignal, QThreadPool, QRunnable
from PyQt5.QtGui import QFont
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QGridLayout,
    QLabel, QPushButton, QTabWidget, QTableWidget, QTableWidgetItem, QHeaderView,
    QProgressBar, QFrame, QGroupBox, QComboBox, QTextEdit, QStatusBar,
    QMessageBox, QSystemTrayIcon, QMenu, QAction,
)

import pyqtgraph as pg

APP_DIR = os.path.dirname(os.path.abspath(__file__))
ENGINE_CANDIDATES = [
    os.path.join(APP_DIR, "engine", "Cs2BoosterApp.exe"),
    r"C:\Users\forrydev\Desktop\cscheats_mono\Cs2Booster\Cs2BoosterApp\bin\Release\net8.0-windows\Cs2Booster.exe",
]


def find_engine() -> str:
    for p in ENGINE_CANDIDATES:
        if os.path.isfile(p):
            return p
    return ""


ENGINE = find_engine()

# Paleta dark premium
BG = "#0d1117"
BG_ALT = "#161b22"
PANEL = "#1c2128"
ACCENT = "#58a6ff"
GREEN = "#3fb950"
RED = "#f85149"
YELLOW = "#d29922"
FG = "#e6edf3"
FG_DIM = "#8b949e"

pg.setConfigOptions(antialias=True, background=PANEL, foreground=FG_DIM)

STYLESHEET = f"""
QMainWindow {{ background: {BG}; }}
QWidget {{ color: {FG}; font-family: 'Segoe UI'; font-size: 13px; }}
QTabWidget::pane {{ border: 1px solid #30363d; border-radius: 6px; background: {BG_ALT}; }}
QTabBar::tab {{
    background: {BG_ALT}; color: {FG_DIM}; padding: 8px 18px;
    border-top-left-radius: 6px; border-top-right-radius: 6px; margin-right: 2px;
}}
QTabBar::tab:selected {{ background: {PANEL}; color: {ACCENT}; border: 1px solid #30363d; }}
QPushButton {{
    background: {PANEL}; border: 1px solid #30363d; border-radius: 6px;
    padding: 8px 16px; color: {FG};
}}
QPushButton:hover {{ border-color: {ACCENT}; color: {ACCENT}; }}
QPushButton:pressed {{ background: #21262d; }}
QPushButton:disabled {{ color: #484f58; border-color: #21262d; }}
QPushButton#primary {{ background: #1f6feb; border: none; font-weight: 600; }}
QPushButton#primary:hover {{ background: #388bfd; color: white; }}
QPushButton#danger {{ background: #b62324; border: none; font-weight: 600; color: white; }}
QPushButton#danger:hover {{ background: #da3633; }}
QGroupBox {{
    border: 1px solid #30363d; border-radius: 8px; margin-top: 12px;
    padding-top: 8px; background: {PANEL}; font-weight: 600;
}}
QGroupBox::title {{ subcontrol-origin: margin; left: 12px; padding: 0 4px; color: {ACCENT}; }}
QTableWidget {{ background: {BG_ALT}; border: none; gridline-color: #21262d; }}
QTableWidget::item:selected {{ background: #1f6feb; }}
QHeaderView::section {{
    background: {PANEL}; border: none; padding: 6px; color: {FG_DIM}; font-weight: 600;
}}
QTextEdit, QComboBox {{ background: {BG_ALT}; border: 1px solid #30363d; border-radius: 6px; padding: 4px; }}
QProgressBar {{
    background: {BG_ALT}; border: 1px solid #30363d; border-radius: 6px;
    text-align: center; height: 18px; color: {FG};
}}
QProgressBar::chunk {{ background: qlineargradient(x1:0,y1:0,x2:1,y2:0, stop:0 #1f6feb, stop:1 #3fb950); border-radius: 5px; }}
QStatusBar {{ background: {PANEL}; color: {FG_DIM}; }}
QLabel#metric {{ font-size: 26px; font-weight: 700; }}
QLabel#title {{ font-size: 18px; font-weight: 700; color: {ACCENT}; }}
"""


class MetricCard(QFrame):
    def __init__(self, title, color=ACCENT):
        super().__init__()
        self.setStyleSheet(
            f"QFrame {{ background: {PANEL}; border: 1px solid #30363d; border-radius: 10px; }}"
        )
        lay = QVBoxLayout(self)
        lay.setContentsMargins(14, 10, 14, 10)
        lbl_title = QLabel(title)
        lbl_title.setStyleSheet(f"color: {FG_DIM}; font-size: 12px; font-weight: 600;")
        self.lbl_value = QLabel("--")
        self.lbl_value.setStyleSheet(f"color: {color}; font-size: 26px; font-weight: 700;")
        self.lbl_sub = QLabel("")
        self.lbl_sub.setStyleSheet(f"color: {FG_DIM}; font-size: 11px;")
        lay.addWidget(lbl_title)
        lay.addWidget(self.lbl_value)
        lay.addWidget(self.lbl_sub)

    def set_value(self, value, sub=""):
        self.lbl_value.setText(value)
        self.lbl_sub.setText(sub)


def run_engine(args, timeout=60):
    if not ENGINE:
        return False, "Motor Cs2BoosterApp.exe nao encontrado. Compile com: dotnet publish Cs2BoosterApp"
    try:
        r = subprocess.run(
            [ENGINE] + args, capture_output=True, text=True, timeout=timeout,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        out = (r.stdout or "") + (r.stderr or "")
        return r.returncode == 0, out.strip()
    except Exception as e:
        return False, str(e)


class _EngineResult:
    """Contêiner para o resultado da execução do motor (thread-safe)."""
    def __init__(self):
        self._lock = threading.Lock()
        self.ok = None
        self.out = None
        self.action = None
        self._done = threading.Event()

    def set(self, ok, out, action):
        with self._lock:
            self.ok = ok
            self.out = out
            self.action = action
            self._done.set()

    def wait(self, timeout=90):
        return self._done.wait(timeout)


class EngineWorker:
    """Thread simples nemic, sem depêndencia de QObject/QThread."""
    def __init__(self, action, args, timeout=60):
        self.action = action
        self.args = args
        self.timeout = timeout
        self.result = _EngineResult()

    def run(self):
        ok, out = run_engine(self.args, self.timeout)
        self.result.set(ok, out, self.action)


class _Runnable:
    """Fachada independente para o serviço threaded (sem QRunnable)."""
    def __init__(self, fn):
        self.fn = fn

    def run(self):
        self.fn()


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CS2 Booster Pro - Performance & Latency")
        self.resize(1100, 720)
        self.engine_busy = False
        self._t0 = time.time()
        self._build_ui()
        self._build_tray()
        self._wire_timers()
        self.log("Motor: " + (ENGINE or "NAO ENCONTRADO — compile Cs2BoosterApp"))

    def _build_ui(self):
        self.tabs = QTabWidget()
        self.tabs.addTab(self._tab_dashboard(), "Dashboard")
        self.tabs.addTab(self._tab_tweaks(), "Otimização")
        self.tabs.addTab(self._tab_network(), "Rede")
        self.tabs.addTab(self._tab_processes(), "Processos")
        self.tabs.addTab(self._tab_log(), "Log")
        self.setCentralWidget(self.tabs)

        self.status = QStatusBar()
        self.setStatusBar(self.status)
        self.status.showMessage("Pronto")

        self._poll_admin()

    def _tab_dashboard(self):
        w = QWidget()
        v = QVBoxLayout(w)
        header = QHBoxLayout()
        title = QLabel("CS2 Booster")
        title.setObjectName("title")
        self.lbl_cs2 = QLabel("CS2: —")
        self.lbl_admin = QLabel("Admin: —")
        header.addWidget(title)
        header.addStretch()
        header.addWidget(self.lbl_cs2)
        header.addWidget(self.lbl_admin)
        v.addLayout(header)

        cards = QHBoxLayout()
        self.card_cpu = MetricCard("CPU", ACCENT)
        self.card_ram = MetricCard("Memória", GREEN)
        self.card_cs2 = MetricCard("CS2", YELLOW)
        self.card_net = MetricCard("Rede", RED)
        for c in (self.card_cpu, self.card_ram, self.card_cs2, self.card_net):
            cards.addWidget(c)
        v.addLayout(cards)

        charts = QGridLayout()
        self.plot_cpu = self._make_plot("CPU (%)")
        self.plot_ram = self._make_plot("RAM (%)")
        charts.addWidget(self._wrap_plot(self.plot_cpu, "CPU — último minuto"), 0, 0)
        charts.addWidget(self._wrap_plot(self.plot_ram, "RAM — último minuto"), 0, 1)
        self.plot_cs2_cpu = self._make_plot("CS2 CPU (%)")
        self.plot_cs2_ram = self._make_plot("CS2 RAM (MB)")
        charts.addWidget(self._wrap_plot(self.plot_cs2_cpu, "CS2 — CPU"), 1, 0)
        charts.addWidget(self._wrap_plot(self.plot_cs2_ram, "CS2 — Memória (MB)"), 1, 1)
        v.addLayout(charts, stretch=1)
        return w

    def _make_plot(self, label):
        p = pg.PlotWidget()
        p.setMouseEnabled(x=False, y=False)
        p.hideButtons()
        p.showGrid(x=True, y=True, alpha=0.15)
        p.setLabel("left", label)
        p.setLimits(xMin=0, xMax=61)
        p.getAxis("bottom").setTicks([[(i, f"-{61-i}s") for i in range(0, 61, 20)]])
        return p

    def _wrap_plot(self, plot, title):
        box = QGroupBox(title)
        lay = QVBoxLayout(box)
        lay.setContentsMargins(6, 14, 6, 6)
        lay.addWidget(plot)
        return box

    def _tab_tweaks(self):
        w = QWidget()
        v = QVBoxLayout(w)
        info = QLabel(
            "Aplica o conjunto completo do motor: prioridade do cs2.exe, Game DVR off,\n"
            "TCP tuning, plano de energia de Alto Desempenho e monitor em background.\n"
            "Execute a GUI como Administrador para efeito total."
        )
        info.setStyleSheet(f"color: {FG_DIM};")
        v.addWidget(info)

        btns = QHBoxLayout()
        self.btn_apply = QPushButton("Aplicar Otimização Completa")
        self.btn_apply.setObjectName("primary")
        self.btn_revert = QPushButton("Reverter ao Padrão")
        self.btn_revert.setObjectName("danger")
        self.btn_status = QPushButton("Diagnóstico (status)")
        btns.addWidget(self.btn_apply)
        btns.addWidget(self.btn_revert)
        btns.addWidget(self.btn_status)
        btns.addStretch()
        v.addLayout(btns)

        self.progress = QProgressBar()
        self.progress.setRange(0, 1)
        self.progress.setValue(0)
        v.addWidget(self.progress)

        grp = QGroupBox("Saída do motor")
        gl = QVBoxLayout(grp)
        self.engine_out = QTextEdit()
        self.engine_out.setReadOnly(True)
        self.engine_out.setFont(QFont("Consolas", 9))
        gl.addWidget(self.engine_out)
        v.addWidget(grp, stretch=1)

        self.btn_apply.clicked.connect(lambda: self._engine_action("apply", ["--apply"]))
        self.btn_revert.clicked.connect(lambda: self._engine_action("revert", ["--revert"]))
        self.btn_status.clicked.connect(lambda: self._engine_action("status", ["--status"]))
        return w

    def _tab_network(self):
        w = QWidget()
        v = QVBoxLayout(w)
        grp = QGroupBox("Diagnóstico de rede")
        gl = QVBoxLayout(grp)
        self.net_out = QTextEdit()
        self.net_out.setReadOnly(True)
        self.net_out.setFont(QFont("Consolas", 9))
        btn = QPushButton("Testar latência (1.1.1.1 / steam)")
        btn.setObjectName("primary")
        btn.clicked.connect(self._test_latency)
        gl.addWidget(self.net_out)
        gl.addWidget(btn)
        v.addWidget(grp)

        grp2 = QGroupBox("Conexões estabelecidas do CS2")
        gl2 = QVBoxLayout(grp2)
        self.tbl_net = QTableWidget(0, 3)
        self.tbl_net.setHorizontalHeaderLabels(["Porta local", "Endereço remoto", "Estado"])
        self.tbl_net.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.tbl_net.verticalHeader().setVisible(False)
        gl2.addWidget(self.tbl_net)
        v.addWidget(grp2, stretch=1)
        return w

    def _tab_processes(self):
        w = QWidget()
        v = QVBoxLayout(w)
        top = QHBoxLayout()
        self.proc_filter = QComboBox()
        self.proc_filter.addItems(["Todos", "cs2", "steam", "jogos (uso alto)"])
        self.proc_filter.currentTextChanged.connect(self._refresh_processes)
        refresh = QPushButton("Atualizar")
        refresh.clicked.connect(self._refresh_processes)
        top.addWidget(QLabel("Filtro:"))
        top.addWidget(self.proc_filter)
        top.addStretch()
        top.addWidget(refresh)
        v.addLayout(top)

        self.tbl_proc = QTableWidget(0, 5)
        self.tbl_proc.setHorizontalHeaderLabels(["PID", "Nome", "CPU %", "Memória (MB)", "Prioridade"])
        self.tbl_proc.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.tbl_proc.verticalHeader().setVisible(False)
        v.addWidget(self.tbl_proc)
        self._refresh_processes()
        return w

    def _tab_log(self):
        w = QWidget()
        v = QVBoxLayout(w)
        self.txt_log = QTextEdit()
        self.txt_log.setReadOnly(True)
        self.txt_log.setFont(QFont("Consolas", 9))
        v.addWidget(self.txt_log)
        return w

    def _build_tray(self):
        self.tray = QSystemTrayIcon(self)
        menu = QMenu()
        act_show = QAction("Mostrar", self)
        act_show.triggered.connect(self.showNormal)
        menu.addAction(act_show)
        act_quit = QAction("Sair", self)
        act_quit.triggered.connect(QApplication.instance().quit)
        menu.addAction(act_quit)
        self.tray.setContextMenu(menu)
        self.tray.setToolTip("CS2 Booster")
        self.tray.show()

    def _wire_timers(self):
        self.hist = {
            "x": deque(maxlen=60), "cpu": deque(maxlen=60), "ram": deque(maxlen=60),
            "cs2cpu": deque(maxlen=60), "cs2ram": deque(maxlen=60),
        }
        self.t_sys = QTimer(self)
        self.t_sys.timeout.connect(self._poll_system)
        self.t_sys.start(1000)
        self._poll_system()

    def _poll_system(self):
        cpu = psutil.cpu_percent(interval=None)
        ram = psutil.virtual_memory().percent
        t = time.time() - self._t0

        self.card_cpu.set_value(f"{cpu:.0f}%", f"{psutil.cpu_count()} lógicas")
        vm = psutil.virtual_memory()
        self.card_ram.set_value(f"{ram:.0f}%", f"{vm.used // (1024**2)} / {vm.total // (1024**2)} MB")

        cs2cpu = cs2ram = 0.0
        cs2 = None
        for p in psutil.process_iter(["name", "pid", "cpu_percent", "memory_info"]):
            n = p.info["name"] or ""
            if "cs2" in n.lower():
                cs2 = p
                break
        if cs2 is not None:
            try:
                cs2cpu = cs2.info["cpu_percent"] or 0
                mi = cs2.info["memory_info"]
                cs2ram = mi.rss / (1024**2) if mi else 0
                self.card_cs2.set_value("ATIVO", f"PID {cs2.pid}")
                self.lbl_cs2.setText(f"CS2: ATIVO (PID {cs2.pid})")
                self.lbl_cs2.setStyleSheet(f"color: {GREEN}; font-weight: 700;")
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        else:
            self.card_cs2.set_value("OFF", "cs2.exe não detectado")
            self.lbl_cs2.setText("CS2: OFF")
            self.lbl_cs2.setStyleSheet(f"color: {FG_DIM}; font-weight: 700;")

        self.hist["x"].append(t); self.hist["cpu"].append(cpu); self.hist["ram"].append(ram)
        self.hist["cs2cpu"].append(cs2cpu); self.hist["cs2ram"].append(cs2ram)
        xs = list(self.hist["x"])
        self.plot_cpu.clear(); self.plot_cpu.plot(xs, list(self.hist["cpu"]), pen=pg.mkPen(ACCENT, width=2), fillLevel=0, brush=(88, 166, 255, 40))
        self.plot_ram.clear(); self.plot_ram.plot(xs, list(self.hist["ram"]), pen=pg.mkPen(GREEN, width=2))
        self.plot_cs2_cpu.clear(); self.plot_cs2_cpu.plot(xs, list(self.hist["cs2cpu"]), pen=pg.mkPen(YELLOW, width=2))
        self.plot_cs2_ram.clear(); self.plot_cs2_ram.plot(xs, list(self.hist["cs2ram"]), pen=pg.mkPen(RED, width=2))
        self._refresh_cs2_connections()

    def _poll_admin(self):
        is_admin = self._is_admin()
        self.lbl_admin.setText("Admin: SIM" if is_admin else "Admin: NÃO")
        self.lbl_admin.setStyleSheet(f"color: {GREEN if is_admin else YELLOW}; font-weight: 700;")

    @staticmethod
    def _is_admin():
        try:
            import ctypes
            return bool(ctypes.windll.shell32.IsUserAnAdmin())
        except Exception:
            return False

    def _engine_action(self, action, args):
        if self.engine_busy:
            QMessageBox.information(self, "Ocupado", "Uma operação do motor já está em andamento.")
            return
        if action in ("apply", "revert") and not self._is_admin():
            ok = QMessageBox.question(
                self, "Sem Admin",
                "Sem privilégios de Administrador o motor não consegue alterar registro/energia.\nExecutar mesmo assim?"
            )
            if ok != QMessageBox.Yes:
                return
        self.engine_busy = True
        self.progress.setRange(0, 0)
        self.status.showMessage(f"Executando: {action} ...")
        self.log(f">> {action} {' '.join(args)}")

        # Thread nemic com resultado auto-relacionável (sem QObject/QThread)
        self._worker = EngineWorker(action, args)
        thread = threading.Thread(target=self._worker.run, daemon=True)
        thread.start()
        # aguarda a conclusão, atualizando a UI no loop principal
        self._wait_thread = thread
        self._wait_timer = QTimer(self)
        self._wait_timer.timeout.connect(self._poll_worker)
        self._wait_timer.start(100)

    def _poll_worker(self):
        if self._wait_thread is None or self._wait_thread.is_alive():
            return
        self._wait_timer.stop()
        del self._wait_timer
        ok, out, action = self._worker.result.ok, self._worker.result.out, self._worker.result.action
        self._on_engine_done(ok, out, action)

    def _on_engine_done(self, ok, out, action):
        self.engine_busy = False
        self.progress.setRange(0, 1)
        self.progress.setValue(1 if ok else 0)
        self.engine_out.setPlainText(out or "(sem saída)")
        self.status.showMessage("Concluído" if ok else "Falhou", 5000)
        self.log(f"[{'OK' if ok else 'ERRO'}] {action}\n{out}")
        self.tray.showMessage(
            "CS2 Booster",
            f"{action}: {'aplicado com sucesso' if ok else 'falhou — veja a aba Otimização'}",
            QSystemTrayIcon.Information if ok else QSystemTrayIcon.Critical, 3000,
        )

    def _test_latency(self):
        self.net_out.setPlainText("Testando...\n")
        QApplication.processEvents()
        lines = []
        for host in ("1.1.1.1", "steamcommunity.com"):
            try:
                r = subprocess.run(["ping", "-n", "4", host], capture_output=True, text=True, timeout=20)
                lines.append(f"--- {host} ---\n{r.stdout.strip()}\n")
            except Exception as e:
                lines.append(f"{host}: erro {e}\n")
        self.net_out.setPlainText("\n".join(lines))

    def _refresh_cs2_connections(self):
        try:
            cs2 = None
            for p in psutil.process_iter(["name", "pid"]):
                n = p.info["name"] or ""
                if "cs2" in n.lower():
                    cs2 = p
                    break
            if cs2 is None:
                self.card_net.set_value("--", "CS2 offline")
                self.tbl_net.setRowCount(0)
                return
            conns = cs2.net_connections(kind="inet") if hasattr(cs2, "net_connections") else cs2.connections(kind="inet")
            self.tbl_net.setRowCount(0)
            shown = 0
            for c in conns:
                if c.status != psutil.CONN_ESTABLISHED:
                    continue
                raddr = f"{c.raddr.ip}:{c.raddr.port}" if c.raddr else "-"
                lport = str(c.laddr.port) if c.laddr else "-"
                row = self.tbl_net.rowCount()
                self.tbl_net.insertRow(row)
                for col, val in enumerate([lport, raddr, c.status]):
                    self.tbl_net.setItem(row, col, QTableWidgetItem(val))
                shown += 1
                if shown >= 12:
                    break
            self.card_net.set_value("ATIVO", f"{shown} conexões estabelecidas")
        except Exception:
            pass

    def _refresh_processes(self, *_):
        filt = self.proc_filter.currentText()
        rows = []
        for p in psutil.process_iter(["pid", "name", "cpu_percent", "memory_info", "nice"]):
            try:
                info = p.info
                name = (info["name"] or "").lower()
                if filt == "cs2" and "cs2" not in name:
                    continue
                if filt == "steam" and "steam" not in name:
                    continue
                if filt.startswith("jogos") and (info["cpu_percent"] or 0) < 5:
                    continue
                mem = info["memory_info"].rss / (1024**2) if info["memory_info"] else 0
                rows.append((info["cpu_percent"] or 0, info["pid"], info["name"], mem, info["nice"]))
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        rows.sort(reverse=True)
        self.tbl_proc.setRowCount(0)
        for cpu, pid, name, mem, nice in rows[:50]:
            row = self.tbl_proc.rowCount()
            self.tbl_proc.insertRow(row)
            nice_name = {24: "Idle", 13: "Below Normal", 10: "Normal", 8: "Above Normal", 6: "High", 4: "Realtime"}.get(nice, str(nice))
            for col, val in enumerate([str(pid), name or "?", f"{cpu:.1f}", f"{mem:.0f}", nice_name]):
                self.tbl_proc.setItem(row, col, QTableWidgetItem(str(val)))

    def log(self, text):
        stamp = time.strftime("%H:%M:%S")
        self.txt_log.append(f"[{stamp}] {text}")


def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    app.setStyleSheet(STYLESHEET)
    win = MainWindow()
    win.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
