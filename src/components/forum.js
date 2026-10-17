/* ===== COMPONENT DIỄN ĐÀN NGƯỜI THẬT, KẾT BẠN 2 CHIỀU & NHẮN TIN 1-1 (TN9) ===== */

async function sendFriendReq(toUid, toName) {
  if (!currentUser || !myUid()) return openAuthModal('login');
  if (!toUid || toUid === myUid()) return;
  if (MY_FRIENDS[toUid]) return toast('Hai bạn đã là bạn bè của nhau rồi! 🤝');

  var reqObj = {
    fromUid: myUid(),
    fromName: myName(),
    fromEmail: currentUser.email || '',
    fromAv: myAvatar(),
    t: Date.now()
  };
  OUTGOING_REQS[toUid] = true;
  await fbFetch('friend_reqs/' + toUid + '/' + myUid(), 'PUT', reqObj);
  await fbFetch('sent_reqs/' + myUid() + '/' + toUid, 'PUT', true);
  toast('📨 Đã gửi lời mời kết bạn tới ' + (toName || 'bạn học') + '! Chờ bạn ấy đồng ý nhé.');
  if (ST.view === 'forum') render();
}

async function acceptFriendReq(fromUid, fromName) {
  if (!currentUser || !myUid()) return;
  var me = myUid();
  MY_FRIENDS[fromUid] = true;
  delete INCOMING_REQS[fromUid];

  await fbFetch('friends/' + me + '/' + fromUid, 'PUT', true);
  await fbFetch('friends/' + fromUid + '/' + me, 'PUT', true);
  await fbFetch('friend_reqs/' + me + '/' + fromUid, 'DELETE');
  await fbFetch('sent_reqs/' + fromUid + '/' + me, 'DELETE');

  renderAuth();
  toast('🤝 Đã đồng ý kết bạn với ' + (fromName || 'bạn học') + '! Bây giờ hai bạn có thể nhắn tin riêng.');
  if (ST.view === 'forum') render();
}

async function declineFriendReq(fromUid) {
  if (!currentUser || !myUid()) return;
  var me = myUid();
  delete INCOMING_REQS[fromUid];
  await fbFetch('friend_reqs/' + me + '/' + fromUid, 'DELETE');
  await fbFetch('sent_reqs/' + fromUid + '/' + me, 'DELETE');
  renderAuth();
  toast('Đã từ chối lời mời kết bạn.');
  if (ST.view === 'forum') render();
}

function getPairId(uid1, uid2) {
  return [String(uid1), String(uid2)].sort().join('__');
}

async function openDM(friendUid) {
  if (!currentUser || !myUid()) return openAuthModal('login');
  if (!MY_FRIENDS[friendUid]) return toast('⚠️ Hai bạn cần kết bạn và được đồng ý trước khi nhắn tin riêng tư!');
  ST.activeChatUid = friendUid;
  await loadDMMessages(friendUid);
  if (ST.view !== 'forum') go('forum'); else render();
}

async function loadDMMessages(friendUid) {
  if (!currentUser || !friendUid) return;
  var pairId = getPairId(myUid(), friendUid);
  var msgs = await fbFetch('dms/' + pairId);
  DM_MSGS = (msgs && typeof msgs === 'object') ? msgs : {};
}

async function sendDM() {
  if (!currentUser || !ST.activeChatUid) return;
  var fUid = ST.activeChatUid;
  if (!MY_FRIENDS[fUid]) return toast('Chỉ có thể nhắn tin riêng với bạn bè đã kết nối!');
  var inp = $('#dmInput');
  var txt = (inp ? inp.value : ST.dmDraft).trim();
  if (!txt) return;

  var pairId = getPairId(myUid(), fUid);
  var msgId = 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  var msgObj = {
    id: msgId,
    senderUid: myUid(),
    senderName: myName(),
    text: txt,
    t: Date.now()
  };
  ST.dmDraft = '';
  if (inp) inp.value = '';
  DM_MSGS[msgId] = msgObj;
  await fbFetch('dms/' + pairId + '/' + msgId, 'PUT', msgObj);
  if (ST.view === 'forum') render();
  var boxEl = $('#dmBox'); if (boxEl) boxEl.scrollTop = boxEl.scrollHeight;
}

