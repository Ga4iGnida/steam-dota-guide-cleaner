// ==UserScript==
// @name         Steam Dota 2 Guide Cleaner
// @namespace    https://github.com/Ga4iGnida/steam-dota-guide-cleaner
// @version      1.0.1
// @description  Safely unsubscribe from all subscribed Dota 2 Steam Workshop guides
// @author       Ga4iGnida
// @license      MIT
// @homepageURL  https://github.com/Ga4iGnida/steam-dota-guide-cleaner
// @supportURL   https://github.com/Ga4iGnida/steam-dota-guide-cleaner/issues
// @updateURL    https://raw.githubusercontent.com/Ga4iGnida/steam-dota-guide-cleaner/main/steam-dota-guide-cleaner.user.js
// @downloadURL  https://raw.githubusercontent.com/Ga4iGnida/steam-dota-guide-cleaner/main/steam-dota-guide-cleaner.user.js
// @match        https://steamcommunity.com/id/*/myworkshopfiles/*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(async function () {
    'use strict';

    const p = new URLSearchParams(location.search);
    if (p.get('section') !== 'guides' || p.get('appid') !== '570' || p.get('browsefilter') !== 'mysubscriptions') return;

    const K = { auth:'sdgc_auth', check:'sdgc_check', total:'sdgc_total', concurrency:'sdgc_concurrency', delay:'sdgc_delay' };
    const clamp = (n,a,b) => Math.min(b, Math.max(a,n));
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    let authorized = sessionStorage.getItem(K.auth) === '1';
    let checking = sessionStorage.getItem(K.check) === '1';
    let running = false;
    let total = Number(localStorage.getItem(K.total) || 0);
    let concurrency = clamp(Number(localStorage.getItem(K.concurrency) || 5), 1, 10);
    let delay = clamp(Number(localStorage.getItem(K.delay) ?? 50), 0, 2000);

    const panel = document.createElement('div');
    panel.id = 'sdgc';
    panel.innerHTML = `
      <div class="head"><div><b>🧹 Steam Guide Cleaner</b><small>v1.0.1</small></div><button id="mini">−</button></div>
      <div id="body">
        <div id="status" class="status">${authorized ? '⏳ Продолжаю очистку...' : '🔒 Ожидание запуска'}</div>
        <div class="row"><span>На странице</span><b id="page">—</b></div>
        <div class="row"><span>Отписано</span><b id="total">${total}</b></div>
        <div class="bar"><i id="fill"></i></div><div id="progress" class="progress">Готов к запуску</div>
        <section><b>⚙️ Скорость</b>
          <label>Параллельные запросы <strong id="cv">${concurrency}</strong></label>
          <input id="ci" type="range" min="1" max="10" value="${concurrency}">
          <label>Задержка <strong id="dv">${delay} мс</strong></label>
          <input id="di" type="range" min="0" max="2000" step="10" value="${delay}">
        </section>
        <button id="start" class="start">▶ НАЧАТЬ ОЧИСТКУ</button>
        <button id="stop" class="stop">■ ОСТАНОВИТЬ</button>
        <div class="warn">⚠️ Скрипт отменяет подписку на найденные руководства. Запуск требует явного подтверждения.</div>
      </div>`;
    document.body.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
      #sdgc{position:fixed;top:20px;right:20px;width:320px;z-index:2147483647;color:#e5e7eb;background:linear-gradient(145deg,rgba(30,34,40,.98),rgba(17,19,23,.98));border:1px solid rgba(255,255,255,.12);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.55);font:13px Arial,sans-serif;overflow:hidden}#sdgc *{box-sizing:border-box}.head{display:flex;justify-content:space-between;align-items:center;padding:14px 15px;border-bottom:1px solid rgba(255,255,255,.08)}.head b{font-size:16px}.head small{display:block;color:#7f8792;font-size:10px;margin-top:3px}.head button{width:28px;height:28px;border:0;border-radius:6px;background:rgba(255,255,255,.08);color:#aaa;cursor:pointer;font-size:18px}#body{padding:14px}.status{padding:9px 10px;margin-bottom:12px;border-radius:6px;background:rgba(255,255,255,.05);color:#aeb6c2}.row{display:flex;justify-content:space-between;margin-bottom:6px;color:#9ca3af}.row b{color:#fff}.bar{height:8px;margin-top:12px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden}.bar i{display:block;width:0;height:100%;background:linear-gradient(90deg,#66c0f4,#5c7e10);transition:width .15s}.progress{text-align:center;margin:6px 0;color:#8b949e;font-size:11px}section{margin-top:15px;padding:11px;background:rgba(255,255,255,.035);border-radius:7px}section>b{display:block;margin-bottom:9px}label{display:flex;justify-content:space-between;margin:8px 0 4px;color:#9ca3af}label strong{color:#fff}input[type=range]{width:100%}.start,.stop{width:100%;padding:11px;margin-top:10px;border:0;border-radius:6px;color:white;font-weight:700;cursor:pointer}.start{background:#5c7e10}.stop{background:#8b2d2d}.start:disabled{opacity:.45}.warn{margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.07);color:#8b949e;font-size:10px;line-height:1.45}.collapsed{width:auto!important}.collapsed #body{display:none}`;
    document.head.appendChild(style);

    const $ = id => panel.querySelector('#' + id);
    const status=$('status'), page=$('page'), totalEl=$('total'), fill=$('fill'), progress=$('progress');
    const start=$('start'), stop=$('stop'), ci=$('ci'), di=$('di'), cv=$('cv'), dv=$('dv');

    const setStatus = (t,c='#aeb6c2') => { status.textContent=t; status.style.color=c; };
    const getSubs = () => [...document.querySelectorAll('span[id^="subscribed_"]')].filter(e => e.querySelector('.subscribeOptionUnsubscribe'));
    const getId = e => (e.id.match(/^subscribed_(\d+)$/) || [])[1] || null;
    const updatePage = () => page.textContent = getSubs().length;
    const updateTotal = () => totalEl.textContent = total;
    const saveSettings = () => { localStorage.setItem(K.concurrency,concurrency); localStorage.setItem(K.delay,delay); };
    const setRunning = v => { start.disabled=v; ci.disabled=v; di.disabled=v; };

    async function unsubscribe(id) {
        const body = new URLSearchParams({id, appid:'570', sessionid:window.g_sessionID});
        const r = await fetch('/sharedfiles/unsubscribe',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},body:body.toString()});
        if (r.status===429) throw Error('RATE_LIMIT');
        if (!r.ok) throw Error(`HTTP ${r.status}`);
        return true;
    }

    async function request(id) {
        for(let a=0;a<4;a++) {
            try { return await unsubscribe(id); }
            catch(e) {
                if(!authorized) throw e;
                const wait=e.message==='RATE_LIMIT' ? 1000*Math.pow(2,a) : 250*(a+1);
                if(e.message==='RATE_LIMIT') setStatus(`⏱️ Steam ограничил частоту. Жду ${wait} мс...`,'#ffb74d');
                await sleep(wait);
            }
        }
        throw Error('REQUEST_FAILED');
    }

    function stopAll(msg='⏹ Остановлено. Новые запросы не отправляются.', color='#ff7777') {
        authorized=false; running=false; checking=false;
        sessionStorage.removeItem(K.auth); sessionStorage.removeItem(K.check);
        setRunning(false); setStatus(msg,color); updatePage();
    }

    async function reloadForCheck() {
        sessionStorage.setItem(K.auth,'1');
        sessionStorage.setItem(K.check,'1');
        setStatus('🔄 Страница очищена. Проверяю ещё раз...','#ffc107');
        await sleep(500);
        location.reload();
    }

    async function cleaner() {
        if(running || !authorized) return;
        running=true; setRunning(true);
        if((new URLSearchParams(location.search)).get('p')) {
            const u=new URL(location.href); u.searchParams.delete('p'); location.href=u.href; return;
        }
        await sleep(700);
        if(!authorized) return;

        let elements=getSubs();
        if(checking) {
            checking=false; sessionStorage.removeItem(K.check);
            if(elements.length===0) { stopAll(`🏁 Готово! Всего отписано: ${total}`,'#66ff66'); return; }
        }
        if(elements.length===0) { stopAll('💤 Подписок нет. Готов к запуску.','#aaa'); return; }

        const initial=elements.length;
        while(running && authorized) {
            elements=getSubs();
            if(elements.length===0) { await reloadForCheck(); return; }
            const remaining=elements.length;
            page.textContent=remaining;
            const done=Math.max(0,initial-remaining), pct=Math.min(100,Math.round(done/initial*100));
            fill.style.width=pct+'%'; progress.textContent=`${done} / ${initial} • ${pct}%`;
            setStatus(`🔥 Очищаю... осталось ${remaining}`,'#66ff66');

            const batch=elements.slice(0,concurrency).map(element=>({element,id:getId(element)})).filter(x=>x.id);
            const results=await Promise.allSettled(batch.map(async x=>{await request(x.id);return x;}));
            let ok=0;
            for(const r of results) {
                if(!authorized) return;
                if(r.status==='fulfilled') { r.value.element.remove(); total++; ok++; localStorage.setItem(K.total,String(total)); updateTotal(); }
                else console.error('[Steam Guide Cleaner]',r.reason);
            }
            if(ok===0) { stopAll('⚠️ Не удалось выполнить запросы. Проверь Console.','#ff7777'); return; }
            if(delay) await sleep(delay);
        }
    }

    ci.oninput=()=>{ concurrency=Number(ci.value); cv.textContent=concurrency; saveSettings(); };
    di.oninput=()=>{ delay=Number(di.value); dv.textContent=delay+' мс'; saveSettings(); };
    $('mini').onclick=()=>panel.classList.toggle('collapsed');

    start.onclick=()=>{
        if(running) return;
        if(!confirm('ВНИМАНИЕ!\n\nСкрипт отменит подписку на ВСЕ найденные руководства Dota 2.\n\nЭто действие нельзя автоматически отменить.\n\nПродолжить?')) return;
        authorized=true; checking=false;
        sessionStorage.setItem(K.auth,'1'); sessionStorage.removeItem(K.check);
        setStatus('🚀 Очистка разрешена.','#66ff66'); cleaner();
    };
    stop.onclick=()=>stopAll();

    updateTotal(); updatePage();
    if(authorized) { await sleep(1000); if(authorized) cleaner(); }
})();
