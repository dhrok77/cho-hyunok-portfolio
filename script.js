// 작품의 "자세히 보기" 버튼 기능
function showProject(projectName) {
  if (projectName === '직무 전문성 & 핵심 역량') {
    showProjectWork('project-01');
    return;
  }
  if (projectName === '생성형 AI기반 업무 생산성 혁신') {
    showProjectWork('project-02-choice');
    return;
  }
  if (projectName === '웹페이지 기획 & 디지털 포트폴리오') {
    showProjectWork('project-03-gallery');
    return;
  }
  if (projectName === '생성형 AI 멀티미디어 & 크리에이티브') {
    showProjectGallery();
    return;
  }
  alert(projectName + ' 프로젝트의 상세 내용을 준비하고 있습니다.');
}

// 4번 작품 선택 화면(바둑판)을 먼저 보여주기
function showProjectGallery() {
  closeAllProjectViews();
  const gallery = document.getElementById('project-04-gallery');
  if (!gallery) return;
  gallery.hidden = false;
  requestAnimationFrame(() => gallery.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

function closeAllProjectViews() {
  document.querySelectorAll('.project-section, .project-gallery-section').forEach((section) => {
    section.querySelectorAll('video, audio').forEach((media) => { media.pause(); media.currentTime = 0; });
    section.querySelectorAll('.project-video-wrap').forEach((panel) => panel.hidden = true);
    section.querySelectorAll('.single-audio-player').forEach((panel) => panel.hidden = true);
    section.querySelectorAll('.audio-play-button').forEach((button) => { button.textContent = '▶ 음악듣기'; });
    section.querySelectorAll('.video-toggle-button').forEach((button) => { button.textContent = button.dataset.media === 'audio' ? '▶ 음악듣기' : '▶ 영상보기'; });
    section.hidden = true;
  });
}

// 4번 작품을 한 화면(섹션)에 하나씩 보여주기
function showProjectWork(sectionId) {
  closeAllProjectViews();
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.hidden = false;
  requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

// 각 프로젝트의 영상보기/닫기 버튼
function toggleProjectVideo(panelId, button) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const video = panel.querySelector('video');
  if (panel.hidden) {
    panel.hidden = false;
    button.textContent = '■ 영상닫기';
    requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  } else {
    if (video) { video.pause(); video.currentTime = 0; }
    panel.hidden = true;
    button.textContent = '▶ 영상보기';
  }
}

function hideProject() {
  closeAllProjectViews();
  document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth', block: 'start' });
}



// Suno AI 음악 프로젝트: 곡별 음악듣기/닫기
function toggleSingleAudio(playerId, button) {
  const player = document.getElementById(playerId);
  if (!player) return;

  const currentAudio = player.querySelector('audio');
  const willOpen = player.hidden;

  // 다른 곡이 재생 중이면 정지하고 닫기
  document.querySelectorAll('#project-04-05 .single-audio-player').forEach((otherPlayer) => {
    if (otherPlayer !== player) {
      const otherAudio = otherPlayer.querySelector('audio');
      if (otherAudio) {
        otherAudio.pause();
        otherAudio.currentTime = 0;
      }
      otherPlayer.hidden = true;
    }
  });

  document.querySelectorAll('#project-04-05 .audio-play-button').forEach((otherButton) => {
    if (otherButton !== button) otherButton.textContent = '▶ 음악듣기';
  });

  if (willOpen) {
    player.hidden = false;
    button.textContent = '■ 음악닫기';
    requestAnimationFrame(() => player.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  } else {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    player.hidden = true;
    button.textContent = '▶ 음악듣기';
  }
}

function openQualificationModal(src,title){
 const m=document.getElementById("qualification-modal"),i=document.getElementById("qualification-modal-image"),h=document.getElementById("qualification-modal-title");
 if(!m||!i||!h)return;i.src=src;i.alt=title;h.textContent=title;m.hidden=false;document.body.style.overflow="hidden";
}
function closeQualificationModal(){const m=document.getElementById("qualification-modal");if(!m)return;m.hidden=true;document.body.style.overflow="";}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeQualificationModal();});


// PROJECT 03 · AI Memo Organizer 브라우저 데모
function organizeMemoDemo() {
  const input = document.getElementById('memo-demo-text');
  const result = document.getElementById('memo-demo-results');
  const count = document.getElementById('memo-demo-count');
  if (!input || !result || !count) return;

  const lines = input.value.split(/\n|[•·]+/).map(v => v.trim()).filter(Boolean);
  if (!lines.length) {
    result.innerHTML = '<div class="memo-empty">정리할 메모를 입력해주세요.</div>';
    count.textContent = '0개 메모';
    return;
  }

  const categories = { '일정': [], '장보기': [], '업무': [], '기타': [] };
  const scheduleWords = /(월요일|화요일|수요일|목요일|금요일|토요일|일요일|오늘|내일|모레|오전|오후|시\b|분\b|미팅|회의|예약|약속|일정)/;
  const shoppingWords = /(사기|구매|장보기|마트|시장|우유|계란|과일|채소|고기|쌀|휴지|세제)/;
  const workWords = /(업무|보고서|제출|거래처|고객|메일|이메일|견적|계약|프로젝트|회의록|정산|결산|세금|세무|회계|자료|작성|검토)/;
  const urgentWords = /(오늘|지금|긴급|중요|필수|마감|까지|제출)/;

  lines.forEach(text => {
    let category = '기타';
    if (shoppingWords.test(text)) category = '장보기';
    else if (workWords.test(text)) category = '업무';
    else if (scheduleWords.test(text)) category = '일정';

    const priority = urgentWords.test(text) ? '중요' : '일반';
    const schedule = (text.match(/(오늘|내일|모레|(?:월|화|수|목|금|토|일)요일|오전\s*\d{1,2}시|오후\s*\d{1,2}시|\d{1,2}시)/) || [])[0] || '';
    categories[category].push({ text, priority, schedule });
  });

  const icon = { '일정':'◷', '장보기':'🛒', '업무':'▣', '기타':'✦' };
  let output = '';
  Object.keys(categories).forEach(cat => {
    categories[cat].forEach(item => {
      output += `<article class="memo-result-card memo-cat-${cat}">
        <div class="memo-result-meta">
          <span class="memo-result-category">${icon[cat]} ${cat}</span>
          <span class="memo-priority ${item.priority === '중요' ? 'is-important' : ''}">${item.priority}</span>
        </div>
        <p>${escapeMemoHtml(item.text)}</p>
        ${item.schedule ? `<small>일정 정보 · ${escapeMemoHtml(item.schedule)}</small>` : ''}
      </article>`;
    });
  });
  result.innerHTML = output;
  count.textContent = `${lines.length}개 메모`;
}

function escapeMemoHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function clearMemoDemo() {
  const input = document.getElementById('memo-demo-text');
  const result = document.getElementById('memo-demo-results');
  const count = document.getElementById('memo-demo-count');
  if (input) input.value = '';
  if (result) result.innerHTML = '<div class="memo-empty">메모를 입력한 뒤 <b>정리하기</b>를 눌러주세요.</div>';
  if (count) count.textContent = '0개 메모';
}


// PROJECT 03 · 게임모음: 선택한 게임을 포트폴리오 안에서 실행
function openPortfolioGame(src, title) {
  const panel = document.getElementById('game-player-panel');
  const frame = document.getElementById('game-player-frame');
  const heading = document.getElementById('game-player-title');
  if (!panel || !frame || !heading) return;
  heading.textContent = title || '게임 플레이';
  frame.src = src;
  panel.hidden = false;
  requestAnimationFrame(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}
function closePortfolioGame() {
  const panel = document.getElementById('game-player-panel');
  const frame = document.getElementById('game-player-frame');
  if (frame) frame.src = 'about:blank';
  if (panel) panel.hidden = true;
}


// CONTACT · 이메일/연락처 선택 패널
function toggleContactPanel(panelId, button) {
  const panels = ['email-options', 'phone-options'];
  panels.forEach(id => {
    const panel = document.getElementById(id);
    if (!panel) return;
    if (id === panelId) {
      panel.hidden = !panel.hidden;
    } else {
      panel.hidden = true;
    }
  });
}
