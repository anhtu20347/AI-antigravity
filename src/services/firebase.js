/* ===== DỊCH VỤ DỮ LIỆU ĐÁM MÂY & XÁC THỰC FIREBASE ===== */

var firebaseConfig = {
  apiKey: "AIzaSyAcSJ9u6JNPDZE6JX-LxxXLFehDHEm6Bo",
  authDomain: "web-xstk.firebaseapp.com",
  databaseURL: "https://web-xstk-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-xstk",
  storageBucket: "web-xstk.firebasestorage.app",
  messagingSenderId: "129353981164",
  appId: "1:129353981164:web:bbd22cf1216b7ae0f759c9",
  measurementId: "G-CMNJ4BNPVE"
};

var auth = null;
var currentUser = ls.get('session_user', null);
var USERS = {};
var POSTS = ls.get('forum_real', {});
if (!POSTS || typeof POSTS !== 'object') POSTS = {};
var MY_FRIENDS = {};
var INCOMING_REQS = {};
var OUTGOING_REQS = {};
var DM_MSGS = {};
var fbPoll = null;
var FB_URL = 'https://web-xstk-default-rtdb.asia-southeast1.firebasedatabase.app';

async function fbFetch(path, method, body) {
  method = method || 'GET';
  try {
    var opts = { method: method, headers: { 'Content-Type': 'application/json' } };
    if (body !== undefined && body !== null) opts.body = JSON.stringify(body);
    var r = await fetch(FB_URL + '/' + path + '.json', opts);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; }
}

