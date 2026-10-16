#!/usr/bin/env python3
"""Local-only server. No uploads leave this computer. Requires Node, Chromium, ffmpeg, playwright-core."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json, subprocess, threading, os
ROOT=Path(__file__).resolve().parent
os.chdir(ROOT)
job={'state':'idle','message':'Готово'}
lock=threading.Lock()
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path=='/api/has-source':return self.respond({'exists':(ROOT/'source-image').exists()})
        if self.path=='/api/status':return self.respond(job)
        return super().do_GET()
    def respond(self,value):
        data=json.dumps(value,ensure_ascii=False).encode();self.send_response(200);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
    def do_POST(self):
        if self.headers.get('Origin') not in (None,'http://localhost:8765','http://127.0.0.1:8765'):
            return self.send_error(403)
        if self.path=='/api/source':
            with lock:
                if job['state']=='running':return self.send_error(409,'Export running')
                size=int(self.headers.get('Content-Length',0))
                if not 0<size<32*1024*1024:return self.send_error(413)
                (ROOT/'source-image').write_bytes(self.rfile.read(size))
            return self.respond({'ok':True})
        if self.path=='/api/export':
            with lock:
                if job['state']=='running':return self.send_error(409)
                if not (ROOT/'source-image').exists():return self.send_error(400,'Source image required')
                job.update(state='running',message='Рендеринг 150 кадров…')
            def work():
                try:
                    result=subprocess.run(['node','export.cjs'],cwd=ROOT,capture_output=True,text=True)
                    if result.returncode:raise RuntimeError(result.stderr[-600:])
                    job.update(state='done',message='MP4 готов · 1920×1080 · 5 с · 30 FPS')
                except Exception as e:job.update(state='error',message=str(e))
            threading.Thread(target=work,daemon=True).start()
            return self.respond({'ok':True})
        self.send_error(404)
if __name__=='__main__':
    print('Open http://localhost:8765',flush=True)
    ThreadingHTTPServer(('127.0.0.1',8765),Handler).serve_forever()
