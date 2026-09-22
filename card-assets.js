// Product artwork is independent from character imagery and wardrobe layers.
const productPath = id => `assets/cards/${String(id).padStart(3,'0')}.webp`;
cardHTML = function(c) {
  const unlocked = own().has(c.id);
  const artwork = c.id <= 18
    ? `<img src="${productPath(c.id)}" alt="${c.name}商品圖" loading="lazy" onerror="this.hidden=true;this.parentElement.querySelector('.art-fallback').hidden=false"><span class="art-fallback" hidden>圖片載入失敗</span>`
    : '<span class="art-fallback">圖片製作中</span>';
  return `<article class="card ${cls(c.rarity)} ${unlocked?'':'locked'}"><div class="art">${artwork}</div><div class="rarity">${unlocked?c.rarity:'🔒'}</div><div class="meta"><div class="code">#${String(c.id).padStart(3,'0')} · ${c.rarity}</div><div class="name">${c.name}</div><small>${unlocked?'已收藏 · 點擊選擇':'未收藏 · 道具預覽'}</small></div></article>`;
};
const originalRender = render;
render = function() {
  originalRender();
  const slotNames=['頭部','頸部','胸部','手部','身體','下身','腿部','腳部','配件','場景'];
  document.querySelector('#slots').innerHTML=slotNames.map(s=>{
    const c=cards.find(x=>x.id===state.equipped[s]);
    return `<div class="slot"><span>${s}</span>${c&&c.id<=18?`<img class="slot-product" src="${productPath(c.id)}" alt="${c.name}" loading="lazy">`:''}<b>${c?c.name:'尚未選擇'}</b>${c?`<button class="secondary" onclick="clearSlot('${s}')">卸下</button>`:''}</div>`;
  }).join('');
};
function clearSlot(slot){delete state.equipped[slot];save();render();toast('已卸下選擇');}
equip=function(id){
  if(!own().has(id)){toast('尚未取得這張卡片');return;}
  const c=cards.find(x=>x.id===id);
  state.equipped[c.slot]=id;save();render();
  toast(`已選擇：${c.name}（目前僅道具展示，未套用人物）`);
};
const style=document.createElement('style');
style.textContent=`.card .art{display:grid;place-items:center;background:#151519}.card .art img{object-fit:contain;object-position:center;filter:none}.card{height:290px}.inventory .card{height:258px}.card .meta small{font-size:10px;color:var(--muted)}.art-fallback{color:#b7afbd;font-size:13px}.art-fallback[hidden]{display:none}.slot-product{display:block;width:100%;height:105px;object-fit:contain;margin:8px 0}.slot .secondary{display:block;margin-top:8px;padding:6px 10px}.inventory>div{cursor:pointer}.locked{filter:grayscale(1);opacity:.65}`;
document.head.appendChild(style);
document.querySelector('#avatar .section-title .muted').textContent='道具展示與選擇／卸下；尚未提供人物視覺換裝';
const progressNote=document.createElement('p');
progressNote.className='notice';progressNote.textContent='道具卡圖：18 / 154 已完成。其餘卡片圖片製作中。圖片不是人物穿戴圖層。';
document.querySelector('#collection').insertBefore(progressNote,document.querySelector('#rarityStats'));
render();