async function pubPost() {
  if (!currentUser || !myUid()) {
    toast('🔐 Vui lòng Đăng nhập hoặc Tạo tài khoản để đăng bài!');
    return openAuthModal('login');
  }
  var body = ST.fdraft.trim(), title = ST.ftitle.trim() || 'Thảo luận Xác suất & Thống kê';
  if (!body) return toast('Bạn hãy viết nội dung trước khi đăng nhé ✍️');
  var ch = Number($('#fch') ? $('#fch').value : 1) || 1;
  var img = ($('#fdraw') && $('#fdraw').checked && PADIMG) ? PADIMG : '';
  var id = 'p' + Date.now().toString(36) + myUid().slice(-4);
  var p = {
    id: id, title: title, ch: ch, body: body, img: img,
    an: myName(), au: myUid(), aa: myAvatar(),
    t: Date.now(), likes: {}, comments: {}
  };
  POSTS[id] = p; ST.fdraft = ''; ST.ftitle = '';
  ls.set('forum_real', POSTS);
  await fbFetch('posts_real/' + id, 'PUT', p);
  toast('🎉 Đã đăng bài viết lên Diễn đàn!');
  if (ST.view === 'forum') render();
}

async function react(pid, kind) {
  if (!currentUser || !myUid()) {
    toast('🔐 Vui lòng đăng nhập để thả cảm xúc!');
    return openAuthModal('login');
  }
  var x = POSTS[pid]; if (!x) return;
  x.likes = x.likes || {};
  var uid = myUid(), nv = (x.likes[uid] === kind) ? null : kind;
  if (nv) x.likes[uid] = nv; else delete x.likes[uid];
  ls.set('forum_real', POSTS);
  await fbFetch('posts_real/' + pid + '/likes/' + uid, 'PUT', nv);
  if (ST.view === 'forum') render();
}

async function comment(pid, txt) {
  if (!currentUser || !myUid()) {
    toast('🔐 Vui lòng đăng nhập để bình luận!');
    return openAuthModal('login');
  }
  txt = (txt || '').trim(); if (!txt || !POSTS[pid]) return;
  var cid = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  var c = { id: cid, body: txt, an: myName(), au: myUid(), aa: myAvatar(), t: Date.now() };
  POSTS[pid].comments = POSTS[pid].comments || {};
  POSTS[pid].comments[cid] = c;
  ls.set('forum_real', POSTS);
  await fbFetch('posts_real/' + pid + '/comments/' + cid, 'PUT', c);
  if (ST.view === 'forum') render();
}

function cmt(pid) { var v = ST.cd[pid] || ''; ST.cd[pid] = ''; comment(pid, v); }

