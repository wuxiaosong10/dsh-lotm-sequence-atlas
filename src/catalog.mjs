// The approved Clown is light. Other scenes mix light and dark references;
// each separates story/action and complementary navigation pigments.
const rows = [
 // id, name, colorName, dark, base, panel, soft, sidebar, ink, muted, action, auxiliary, mistStart, mistEnd, decorativeGradient
 ['9','占卜家','夜蓝月铜',true,'#141B29','#202A37','#2B3745','#17232C','#F0F4F6','#B9CAD1','#DFC08B','#8FCFD0','#294B62','#665274',true],
 ['8','小丑','象牙绯红',false,'#F4EFE8','#FCFAF6','#ECE5E0','#DFE9E6','#24323A','#48595F','#854055','#356A72','#BDD5D7','#DFB8AE',true],
 ['7','魔术师','雾麦梅紫',false,'#EFEEE4','#FAFAF4','#E8E9DC','#E3E7DB','#2E372F','#4E5A4A','#53673D','#865365','#D1D8B9','#D7C39B',false],
 ['6','无面人','深海古铜',true,'#111D31','#1B2A43','#27364F','#152A38','#F2F6FA','#BBCBDC','#E2B98B','#91C9E0','#254F77','#785743',true],
 ['5','秘偶大师','墨绿旧金',true,'#10231F','#1B332C','#2C443A','#10231F','#EEE5D2','#BBD2C5','#D1BC91','#9EBFAE','#275E52','#6D536F',false],
 ['4','诡法师','暮金灰玫',false,'#F2ECE3','#FCF8F2','#E9DFD6','#E7DDD5','#382F2C','#62534E','#804C40','#3F6269','#D4CBC0','#CDAFA5',true],
 ['3','古代学者','青瓷旧金',false,'#EDF1F0','#FAFBF9','#E2EAE9','#DEE8E7','#283B40','#465C62','#40636A','#7A5B36','#C6D9D2','#E0D0B6',false],
 ['2','奇迹师','奶杏孔雀',false,'#F4EEE2','#FCF9F2','#EEE4D5','#E9E4D9','#3E342A','#5C5145','#80572C','#3F656B','#C3D9D5','#E2C497',true],
 ['1','诡秘侍者','紫幕冷翠',true,'#251C31','#342B43','#443851','#1F2C33','#F8F1FC','#D1C2DE','#E1B9CB','#9ECEC5','#57416F','#2F645D',true],
 ['0','愚者','雾银旧金',true,'#202831','#2C3743','#3A4551','#242E39','#F5F7FA','#C7D0DA','#DDC397','#A9C6D5','#40576B','#745B60',false],
];
const codeSurfaces = ['#0E1722','#FBF8F2','#F7F8EE','#0D1728','#0E211A','#FAF6EF','#F4F9F7','#FCF7ED','#1B1427','#171F2A'];
export const THEMES = rows.map(([id,name,colorName,dark,bg,panel,panelSoft,sidebar,text,muted,accent,aux,mistStart,mistEnd,gradient],index) => ({
 id,name,colorName,dark,bg,panel,panelSoft,sidebar,text,muted,accent,aux,onAccent:dark?'#1F2630':'#FFFFFF',
 chromeBg:sidebar,mistStart,mistEnd,gradient,
 codeBg:codeSurfaces[index],codeText:text,codeKeyword:dark?'#D3AFDF':'#7D3F72',codeString:dark?'#BDDAAB':'#91500F',
 codeFunction:dark?'#E6C593':'#256875',codeNumber:dark?'#B4C7ED':'#66528A',codeComment:dark?'#9BAEB8':'#536560',
 displayFont:'"STSong", "SimSun", "Songti SC", serif',
 uiFont:'"Microsoft YaHei UI", "Segoe UI", system-ui, sans-serif',
 codeFont:'"Cascadia Code", Consolas, "Courier New", monospace',
 line:dark?'#657383':'#BFCCCE',success:dark?'#9ED8B1':'#26704A',warning:dark?'#E7C78B':'#7C5A1C',danger:dark?'#F3A5AD':'#A3293D',
 asset:'sequence-'+id+(id==='8'?'-light':'')+'.webp',thumb:'thumb-'+id+(id==='8'?'-light':'')+'.webp',
 video:'videos/sequence-'+id+'.mp4',videoLoop:id!=='4',mediaVersion:id==='0'?'20261031.2':'20261031.1',
 ornament:['#CFB887','#866B46','#786343','#CFAB7D','#CAB98C','#86583D','#806644','#886238','#C9A9BD','#C9B88D'][index]
}));
export const ASSET_PREFIX = '/api/lotm-sequence-atlas/assets/';
