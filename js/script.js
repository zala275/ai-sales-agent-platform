function showToast(message){const t=document.getElementById('toast');if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
function toggleSidebar(){document.getElementById('sidebar')?.classList.toggle('open')}
function setBilling(btn){document.querySelectorAll('.billing-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');showToast(btn.textContent.trim().startsWith('Yearly')?'Yearly billing selected':'Monthly billing selected')}
function selectPlan(plan){showToast(plan+' plan selected — checkout would open here')}
function openAgentModal(){document.getElementById('agentModal')?.classList.add('show')}
function closeAgentModal(){document.getElementById('agentModal')?.classList.remove('show')}
function createAgent(){const name=document.getElementById('agentName')?.value.trim();if(!name){showToast('Please enter an agent name');return}closeAgentModal();showToast(name+' created successfully')}
function copyCode(){const el=document.getElementById('integrationCode');if(!el)return;navigator.clipboard?.writeText(el.innerText);showToast('Integration code copied')}
function copyKey(){navigator.clipboard?.writeText('SA-8F2K-91MX');showToast('Integration key copied')}
function verifyInstall(){showToast('Checking website installation...');setTimeout(()=>showToast('Demo: installation verified successfully ✓'),1200)}
document.addEventListener('click',e=>{const modal=document.getElementById('agentModal');if(e.target===modal)closeAgentModal()})