async function syncFB() {
  var d = await fbFetch('posts_real');
  var chg = false;
  if (d && typeof d === 'object') {
    var newPosts = {};
    for (var id in d) {
      var rPost = d[id];
      if (!rPost || !rPost.id || rPost.au === 'owl') continue;
      newPosts[id] = Object.assign({}, rPost, { likes: rPost.likes || {}, comments: rPost.comments || {} });
    }
    if (JSON.stringify(newPosts) !== JSON.stringify(POSTS)) {
      POSTS = newPosts;
      ls.set('forum_real', POSTS);
      chg = true;
    }
  }

  if (currentUser && myUid()) {
    var me = myUid();
    await fbFetch('users/' + me, 'PUT', { uid: me, name: myName(), email: currentUser.email || '', av: myAvatar(), seen: Date.now() });

    var fr = await fbFetch('friends/' + me);
    var newFriends = (fr && typeof fr === 'object') ? fr : {};
    if (JSON.stringify(newFriends) !== JSON.stringify(MY_FRIENDS)) { MY_FRIENDS = newFriends; chg = true; }

    var inReqs = await fbFetch('friend_reqs/' + me);
    var newIn = (inReqs && typeof inReqs === 'object') ? inReqs : {};
    if (JSON.stringify(newIn) !== JSON.stringify(INCOMING_REQS)) { INCOMING_REQS = newIn; renderAuth(); chg = true; }

    var outReqs = await fbFetch('sent_reqs/' + me);
    OUTGOING_REQS = (outReqs && typeof outReqs === 'object') ? outReqs : {};

    if (ST.activeChatUid && MY_FRIENDS[ST.activeChatUid]) {
      var pairId = getPairId(me, ST.activeChatUid);
      var dmData = await fbFetch('dms/' + pairId);
      var newDM = (dmData && typeof dmData === 'object') ? dmData : {};
      if (Object.keys(newDM).length !== Object.keys(DM_MSGS).length) {
        DM_MSGS = newDM; chg = true;
      }
    }
  }

  var u = await fbFetch('users');
  if (u && typeof u === 'object') {
    if (Object.keys(u).length !== Object.keys(USERS).length) chg = true;
    USERS = u;
  }

  if (chg && ST.view === 'forum') {
    var act = document.activeElement;
    if (!act || (act.tagName !== 'INPUT' && act.tagName !== 'TEXTAREA')) render();
  }
}

function startSync() { clearInterval(fbPoll); syncFB(); fbPoll = setInterval(syncFB, 4000); }

function avHTML(av, cls) {
  cls = cls || 'w-8 h-8';
  return (av && String(av).indexOf('http') === 0)
    ? '<img src="' + attr(av) + '" class="' + cls + ' rounded-full border-2 border-[#2D2A4A] inline-block">'
    : '<span class="text-2xl">' + (av || '🦊') + '</span>';
}

function relationBtnHTML(targetUid, targetName) {
  if (!targetUid || targetUid === myUid()) return '<span class="tag bg-[#FFF1B8]">Bạn</span>';
  if (MY_FRIENDS[targetUid]) {
    return '<span class="tag bg-[#BFF1DC]">🤝 Bạn bè</span> ' +
      '<button class="bt text-xs bg-[#D9C9FF] ml-1" onclick="openDM(\'' + targetUid + '\')">💬 Nhắn tin</button>';
  }
  if (INCOMING_REQS[targetUid]) {
    return '<button class="bt text-xs bg-[#BFF1DC]" onclick="acceptFriendReq(\'' + targetUid + '\',\'' + attr(targetName) + '\')">✅ Đồng ý KB</button>';
  }
  if (OUTGOING_REQS[targetUid]) {
    return '<span class="tag bg-gray-100">⏳ Đã gửi lời mời</span>';
  }
  return '<button class="bt text-xs bg-white" onclick="sendFriendReq(\'' + targetUid + '\',\'' + attr(targetName) + '\')">➕ Kết bạn</button>';
}

