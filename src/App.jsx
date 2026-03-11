import { useState, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn     { 0%{opacity:0;transform:scale(0.85)} 70%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
  @keyframes checkPop  { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 100%{transform:scale(1)} }
  @keyframes slideOut  { to{opacity:0;transform:translateX(48px) scale(0.95)} }
  @keyframes leafFall  { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(60px) rotate(180deg);opacity:0} }
  @keyframes shimmer   { from{background-position:200% center} to{background-position:-200% center} }
  @keyframes wiggle    { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-10deg)} 70%{transform:rotate(10deg)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .fade-up   { animation: fadeUp  0.35s cubic-bezier(0.22,1,0.36,1) both; }
  .pop-in    { animation: popIn   0.3s  cubic-bezier(0.34,1.56,0.64,1) both; }
  .check-pop { animation: checkPop 0.3s ease; }
  .slide-out { animation: slideOut 0.25s ease forwards; }

  body {
    font-family: 'Noto Sans JP', sans-serif;
    background: #F7F3EE;
    min-height: 100vh;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: #F7F3EE;
    position: relative;
    padding-bottom: 110px;
  }

  /* ══ ヘッダー ══ */
  .header {
    background: linear-gradient(160deg, #4A7C59 0%, #5E9470 50%, #3D6B4A 100%);
    padding: 64px 28px 36px;
    position: relative;
    overflow: hidden;
    border-radius: 0 0 36px 36px;
  }
  .header-deco1 {
    position:absolute; top:-30px; right:-30px;
    width:180px; height:180px; border-radius:50%;
    background:rgba(255,255,255,0.07); pointer-events:none;
  }
  .header-deco2 {
    position:absolute; bottom:-50px; left:-20px;
    width:140px; height:140px; border-radius:50%;
    background:rgba(255,255,255,0.05); pointer-events:none;
  }
  .header-deco3 {
    position:absolute; top:20px; left:50%;
    width:80px; height:80px; border-radius:50%;
    background:rgba(255,255,255,0.04); pointer-events:none;
  }

  .header-top {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:24px; position:relative; z-index:1;
  }
  .logo-wrap { display:flex; align-items:center; gap:10px; }
  .logo-icon {
    width:42px; height:42px; border-radius:14px;
    background:rgba(255,255,255,0.18);
    display:flex; align-items:center; justify-content:center;
    font-size:20px; border:1.5px solid rgba(255,255,255,0.25);
  }
  .logo-text {
    font-family:'Playfair Display', serif;
    font-size:20px; font-weight:700; color:#fff;
    letter-spacing:0.02em;
  }
  .logo-sub { font-size:9px; color:rgba(255,255,255,0.6); letter-spacing:0.15em; text-transform:uppercase; margin-top:1px; }

  .badge-wrap { position:relative; }
  .basket-btn {
    width:46px; height:46px; border-radius:16px;
    background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.25);
    display:flex; align-items:center; justify-content:center;
    font-size:20px; cursor:pointer; transition:transform 0.2s;
  }
  .basket-btn:hover { transform:scale(1.08); }
  .badge {
    position:absolute; top:-5px; right:-5px;
    min-width:19px; height:19px; border-radius:99px;
    background:#E8C547; color:#2a2a2a;
    font-size:10px; font-weight:900; font-family:'DM Sans',sans-serif;
    display:flex; align-items:center; justify-content:center;
    padding:0 4px;
  }

  .header-main { position:relative; z-index:1; }
  .header-greeting { font-size:12px; color:rgba(255,255,255,0.6); margin-bottom:5px; letter-spacing:0.06em; }
  .header-title {
    font-family:'Playfair Display',serif;
    font-size:26px; font-weight:900; color:#fff; line-height:1.25;
    margin-bottom:6px;
  }
  .header-progress {
    display:flex; align-items:center; gap:10px; margin-top:14px;
  }
  .progress-bar-bg {
    flex:1; height:5px; background:rgba(255,255,255,0.2); border-radius:99px; overflow:hidden;
  }
  .progress-bar-fill {
    height:100%; background:linear-gradient(90deg,#E8C547,#F0D878);
    border-radius:99px; transition:width 0.5s cubic-bezier(0.4,0,0.2,1);
  }
  .progress-text { font-size:12px; color:rgba(255,255,255,0.7); white-space:nowrap; font-weight:600; }

  /* ══ タブ ══ */
  .tab-bar {
    display:flex; gap:6px; padding:20px 20px 0;
  }
  .tab-btn {
    flex:1; padding:11px 6px; border-radius:14px; border:none; cursor:pointer;
    font-family:'Noto Sans JP',sans-serif; font-size:12px; font-weight:700;
    transition:all 0.2s; letter-spacing:0.02em;
  }
  .tab-btn.on  { background:#4A7C59; color:#fff; box-shadow:0 4px 16px rgba(74,124,89,0.3); }
  .tab-btn.off { background:#fff; color:#9A9A9A; }
  .tab-btn.off:hover { background:#EDF4F0; color:#4A7C59; }

  /* ══ 追加フォーム ══ */
  .add-area { padding:16px 20px 0; }
  .add-row { display:flex; gap:10px; }
  .add-input {
    flex:1; padding:15px 18px; border-radius:16px;
    border:2px solid #E8E0D8; background:#fff;
    font-family:'Noto Sans JP',sans-serif; font-size:14px; font-weight:500; color:#2a2a2a;
    outline:none; transition:all 0.2s;
    box-shadow:0 2px 8px rgba(0,0,0,0.04);
  }
  .add-input:focus { border-color:#4A7C59; box-shadow:0 0 0 4px rgba(74,124,89,0.1); }
  .add-input::placeholder { color:#C8C0B8; }
  .add-btn {
    width:64px; height:64px; border-radius:16px; flex-shrink:0;
    background:#4A7C59; border:none; cursor:pointer;
    font-size:26px; color:#fff; font-weight:900;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 16px rgba(74,124,89,0.4); transition:all 0.2s;
  }
  .add-btn:hover { transform:scale(1.06); box-shadow:0 6px 22px rgba(74,124,89,0.45); }
  .add-btn:active { transform:scale(0.95); }

  /* クイックタグ */
  .quick-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
  .qtag {
    padding:7px 15px; border-radius:99px;
    background:#fff; border:1.5px solid #E8E0D8;
    font-family:'Noto Sans JP',sans-serif; font-size:12px; font-weight:700;
    color:#5E9470; cursor:pointer; transition:all 0.15s;
    box-shadow:0 1px 4px rgba(0,0,0,0.04);
  }
  .qtag:hover { background:#4A7C59; color:#fff; border-color:#4A7C59; transform:translateY(-1px); box-shadow:0 4px 12px rgba(74,124,89,0.25); }

  /* ══ リスト ══ */
  .list-area { padding:20px 20px 0; }
  .sec-label {
    font-size:11px; font-weight:700; color:#B0A898;
    letter-spacing:0.1em; text-transform:uppercase;
    margin-bottom:10px; display:flex; align-items:center; gap:8px;
  }
  .sec-label::after { content:''; flex:1; height:1px; background:#EDE8E2; }

  /* アイテムカード */
  .icard {
    background:#fff; border-radius:18px; margin-bottom:9px;
    box-shadow:0 2px 10px rgba(0,0,0,0.05);
    border:1.5px solid transparent; transition:all 0.2s;
    overflow:hidden;
  }
  .icard:hover { border-color:#D8EDE0; box-shadow:0 4px 18px rgba(0,0,0,0.08); }
  .icard.done-card { background:#FAFAF8; }

  .icard-inner { display:flex; align-items:center; gap:13px; padding:15px 16px; }

  .chk {
    width:30px; height:30px; border-radius:50%; flex-shrink:0;
    border:2px solid #C8E0CE; background:#fff; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.2s; font-size:14px;
  }
  .chk.chk-done { background:#4A7C59; border-color:#4A7C59; }
  .chk:hover:not(.chk-done) { border-color:#4A7C59; background:#EDF4F0; }

  .iname {
    flex:1; font-size:15px; font-weight:700; color:#2a2a2a; transition:all 0.2s;
  }
  .iname.crossed { text-decoration:line-through; color:#C8C0B8; font-weight:500; }

  .qty-ctrl { display:flex; align-items:center; gap:7px; }
  .qbtn {
    width:26px; height:26px; border-radius:8px;
    background:#EDF4F0; border:none; cursor:pointer;
    font-size:14px; font-weight:800; color:#4A7C59;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.15s;
  }
  .qbtn:hover { background:#4A7C59; color:#fff; transform:scale(1.1); }
  .qnum { font-size:14px; font-weight:800; color:#2a2a2a; min-width:18px; text-align:center; font-family:'DM Sans',sans-serif; }

  .del-btn {
    width:28px; height:28px; border-radius:8px;
    background:transparent; border:none; cursor:pointer;
    font-size:13px; color:#D0C8C0;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.15s; opacity:0;
  }
  .icard:hover .del-btn { opacity:1; }
  .del-btn:hover { background:#FDECEA; color:#E07070; transform:scale(1.1); }

  /* 完了バナー */
  .done-banner {
    margin:0 0 20px;
    background:linear-gradient(135deg,#4A7C59,#6BAE80);
    border-radius:22px; padding:28px 24px; text-align:center;
    box-shadow:0 8px 30px rgba(74,124,89,0.28);
    position:relative; overflow:hidden;
  }
  .done-banner::before {
    content:'🌿'; position:absolute; font-size:80px; opacity:0.08;
    top:-10px; right:-10px;
  }
  .done-emo { font-size:44px; margin-bottom:10px; display:block; animation:wiggle 1.5s ease infinite; }
  .done-title { font-family:'Playfair Display',serif; font-size:20px; color:#fff; margin-bottom:5px; }
  .done-sub { font-size:12px; color:rgba(255,255,255,0.75); }

  /* 空状態 */
  .empty {
    text-align:center; padding:64px 24px;
  }
  .empty-emo { font-size:64px; margin-bottom:18px; display:block; animation:wiggle 2.5s ease infinite; }
  .empty-title { font-family:'Playfair Display',serif; font-size:18px; color:#2a2a2a; margin-bottom:8px; }
  .empty-sub { font-size:13px; color:#B0A898; line-height:1.7; }

  /* ══ 履歴タブ ══ */
  .hist-item {
    background:#fff; border-radius:14px; padding:14px 18px;
    margin-bottom:8px; display:flex; align-items:center; gap:12px;
    box-shadow:0 2px 8px rgba(0,0,0,0.04); cursor:pointer;
    transition:all 0.15s; border:1.5px solid transparent;
  }
  .hist-item:hover { border-color:#D8EDE0; transform:translateX(4px); box-shadow:0 4px 14px rgba(0,0,0,0.08); }
  .hist-dot { width:8px; height:8px; border-radius:50%; background:#C8E0CE; flex-shrink:0; }
  .hist-name { flex:1; font-size:14px; font-weight:600; color:#2a2a2a; }
  .hist-add { font-size:12px; color:#4A7C59; font-weight:700; }

  /* ══ よく買うタブ ══ */
  .fav-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .fav-card {
    background:#fff; border-radius:20px; padding:20px 16px;
    text-align:center; cursor:pointer; transition:all 0.2s;
    box-shadow:0 2px 10px rgba(0,0,0,0.05); border:1.5px solid transparent;
  }
  .fav-card:hover { border-color:#D8EDE0; transform:translateY(-3px); box-shadow:0 8px 24px rgba(74,124,89,0.14); }
  .fav-emo { font-size:34px; margin-bottom:9px; display:block; }
  .fav-name { font-size:13px; font-weight:700; color:#2a2a2a; margin-bottom:10px; }
  .fav-add {
    padding:7px 14px; border-radius:99px;
    background:#EDF4F0; border:none; cursor:pointer;
    font-family:'Noto Sans JP',sans-serif; font-size:11px; font-weight:700;
    color:#4A7C59; transition:all 0.15s;
  }
  .fav-card:hover .fav-add { background:#4A7C59; color:#fff; }

  /* ══ ボトムバー ══ */
  .btm-bar {
    position:fixed; bottom:0; left:50%; transform:translateX(-50%);
    width:100%; max-width:430px;
    background:rgba(247,243,238,0.95); backdrop-filter:blur(20px);
    border-top:1px solid rgba(0,0,0,0.06); padding:12px 20px 28px;
    display:flex; gap:10px;
  }
  .clear-btn {
    flex:1; padding:14px; border-radius:14px; border:none; cursor:pointer;
    background:#EDF4F0; font-family:'Noto Sans JP',sans-serif;
    font-size:13px; font-weight:700; color:#4A7C59; transition:all 0.2s;
  }
  .clear-btn:hover { background:#D8EDE0; }
  .stat-chip {
    background:#fff; border:1.5px solid #E8E0D8; border-radius:14px;
    padding:14px 16px; font-size:12px; font-weight:700; color:#B0A898;
    white-space:nowrap; font-family:'DM Sans',sans-serif;
  }
  .stat-chip b { color:#4A7C59; }

  /* 葉っぱアニメ */
  .leaf-wrap { position:fixed; inset:0; pointer-events:none; z-index:999; overflow:hidden; }
  .leaf {
    position:absolute; font-size:16px;
    animation:leafFall 0.9s ease forwards;
  }
`;

const FAVS = [
  {e:"🥛",n:"牛乳"},{e:"🥚",n:"卵"},{e:"🍞",n:"食パン"},{e:"🧻",n:"トイレットペーパー"},
  {e:"🍚",n:"お米"},{e:"🧴",n:"シャンプー"},{e:"🥩",n:"お肉"},{e:"🫧",n:"洗剤"},
  {e:"🥦",n:"野菜"},{e:"🍎",n:"果物"},{e:"🧈",n:"バター"},{e:"☕",n:"コーヒー"},
];
const QUICK = ["野菜","果物","お肉","魚","牛乳","卵","パン","調味料"];
const LEAVES = ["🌿","🍃","🌱","🍀"];
let nid = 1;

export default function App() {
  const [tab, setTab]     = useState("list");
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [hist, setHist]   = useState(["牛乳","卵","食パン","お米","トイレットペーパー","野菜"]);
  const [leaves, setLeaves] = useState([]);
  const inputRef = useRef(null);

  const remaining   = items.filter(i => !i.checked).length;
  const checkedCnt  = items.filter(i =>  i.checked).length;
  const allDone     = items.length > 0 && remaining === 0;
  const pct         = items.length ? Math.round((checkedCnt / items.length) * 100) : 0;

  function addItem(name) {
    const v = (name || input).trim();
    if (!v) return;
    setItems(p => [{ id: nid++, name: v, qty: 1, checked: false }, ...p]);
    if (!hist.includes(v)) setHist(h => [v, ...h.slice(0,19)]);
    setInput("");
    inputRef.current?.focus();
  }

  function toggle(id) {
    setItems(p => p.map(i => {
      if (i.id !== id) return i;
      if (!i.checked) shootLeaves();
      return { ...i, checked: !i.checked };
    }));
  }

  function changeQty(id, d) {
    setItems(p => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  }

  function del(id) { setItems(p => p.filter(i => i.id !== id)); }
  function clearChecked() { setItems(p => p.filter(i => !i.checked)); }

  function shootLeaves() {
    const ls = Array.from({length:6}).map((_,i) => ({
      id: Date.now()+i,
      left: 20 + Math.random()*60,
      top:  20 + Math.random()*40,
      leaf: LEAVES[Math.floor(Math.random()*LEAVES.length)],
      delay: Math.random()*0.2,
    }));
    setLeaves(ls);
    setTimeout(() => setLeaves([]), 1000);
  }

  const unchecked = items.filter(i => !i.checked);
  const checked   = items.filter(i =>  i.checked);

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* 葉っぱ */}
      {leaves.length > 0 && (
        <div className="leaf-wrap">
          {leaves.map(l => (
            <div key={l.id} className="leaf" style={{ left:`${l.left}%`, top:`${l.top}%`, animationDelay:`${l.delay}s` }}>
              {l.leaf}
            </div>
          ))}
        </div>
      )}

      {/* ヘッダー */}
      <div className="header">
        <div className="header-deco1"/><div className="header-deco2"/><div className="header-deco3"/>
        <div className="header-top">
          <div className="logo-wrap">
            <div className="logo-icon">🧺</div>
            <div>
              <div className="logo-text">Okaimono</div>
              <div className="logo-sub">お買い物リスト</div>
            </div>
          </div>
          <div className="badge-wrap">
            <div className="basket-btn">🛒</div>
            {remaining > 0 && <div className="badge">{remaining}</div>}
          </div>
        </div>
        <div className="header-main">
          <div className="header-greeting">今日のお買い物</div>
          <div className="header-title">
            {allDone ? "完了です！お疲れさま🌿" : items.length === 0 ? "何を買いますか？" : `残り ${remaining} 品`}
          </div>
          {items.length > 0 && (
            <div className="header-progress">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width:`${pct}%` }} />
              </div>
              <div className="progress-text">{pct}%</div>
            </div>
          )}
        </div>
      </div>

      {/* タブ */}
      <div className="tab-bar">
        {[["list","🧺 リスト"],["hist","🕐 履歴"],["fav","🌿 よく買う"]].map(([id,label]) => (
          <button key={id} className={`tab-btn ${tab===id?"on":"off"}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* リストタブ */}
      {tab === "list" && (
        <>
          <div className="add-area">
            <div className="add-row">
              <input ref={inputRef} className="add-input" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && addItem()}
                placeholder="商品名を入力…" />
              <button className="add-btn" onClick={() => addItem()}>＋</button>
            </div>
            <div className="quick-row">
              {QUICK.map(q => <button key={q} className="qtag" onClick={() => addItem(q)}>＋ {q}</button>)}
            </div>
          </div>

          <div className="list-area">
            {allDone && (
              <div className="done-banner pop-in">
                <span className="done-emo">🎉</span>
                <div className="done-title">お買い物完了！</div>
                <div className="done-sub">全部チェックできました。お疲れさまです🌿</div>
              </div>
            )}
            {items.length === 0 && (
              <div className="empty fade-up">
                <span className="empty-emo">🧺</span>
                <div className="empty-title">リストは空です</div>
                <div className="empty-sub">上から商品を追加するか<br />「よく買う」からワンタップで追加できます</div>
              </div>
            )}
            {unchecked.length > 0 && (
              <>
                {checkedCnt > 0 && <div className="sec-label">残り {unchecked.length} 品</div>}
                {unchecked.map((item,i) => (
                  <div key={item.id} className="fade-up" style={{animationDelay:`${i*0.04}s`}}>
                    <ItemCard item={item} onToggle={toggle} onQty={changeQty} onDel={del} />
                  </div>
                ))}
              </>
            )}
            {checked.length > 0 && (
              <>
                <div className="sec-label" style={{marginTop:20}}>チェック済み {checked.length} 品</div>
                {checked.map(item => <ItemCard key={item.id} item={item} onToggle={toggle} onQty={changeQty} onDel={del} />)}
              </>
            )}
          </div>
        </>
      )}

      {/* 履歴タブ */}
      {tab === "hist" && (
        <div className="list-area">
          <div className="sec-label">最近追加したもの</div>
          {hist.length === 0
            ? <div className="empty"><span className="empty-emo">📋</span><div className="empty-title">履歴はありません</div></div>
            : hist.map((h,i) => (
              <div key={i} className="hist-item fade-up" style={{animationDelay:`${i*0.03}s`}}
                onClick={() => { addItem(h); setTab("list"); }}>
                <div className="hist-dot"/>
                <span className="hist-name">{h}</span>
                <span className="hist-add">＋ 追加</span>
              </div>
            ))
          }
        </div>
      )}

      {/* よく買うタブ */}
      {tab === "fav" && (
        <div className="list-area">
          <div className="sec-label">ワンタップで追加</div>
          <div className="fav-grid">
            {FAVS.map((f,i) => (
              <div key={i} className="fav-card fade-up" style={{animationDelay:`${i*0.04}s`}}
                onClick={() => { addItem(f.n); setTab("list"); }}>
                <span className="fav-emo">{f.e}</span>
                <div className="fav-name">{f.n}</div>
                <button className="fav-add">＋ リストに追加</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ボトムバー */}
      {items.length > 0 && (
        <div className="btm-bar">
          <button className="clear-btn" onClick={clearChecked}>
            {checkedCnt > 0 ? `チェック済み ${checkedCnt} 品を削除` : "全て削除"}
          </button>
          <div className="stat-chip"><b>{checkedCnt}</b> / {items.length} 品</div>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, onToggle, onQty, onDel }) {
  const [anim, setAnim] = useState(false);
  function handleCheck() {
    setAnim(true);
    setTimeout(() => setAnim(false), 300);
    onToggle(item.id);
  }
  return (
    <div className={`icard ${item.checked ? "done-card" : ""}`}>
      <div className="icard-inner">
        <button className={`chk ${item.checked?"chk-done":""} ${anim?"check-pop":""}`} onClick={handleCheck}>
          {item.checked ? "✓" : ""}
        </button>
        <span className={`iname ${item.checked?"crossed":""}`}>{item.name}</span>
        {!item.checked && (
          <div className="qty-ctrl">
            <button className="qbtn" onClick={() => onQty(item.id,-1)}>−</button>
            <span className="qnum">{item.qty}</span>
            <button className="qbtn" onClick={() => onQty(item.id,+1)}>＋</button>
          </div>
        )}
        <button className="del-btn" onClick={() => onDel(item.id)}>✕</button>
      </div>
    </div>
  );
}