function emailToKey(email) {
  return String(email || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
}
function myUid() { return currentUser ? currentUser.uid : ''; }
function myName() { return currentUser ? currentUser.displayName : (PROF.name || 'Khách (Chưa đăng nhập)'); }
function myAvatar() { return currentUser ? (currentUser.photoURL || currentUser.avatar || '🦊') : '🦉'; }

function initFirebase() {
  try {
    if (window.firebase && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    if (window.firebase) {
      auth = firebase.auth();
      auth.onAuthStateChanged(function(u) {
        if (u) {
          var uid = 'gg_' + u.uid;
          currentUser = {
            uid: uid,
            displayName: u.displayName || u.email,
            email: u.email || '',
            photoURL: u.photoURL || '',
            avatar: '🦊'
          };
          ls.set('session_user', currentUser);
          PROF.name = currentUser.displayName;
          PROF.email = currentUser.email;
          ls.set('prof', PROF);
          fbFetch('users/' + uid, 'PUT', { uid: uid, name: currentUser.displayName, email: currentUser.email, av: currentUser.photoURL || '🦊', seen: Date.now() });
          renderAuth();
          syncFB();
          if (ST.view === 'forum' || ST.view === 'stats') render();
        }
      });
    }
  } catch (e) { console.warn('Firebase init:', e); }
}

function openAuthModal(tab) {
  var m = $('#authModal'); if (!m) return;
  switchAuthTab(tab || 'login');
  m.classList.remove('hidden'); m.classList.add('flex');
}
function closeAuthModal() {
  var m = $('#authModal'); if (!m) return;
  m.classList.add('hidden'); m.classList.remove('flex');
}
function switchAuthTab(tab) {
  var isLogin = (tab === 'login');
  $('#formLogin').classList.toggle('hidden', !isLogin);
  $('#formRegister').classList.toggle('hidden', isLogin);
  $('#tabLoginBtn').classList.toggle('on', isLogin);
  $('#tabRegBtn').classList.toggle('on', !isLogin);
}

async function doRegister() {
  var name = ($('#rName').value || '').trim();
  var email = ($('#rEmail').value || '').trim().toLowerCase();
  var pass = ($('#rPass').value || '').trim();
  var av = ($('#rAvatar').value || '🦊');

  if (!name) return toast('⚠️ Vui lòng nhập Tên hiển thị của bạn!');
  if (!email || email.indexOf('@') < 1) return toast('⚠️ Vui lòng nhập địa chỉ Gmail hợp lệ!');
  if (pass.length < 4) return toast('⚠️ Mật khẩu cần có ít nhất 4 ký tự!');

  var eKey = emailToKey(email);
  toast('⏳ Đang kiểm tra và tạo tài khoản...');
  var existing = await fbFetch('accounts/' + eKey);
  if (existing && existing.email) {
    return toast('⚠️ Tài khoản Gmail này đã được đăng ký! Vui lòng chuyển sang tab Đăng nhập.');
  }

  var uid = 'acc_' + eKey;
  var accData = {
    uid: uid,
    name: name,
    email: email,
    pass: btoa(unescape(encodeURIComponent(pass))),
    avatar: av,
    createdAt: Date.now()
  };

  await fbFetch('accounts/' + eKey, 'PUT', accData);
  await fbFetch('users/' + uid, 'PUT', { uid: uid, name: name, email: email, av: av, seen: Date.now() });

  currentUser = { uid: uid, displayName: name, email: email, photoURL: '', avatar: av };
  ls.set('session_user', currentUser);
  PROF.name = name; PROF.email = email; ls.set('prof', PROF);

  closeAuthModal();
  renderAuth();
  await syncFB();
  render();
  toast('🎉 Tạo tài khoản và đăng nhập thành công! Chào ' + name);
}

async function doLogin() {
  var email = ($('#lEmail').value || '').trim().toLowerCase();
  var pass = ($('#lPass').value || '').trim();
  if (!email || !pass) return toast('⚠️ Vui lòng nhập đầy đủ Gmail và Mật khẩu!');

  var eKey = emailToKey(email);
  toast('⏳ Đang xác thực tài khoản...');
  var acc = await fbFetch('accounts/' + eKey);
  if (!acc || !acc.uid) {
    return toast('❌ Không tìm thấy tài khoản với Gmail này! Bạn hãy bấm "Tạo tài khoản" nhé.');
  }
  var encodedPass = btoa(unescape(encodeURIComponent(pass)));
  if (acc.pass !== encodedPass) {
    return toast('❌ Mật khẩu chưa chính xác! Vui lòng kiểm tra lại.');
  }

  currentUser = {
    uid: acc.uid,
    displayName: acc.name,
    email: acc.email,
    photoURL: '',
    avatar: acc.avatar || '🦊'
  };
  ls.set('session_user', currentUser);
  PROF.name = acc.name; PROF.email = acc.email; ls.set('prof', PROF);

  await fbFetch('users/' + acc.uid, 'PUT', { uid: acc.uid, name: acc.name, email: acc.email, av: acc.avatar || '🦊', seen: Date.now() });
  closeAuthModal();
  renderAuth();
  await syncFB();
  render();
  toast('🎉 Đăng nhập thành công! Chào mừng ' + acc.name);
}

function loginGooglePopup() {
  if (!auth) return toast('⚠️ Vui lòng đăng ký hoặc đăng nhập bằng Gmail & Mật khẩu ở khung trên!');
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(function() {
    closeAuthModal();
    toast('🎉 Đăng nhập Google thành công!');
  }).catch(function(e) {
    toast('💡 Trình duyệt chặn Popup Google. Bạn hãy điền Gmail & Mật khẩu ở khung trên để tạo tài khoản hoặc đăng nhập nhé!');
  });
}

function logoutUser() {
  currentUser = null;
  ST.activeChatUid = null;
  MY_FRIENDS = {}; INCOMING_REQS = {}; OUTGOING_REQS = {}; DM_MSGS = {};
  ls.set('session_user', null);
  if (auth) { try { auth.signOut(); } catch (e) {} }
  renderAuth();
  render();
  toast('👋 Đã đăng xuất tài khoản thành công!');
}

function renderAuth() {
  var el = $('#authArea'); if (!el) return;
  if (currentUser && currentUser.uid) {
    var reqCount = Object.keys(INCOMING_REQS || {}).length;
    el.innerHTML = '<div class="flex items-center gap-2 bg-[#BFF1DC] px-3 py-1 rounded-full border-2 border-[#2D2A4A] text-xs font-black">' +
      (currentUser.photoURL ? '<img src="' + attr(currentUser.photoURL) + '" class="w-5 h-5 rounded-full border border-[#2D2A4A]">' : '<span class="text-base">' + (currentUser.avatar || '🦊') + '</span>') +
      '<span>' + esc(currentUser.displayName) + '</span>' +
      (reqCount ? '<span class="tag bg-[#FFD2D0] cursor-pointer" onclick="go(\'forum\')">🔔 ' + reqCount + ' lời mời KB</span>' : '') +
      '<button class="underline text-red-700 ml-1 font-extrabold" onclick="logoutUser()">Đăng xuất</button></div>';
  } else {
    el.innerHTML = '<button class="bt text-sm bg-[#BFF1DC]" onclick="openAuthModal(\'login\')">🔑 Đăng nhập</button>' +
      '<button class="bt text-sm bg-white" onclick="openAuthModal(\'register\')">✨ Đăng ký</button>';
  }
}