function postHTML(x) {
  var likes = x.likes || {}, ks = Object.values(likes).filter(Boolean);
  var cnt = function(k) { return ks.filter(function(v) { return v === k; }).length; };
  var mine = myUid() ? likes[myUid()] : null;
  var cms = Object.values(x.comments || {}).filter(function(c) { return c && c.au !== 'owl'; }).sort(function(a, b) { return a.t - b.t; });
  var isFriend = x.au && MY_FRIENDS[x.au];

  return '<article class="pc p-4 ' + (isFriend ? 'ring-4 ring-[#BFF1DC]' : '') + '">' +
    '<div class="flex items-center gap-2 flex-wrap">' + avHTML(x.aa) +
    '<div><b>' + esc(x.an || 'Thành viên') + '</b>' +
    '<div class="text-xs">' + new Date(x.t).toLocaleString('vi-VN') + ' · Chương ' + (x.ch || 1) + '</div></div>' +
    '<div class="ml-auto flex items-center gap-1">' + relationBtnHTML(x.au, x.an) + '</div></div>' +
    '<h3 class="font-black text-lg mt-2">' + esc(x.title) + '</h3>' +
    '<div class="mt-1">' + esc(x.body).replace(/\n/g, '<br>') + '</div>' +
    (x.img ? '<img src="' + attr(x.img) + '" class="mt-2 rounded-xl border-2 border-[#2D2A4A] max-h-64">' : '') +
    '<div class="flex flex-wrap gap-2 mt-3">' +
    REACTS.map(function(r) { return '<button class="bt text-xs ' + (mine === r[0] ? 'on' : '') + '" onclick="react(\'' + x.id + '\',\'' + r[0] + '\')">' + r[1] + ' ' + cnt(r[0]) + '</button>'; }).join('') +
    '</div>' +
    '<div class="mt-3 space-y-2">' +
    cms.map(function(c) {
      var cFriend = c.au && MY_FRIENDS[c.au];
      return '<div class="rounded-2xl bg-[#F8FAFC] border-2 border-[#2D2A4A] p-2 text-sm">' +
        '<b>' + esc(c.an) + '</b> ' + (cFriend ? '<span class="tag bg-[#BFF1DC] text-[10px]">🤝 Bạn bè</span> ' : '') + ': ' +
        esc(c.body).replace(/\n/g, '<br>') + '</div>';
    }).join('') + '</div>' +
    '<div class="flex gap-2 mt-2"><input class="flex-1 text-sm" placeholder="Viết bình luận của bạn..." value="' + attr(ST.cd[x.id] || '') + '" oninput="ST.cd[\'' + x.id + '\']=this.value" onkeydown="if(event.key===\'Enter\')cmt(\'' + x.id + '\')"><button class="bt text-sm" onclick="cmt(\'' + x.id + '\')">Gửi</button></div></article>';
}

function rForum(a) {
  var posts = Object.values(POSTS).filter(function(p) { return p && p.au !== 'owl'; }).sort(function(x, y) { return y.t - x.t; });
  var inList = Object.values(INCOMING_REQS || {});
  var friendUids = Object.keys(MY_FRIENDS || {}).filter(function(k) { return MY_FRIENDS[k]; });
  var allMembers = Object.values(USERS || {}).filter(function(u) { return u && u.uid && u.uid !== myUid(); });

  var activeFriend = ST.activeChatUid && USERS[ST.activeChatUid] ? USERS[ST.activeChatUid] : null;
  var dmList = Object.values(DM_MSGS || {}).sort(function(x, y) { return x.t - y.t; });

  a.innerHTML = '<div class="grid md:grid-cols-12 gap-4">' +
    /* Cột trái: Tài khoản, Lời mời kết bạn & Danh sách thành viên */
    '<aside class="md:col-span-4 space-y-4">' +
    '<div class="pc p-4 text-center">' +
    (currentUser ? (
      '<div>' + avHTML(myAvatar(), 'w-14 h-14 mx-auto') + '</div>' +
      '<b class="block mt-2 text-lg">' + esc(myName()) + '</b>' +
      '<div class="text-xs text-gray-600 font-bold">' + esc(currentUser.email) + '</div>' +
      '<div class="flex gap-2 justify-center mt-3">' +
      '<button class="bt text-xs bg-white" onclick="go(\'stats\')">🪪 Sửa Hồ sơ</button>' +
      '<button class="bt text-xs bg-[#FFD2D0]" onclick="logoutUser()">🚪 Đăng xuất</button></div>'
    ) : (
      '<div class="text-3xl">🔐</div><b class="block mt-1">Bạn chưa đăng nhập</b>' +
      '<p class="text-xs mt-1">Hãy tạo tài khoản hoặc đăng nhập để kết bạn, nhắn tin riêng và đăng bài!</p>' +
      '<div class="flex gap-2 justify-center mt-3">' +
      '<button class="bt text-xs bg-[#BFF1DC]" onclick="openAuthModal(\'login\')">🔑 Đăng nhập</button>' +
      '<button class="bt text-xs bg-[#D9C9FF]" onclick="openAuthModal(\'register\')">✨ Tạo tài khoản</button></div>'
    )) + '</div>' +

    /* Khung Lời mời kết bạn */
    '<div class="pc p-4 bg-[#FFF1B8]">' +
    '<b>🔔 Lời mời kết bạn (' + inList.length + ')</b>' +
    (inList.length ? inList.map(function(req) {
      return '<div class="p-2 mt-2 bg-white rounded-xl border-2 border-[#2D2A4A] text-sm">' +
        '<div class="font-bold">' + avHTML(req.fromAv, 'w-5 h-5') + ' ' + esc(req.fromName) + ' muốn kết bạn với bạn</div>' +
        '<div class="flex gap-2 mt-2">' +
        '<button class="bt text-xs bg-[#BFF1DC] flex-1" onclick="acceptFriendReq(\'' + req.fromUid + '\',\'' + attr(req.fromName) + '\')">✅ Đồng ý</button>' +
        '<button class="bt text-xs bg-[#FFD2D0]" onclick="declineFriendReq(\'' + req.fromUid + '\')">❌ Từ chối</button></div></div>';
    }).join('') : '<p class="text-xs mt-2">Chưa có lời mời kết bạn mới nào.</p>') + '</div>' +

    /* Danh sách bạn bè đã kết nối */
    '<div class="pc p-4">' +
    '<b>🤝 Bạn bè của tôi (' + friendUids.length + ')</b>' +
    (friendUids.length ? friendUids.map(function(fUid) {
      var fUser = USERS[fUid] || { name: 'Bạn học', av: '🦊' };
      return '<div class="flex items-center gap-2 mt-2 p-2 rounded-xl bg-[#F8FAFC] border-2 border-[#2D2A4A] text-sm">' +
        avHTML(fUser.av, 'w-6 h-6') +
        '<span class="flex-1 font-bold truncate">' + esc(fUser.name) + '</span>' +
        '<button class="bt text-xs bg-[#D9C9FF]" onclick="openDM(\'' + fUid + '\')">💬 Nhắn tin</button></div>';
    }).join('') : '<p class="text-xs mt-2 text-gray-600">Bạn chưa có bạn bè nào. Hãy gửi lời mời kết bạn ở danh sách bên dưới nhé!</p>') + '</div>' +

    /* Danh sách thành viên cộng đồng */
    '<div class="pc p-4">' +
    '<b>🌐 Thành viên Cộng đồng (' + allMembers.length + ')</b>' +
    '<div class="max-h-60 overflow-y-auto space-y-2 mt-2">' +
    (allMembers.length ? allMembers.map(function(u) {
      var isOnline = u.seen && (Date.now() - u.seen < 180000);
      return '<div class="flex items-center gap-2 p-2 rounded-xl border border-[#2D2A4A] text-xs">' +
        '<span>' + (isOnline ? '🟢' : '⚪') + '</span>' +
        '<div class="flex-1 truncate"><b>' + esc(u.name) + '</b></div>' +
        relationBtnHTML(u.uid, u.name) + '</div>';
    }).join('') : '<p class="text-xs text-gray-600">Hãy mời bạn bè tạo tài khoản để kết nối cùng nhau!</p>') +
    '</div></div></aside>' +

    /* Cột giữa & phải: Khung chat 1-1 + Bảng tin thảo luận */
    '<section class="md:col-span-8 space-y-4">' +

    /* Khung chat riêng tư 1-1 */
    (ST.activeChatUid && MY_FRIENDS[ST.activeChatUid] ? (
      '<div class="pc p-4 bg-[#EFFFF8] border-4 border-[#2D2A4A]">' +
      '<div class="flex items-center justify-between border-b-2 border-[#2D2A4A] pb-2">' +
      '<div><b>💬 Trò chuyện riêng tư với: ' + (activeFriend ? esc(activeFriend.name) : 'Bạn bè') + '</b> <span class="tag bg-[#BFF1DC] ml-1">🤝 Bạn bè</span></div>' +
      '<button class="bt text-xs bg-white" onclick="ST.activeChatUid=null;render()">Đóng khung chat ✕</button></div>' +
      '<div id="dmBox" class="max-h-64 overflow-y-auto my-3 space-y-2 p-2 bg-white rounded-xl border-2 border-[#2D2A4A]">' +
      (dmList.length ? dmList.map(function(m) {
        var isMe = (m.senderUid === myUid());
        return '<div class="' + (isMe ? 'text-right' : 'text-left') + '">' +
          '<div class="inline-block px-3 py-1.5 rounded-2xl border-2 border-[#2D2A4A] text-sm ' + (isMe ? 'bg-[#BFF1DC]' : 'bg-[#F3EEFF]') + '">' +
          '<b>' + esc(m.senderName) + ':</b> ' + esc(m.text) +
          '<div class="text-[10px] text-gray-600">' + new Date(m.t).toLocaleTimeString('vi-VN') + '</div></div></div>';
      }).join('') : '<p class="text-center text-xs text-gray-500 py-4">Hai bạn đã là bạn bè! Hãy gửi tin nhắn đầu tiên để bắt đầu trò chuyện riêng tư nhé 👋</p>') +
      '</div>' +
      '<div class="flex gap-2">' +
      '<input id="dmInput" class="flex-1 text-sm" placeholder="Nhập tin nhắn riêng tư..." value="' + attr(ST.dmDraft) + '" oninput="ST.dmDraft=this.value" onkeydown="if(event.key===\'Enter\')sendDM()">' +
      '<button class="bt bg-[#BFF1DC] text-sm" onclick="sendDM()">📨 Gửi tin nhắn</button></div></div>'
    ) : '') +

    /* Khung đăng bài thảo luận */
    '<div class="pc p-4"><b>📝 Đăng bài thảo luận lên Cộng đồng (100% Người thật)</b>' +
    '<input id="ftitle" class="w-full mt-2 text-sm" placeholder="Tiêu đề bài viết (VD: Thảo luận bài tập Chương 3)" value="' + attr(ST.ftitle) + '" oninput="ST.ftitle=this.value">' +
    '<textarea id="fbody" rows="3" class="w-full mt-2 text-sm" placeholder="Chia sẻ câu hỏi, cách giải hoặc trao đổi với bạn bè (hỗ trợ gõ công thức $...$)..." oninput="ST.fdraft=this.value">' + esc(ST.fdraft) + '</textarea>' +
    '<div class="flex flex-wrap gap-2 mt-2 items-center"><select id="fch" class="text-sm">' + CH.map(function(c, i) { return '<option value="' + (i + 1) + '">Chương ' + (i + 1) + '</option>'; }).join('') + '</select>' +
    '<label class="text-xs font-bold"><input type="checkbox" id="fdraw" ' + (PADIMG ? '' : 'disabled') + '> 📎 Đính kèm bảng vẽ iPad</label>' +
    '<button class="bt ml-auto bg-[#BFF1DC] text-sm" onclick="pubPost()">📮 Đăng bài</button></div></div>' +

    /* Danh sách bài đăng */
    (posts.length ? posts.map(postHTML).join('') : '<div class="pc p-6 text-center font-bold">🌐 Diễn đàn 100% người thật hiện chưa có bài đăng nào. Bạn hãy đăng nhập và đăng bài viết đầu tiên để kết nối với mọi người nhé!</div>') +
    '</section></div>';
  tx();
}
