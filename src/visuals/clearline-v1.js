// Clearline: original, code-native SVG illustrations. Every catalog ID has an
// explicit drawing; there is deliberately no fallback icon or emoji path.
const C={ink:'#294739',line:'#456452',green:'#60a276',darkGreen:'#34815b',pale:'#d9eadb',red:'#d96551',orange:'#e4a250',yellow:'#edc45d',cream:'#f8edcf',brown:'#a66b48',darkBrown:'#704c3d',blue:'#a7cbd0',white:'#fffdf6',purple:'#98708e'};
const p=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const e=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const c=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const l=(d,color=C.line,w=2)=>p(d,'none',`stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`);
const g=(x,y,s,body)=>`<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
const leaf=(x=0,y=0,s=1,color=C.green)=>g(x,y,s,p('M0 0 C-17 -7 -19 -24 -2 -29 C11 -23 13 -7 0 0Z',color)+l('M0 0 L-3 -22','#e8f2dd',1.5));
const bean=(color=C.darkBrown)=>p('M-9 -4 C-8 -13 4 -14 9 -6 C13 2 6 11 -2 10 C-10 9 -13 2 -9 -4Z',color)+l('M-4 -6 Q0 -9 4 -5','#f1d1ac',1.5);
const root=(color,top=C.green)=>p('M-14 -10 Q0 -17 14 -10 L9 17 Q1 27 -7 16Z',color)+leaf(-4,-11,.55,top)+leaf(6,-10,.55,top);
const round=(color,top=true)=>c(0,3,20,color)+(top?leaf(2,-15,.55):'')+l('M-12 -5 Q-6 -14 2 -14','#fff6df',1.8);
const floret=()=>p('M-4 2 L-4 21 L6 21 L5 1Z','#8bb270')+c(-12,-3,10,C.darkGreen)+c(0,-12,13,C.green)+c(13,-3,10,C.darkGreen)+l('M-16 -4 Q-4 -17 8 -8','#badcaa',1.5);
const bottle=(fill,label=C.green)=>p('M-12 -19 L12 -19 L12 -13 L17 -8 L17 21 Q0 25 -17 21 L-17 -8 L-12 -13Z',fill)+p('M-13 0 L13 0 L13 14 L-13 14Z',label)+p('M-12 -23 L12 -23 L12 -17 L-12 -17Z',C.ink);
const jar=(fill,label=C.cream)=>p('M-18 -14 L18 -14 L16 20 Q0 24 -16 20Z',fill)+p('M-19 -22 L19 -22 L19 -14 L-19 -14Z',C.darkGreen)+p('M-14 -3 L14 -3 L14 13 L-14 13Z',label);
const bowl=(fill=C.cream)=>e(0,7,27,8,fill)+p('M-27 7 Q-24 29 0 29 Q24 29 27 7Z',C.blue)+e(0,7,27,7,C.cream);
const grains=(color=C.cream,n=8)=>Array.from({length:n},(_,i)=>e(-16+(i%4)*10,-2+Math.floor(i/4)*8,4,2,color,`transform="rotate(${i%2?35:-30} ${-16+(i%4)*10} ${-2+Math.floor(i/4)*8})"`)).join('');
const herb=(color=C.green)=>l('M0 23 L0 -18',C.darkGreen,3)+[-1,1].map((a,i)=>leaf(a*7,-3-i*11,.58,color)).join('')+leaf(0,-19,.6,color);
const cheese=(color=C.yellow)=>p('M-23 13 L12 -16 L25 15 L-23 20Z',color)+c(0,6,3,'#dc9e45')+c(13,10,2.5,'#dc9e45');
const fish=(color=C.orange)=>p('M-24 0 Q-4 -18 18 -7 L27 -16 L25 0 L27 16 L18 7 Q-4 18 -24 0Z',color)+c(-10,-3,2,C.ink)+l('M-5 -11 Q3 0 -5 11','#f8dfb3',1.5);
const poultry=(color=C.orange)=>p('M-22 -2 Q-22 -19 -2 -19 Q17 -17 18 1 Q16 20 -5 20 Q-22 17 -22 -2Z',color)+l('M13 13 L25 23',C.cream,6)+c(26,24,4,C.cream)+l('M-13 -8 Q-3 -17 6 -8','#f7d2aa',2);
const slice=(color=C.cream)=>p('M-21 19 L-21 -4 Q-19 -22 0 -22 Q20 -22 21 -4 L21 19Z',C.brown)+p('M-17 15 L-17 -4 Q-16 -17 0 -17 Q16 -17 17 -4 L17 15Z',color);
const citrus=(color)=>c(0,1,21,color)+c(0,1,16,C.cream)+c(0,1,13,color)+l('M0 -12 L0 14 M-13 1 L13 1 M-9 -8 L9 10 M9 -8 L-9 10',C.cream,1.5);
const packet=(fill,mark)=>p('M-17 -22 L17 -22 L20 23 L-20 23Z',fill)+p('M-13 -9 L13 -9 L13 13 L-13 13Z',C.white)+mark;

export const INGREDIENT_ART={
 chicken:poultry(),beef:p('M-22 -8 Q-9 -22 14 -17 Q28 -4 17 18 Q-2 26 -22 10Z',C.red)+l('M-13 -4 Q1 -14 13 -8 M-9 6 Q6 -2 15 6','#f2aa8c',2),
 pork:p('M-23 -7 Q-8 -21 14 -15 Q25 -1 17 16 Q-5 25 -22 10Z','#dca48d')+l('M-14 -2 Q0 -12 12 -5','#fff0dd',3),
 bacon:Array.from({length:3},(_,i)=>g(-15+i*10,-i*2,.8,p('M-7 -20 Q-13 -10 -7 0 Q0 10 -5 21 L5 21 Q11 10 5 0 Q0 -10 7 -20Z',C.red)+l('M0 -17 Q-5 -8 0 0 Q5 8 0 18','#ffd6b4',4))).join(''),
 ham:p('M-22 -5 Q-15 -22 11 -18 Q28 -10 22 10 Q12 24 -10 20 Q-26 11 -22 -5Z','#d98e7f')+e(1,2,8,7,C.cream),
 turkey:poultry('#d19b68')+l('M-10 -6 L1 8 M3 -11 L12 3','#f6dfb9',2),salmon:fish('#e9966e')+l('M-12 -12 L-4 12 M1 -14 L8 11','#ffd5b1',2),tuna:fish('#8da6a0')+l('M-15 -8 L-3 8 M0 -10 L11 6','#d8e6da',2),shrimp:p('M-17 -16 Q15 -22 21 1 Q22 20 -7 19 L-15 11 Q6 12 8 0 Q5 -10 -11 -6Z','#e99b77')+c(-11,-10,2,C.ink)+l('M-3 -12 L1 14 M7 -9 L9 9','#fff1d9',1.6),
 eggs:e(-10,3,12,18,C.cream)+e(12,5,12,18,'#f4e2bf')+l('M-15 -6 Q-11 -11 -6 -7','#fff',2),tofu:p('M-21 -10 L3 -22 L23 -11 L23 14 L-1 24 L-21 12Z',C.cream)+p('M-21 -10 L-1 0 L23 -11',C.white)+l('M-1 0 L-1 23',C.line,1.5),
 sausage:p('M-22 -5 Q-22 -20 -10 -20 Q-2 -20 2 -12 L17 7 Q23 14 16 21 Q9 27 1 20Z',C.brown)+l('M-17 -9 Q-12 -15 -7 -10','#edb27c',2),
 tomato:round(C.red),onion:p('M0 -23 Q19 -6 20 6 Q19 24 0 25 Q-19 24 -20 6 Q-19 -6 0 -23Z','#e4bf9a')+l('M0 -21 Q-3 0 0 23 M0 -21 Q14 0 9 21 M0 -21 Q-14 0 -9 21','#c99475',1.5),
 garlic:p('M0 -22 Q5 -11 14 -9 Q24 1 17 18 Q7 27 0 21 Q-7 27 -17 18 Q-24 1 -14 -9 Q-5 -11 0 -22Z',C.cream)+l('M0 -21 L0 23 M-12 -6 Q-7 3 -10 19 M12 -6 Q7 3 10 19','#d4c9a9',1.5),
 broccoli:floret(),carrot:p('M-13 -15 Q0 -20 13 -15 L3 23 Q-1 28 -5 21Z',C.orange)+leaf(-3,-15,.6)+leaf(7,-13,.5)+l('M-10 -5 L3 -3 M-7 5 L5 7','#c9813f',1.5),
 bell_pepper:p('M-18 -11 Q-9 -21 -2 -14 Q4 -21 15 -12 Q24 -3 18 15 Q14 25 3 18 Q-3 25 -10 19 Q-23 25 -22 5Z',C.red)+l('M0 -14 L2 -23',C.darkGreen,4)+l('M-9 -11 Q-16 5 -8 17 M8 -11 Q16 5 9 17','#f7ac78',1.5),
 mushroom:p('M-24 1 Q-19 -22 0 -22 Q19 -22 24 1Z',C.brown)+p('M-8 1 L8 1 L6 23 L-6 23Z',C.cream)+c(-9,-7,3,'#ebcf9b')+c(9,-10,2,'#ebcf9b'),
 spinach:leaf(1,20,1.25,C.darkGreen)+leaf(-8,17,.75,C.green),lettuce:leaf(-9,21,1.08,'#7ebc79')+leaf(8,21,1.08,C.green)+leaf(0,23,.75,'#a2ca83'),
 cucumber:p('M-24 1 Q-22 -11 -11 -17 Q15 -25 24 -5 Q27 9 12 16 Q-13 24 -24 1Z',C.darkGreen)+e(0,0,18,12,'#b7d99b')+e(0,0,7,5,C.cream),
 potato:round('#be8c62',false)+c(-8,-6,1.5,C.darkBrown)+c(8,9,1.5,C.darkBrown)+c(10,-8,1.3,C.darkBrown),sweet_potato:root('#c77951',C.green),
 zucchini:p('M-23 -7 Q-17 -20 16 -18 Q26 -14 23 8 Q18 20 -18 19 Q-28 11 -23 -7Z',C.darkGreen)+l('M-14 -12 Q-20 2 -13 13','#a7d29c',2),
 cabbage:round('#abd18b',false)+l('M-18 3 Q-1 -16 17 3 M-14 14 Q0 -7 14 14 M0 -16 Q-9 1 0 19','#7aa866',1.6),
 peas:p('M-24 6 Q-11 -10 22 -11 Q25 7 12 16 Q-10 22 -24 6Z',C.green)+[-12,0,12].map(x=>c(x,4,5,'#a6ce77')).join(''),
 corn:p('M-12 -22 Q0 -28 12 -22 L15 12 Q7 26 -5 22 Q-16 17 -12 -22Z',C.yellow)+Array.from({length:12},(_,i)=>c(-6+(i%3)*6,-16+Math.floor(i/3)*9,2.5,'#f8dd75')).join('')+leaf(-10,21,.55,C.darkGreen),
 green_beans:[-14,0,14].map((x,i)=>g(x,0,1,l('M-4 -20 Q7 -7 -4 18',i===1?C.darkGreen:C.green,7))).join(''),
 celery:Array.from({length:3},(_,i)=>g(-12+i*12,2,.7,p('M-4 -23 L4 -23 L8 24 L-8 24Z','#a5c878')+leaf(0,-18,.6,C.green))).join(''),
 rice:bowl()+grains(C.white,8),pasta:bowl()+Array.from({length:4},(_,i)=>l(`M${-20+i*11} 6 Q${-15+i*11} -13 ${-6+i*11} 5`,C.yellow,4)).join(''),
 noodles:bowl()+Array.from({length:5},(_,i)=>l(`M${-22+i*10} 9 Q${-18+i*9} -13 ${-7+i*9} 3`, '#e2b868',2.8)).join(''),
 bread:slice(),tortilla:e(0,3,24,19,'#e6bd78')+e(0,3,20,15,C.cream)+c(-11,0,1.4,C.brown)+c(8,8,1.4,C.brown),
 flour:packet('#e5d5b4',l('M-8 4 Q0 -4 8 4 M-8 9 Q0 1 8 9',C.brown,2)),oats:bowl('#e5d6b7')+grains('#c19a65',10),
 quinoa:bowl('#e8d1a2')+Array.from({length:16},(_,i)=>c(-18+(i%5)*9,-4+Math.floor(i/5)*5,1.7,i%2?C.brown:C.cream)).join(''),
 couscous:bowl('#e6c88e')+Array.from({length:19},(_,i)=>c(-20+(i%6)*8,-5+Math.floor(i/6)*6,1.5,'#d9b16c')).join(''),
 breadcrumbs:packet('#dbb979',grains(C.brown,6)),pizza_dough:e(0,7,26,13,'#d7a56c')+e(0,3,24,11,'#edcf97')+l('M-13 -2 Q0 -10 13 -2','#f8e7c0',2),
 rice_noodles:bowl()+Array.from({length:5},(_,i)=>l(`M${-22+i*10} 9 Q${-18+i*9} -13 ${-7+i*9} 3`,C.white,3)).join(''),
 cheese:cheese(),mozzarella:c(-8,3,16,C.cream)+c(13,7,13,C.white)+l('M-18 -3 Q-10 -12 -2 -6','#e8ddbd',1.5),
 parmesan:cheese('#e9d798')+Array.from({length:4},(_,i)=>c(-8+i*6,12-i*3,1.2,C.brown)).join(''),
 milk:packet(C.cream,p('M-9 -2 L9 -2 L9 13 L-9 13Z',C.blue)+p('M0 0 Q8 8 0 11 Q-8 8 0 0Z',C.white)),
 cream:packet(C.blue,p('M-9 -2 L9 -2 L9 13 L-9 13Z',C.cream)+l('M-6 8 Q0 -1 6 8',C.brown,2)),
 butter:p('M-23 -4 L15 -10 L25 2 L-13 9Z',C.yellow)+p('M-13 9 L25 2 L25 16 L-13 22Z','#d9aa54')+l('M-23 -4 L-13 9 L-13 22',C.line,1.5),
 yogurt:jar(C.white,C.blue)+l('M-8 5 Q0 -1 8 5',C.white,2),cream_cheese:jar('#e8eee2',C.cream)+l('M-9 6 Q0 -2 9 6',C.green,2),
 sour_cream:jar(C.cream,'#f4f4ec')+e(0,5,8,3,C.white),
 black_beans:g(-11,-5,.9,bean())+g(11,-3,.9,bean())+g(0,15,.8,bean()),
 kidney_beans:g(-11,-5,.9,bean('#a7574b'))+g(11,-3,.9,bean('#a7574b'))+g(0,15,.8,bean('#a7574b')),
 chickpeas:[[-12,-5],[8,-8],[-2,12],[17,11]].map(([x,y])=>g(x,y,.7,c(0,0,10,'#d6b17c')+c(-3,-3,2,C.cream))).join(''),
 lentils:bowl('#b98c5f')+Array.from({length:15},(_,i)=>e(-19+(i%5)*9,-5+Math.floor(i/5)*6,3,2,i%2?'#a47850':'#d3aa67')).join(''),
 peanut_butter:jar(C.brown,'#e8c58c')+p('M-5 2 Q7 -2 5 8 Q0 13 -5 8Z',C.brown),
 peanuts:g(-10,0,1,p('M-8 -13 Q0 -20 7 -11 Q12 -4 6 1 Q12 9 4 16 Q-5 18 -8 10 Q-15 3 -8 -2 Q-14 -9 -8 -13Z','#c89560'))+g(13,5,.7,bean('#c89560')),
 almonds:[[-13,-4],[7,-8],[2,12]].map(([x,y],i)=>g(x,y,.8,p('M0 -15 Q12 -4 7 11 Q0 18 -7 11 Q-12 -4 0 -15Z','#ad7754')+l('M0 -9 L0 9','#dcad7b',1))).join(''),
 apple:round(C.red)+p('M0 -17 L2 -25',C.darkBrown)+leaf(8,-18,.45),banana:p('M-22 -11 Q-6 17 21 1 Q17 21 -3 22 Q-22 19 -22 -11Z',C.yellow)+l('M-18 -10 Q-4 15 17 3','#e6a83e',2),
 strawberry:p('M-20 -8 Q-13 -19 0 -13 Q13 -19 20 -8 Q18 10 0 24 Q-18 10 -20 -8Z',C.red)+leaf(-3,-13,.55)+leaf(7,-13,.5)+[-12,0,10].map((x,i)=>c(x,i*7,1.5,C.cream)).join(''),
 blueberry:[[-12,-7],[9,-9],[-5,12],[14,9]].map(([x,y])=>g(x,y,.75,c(0,0,11,'#5e719f')+p('M-4 -8 L0 -4 L4 -8',C.blue))).join(''),
 lemon:citrus(C.yellow),lime:citrus('#8fbe6e'),avocado:p('M0 -23 Q18 -21 21 5 Q21 24 0 25 Q-21 24 -21 5 Q-18 -21 0 -23Z',C.darkGreen)+p('M0 -17 Q15 -16 15 5 Q15 18 0 19 Q-15 18 -15 5 Q-15 -16 0 -17Z','#c4d789')+c(0,6,8,C.brown),
 pineapple:p('M-16 -9 Q0 -16 16 -9 L13 21 L-13 21Z',C.yellow)+Array.from({length:4},(_,i)=>l(`M-14 ${-5+i*7} L14 ${10+i*3}`,'#ce963f',1.5)).join('')+leaf(0,-10,.7,C.darkGreen)+leaf(10,-9,.6,C.green),
 mango:p('M-17 -17 Q6 -26 20 -7 Q26 10 6 22 Q-17 28 -23 10 Q-25 -4 -17 -17Z',C.orange)+leaf(2,-17,.55),orange:citrus(C.orange),
 olive_oil:bottle('#b8c58a',C.yellow)+p('M-7 3 Q0 -7 7 3 Q5 10 0 11 Q-5 10 -7 3Z',C.darkGreen),
 soy_sauce:bottle('#70523e',C.cream)+l('M-7 6 L7 6',C.brown,2),tomato_sauce:jar(C.red,C.cream)+c(0,5,6,C.red),
 coconut_milk:packet(C.blue,p('M-9 -2 L9 -2 L9 13 L-9 13Z',C.cream)+c(0,5,5,C.white)),
 honey:jar(C.yellow,C.cream)+p('M-4 0 Q4 -3 5 6 Q5 12 0 13 Q-5 11 -4 0Z',C.orange),
 sugar:packet(C.cream,Array.from({length:5},(_,i)=>c(-8+(i%3)*7,2+Math.floor(i/3)*7,1.5,C.blue)).join('')),
 salt:packet(C.white,Array.from({length:5},(_,i)=>c(-8+(i%3)*7,2+Math.floor(i/3)*7,1.4,C.line)).join('')),
 black_pepper:jar(C.darkBrown,C.cream)+Array.from({length:5},(_,i)=>c(-7+(i%3)*7,2+Math.floor(i/3)*7,1.4,C.darkBrown)).join(''),
 chili_powder:jar(C.red,C.cream)+p('M-7 8 Q0 -4 7 8Z',C.red),cumin:jar(C.brown,C.cream)+grains(C.brown,5),paprika:jar('#cf7654',C.cream)+c(0,6,6,C.red),
 basil:herb(C.darkGreen),cilantro:herb('#79b976')+c(-10,-10,3,C.green)+c(8,-1,3,C.green),
 ginger:p('M-22 -2 L-8 -9 L-5 -22 L5 -18 L3 -6 L18 -12 L23 -2 L10 5 L15 18 L5 22 L-3 9 L-16 13Z','#cca16f')+l('M-15 0 L9 1','#ead0a6',2),
 curry_paste:jar(C.orange,C.cream)+p('M-7 9 Q0 -5 7 9Z',C.red),pepperoni:[[-11,-6],[10,-5],[0,13]].map(([x,y])=>g(x,y,.75,c(0,0,11,C.red)+c(-3,-2,2,C.cream)+c(4,3,1.5,C.cream))).join(''),
 white_fish:fish(C.cream)+l('M-10 -8 Q0 -12 10 -6',C.blue,2),cashews:[[-13,-5],[9,-6],[0,12]].map(([x,y])=>g(x,y,.8,p('M-9 -10 Q4 -17 10 -5 Q12 7 2 10 Q-8 9 -8 0 Q-2 5 3 1 Q7 -4 2 -7 Q-2 -8 -9 -10Z','#d6af77'))).join(''),
 pesto:jar(C.darkGreen,C.cream)+leaf(1,10,.46,C.green),mayonnaise:jar(C.cream,C.white)+l('M-8 6 Q0 -2 8 6',C.orange,2),sesame_oil:bottle('#d1aa60',C.cream)+grains(C.brown,4),bbq_sauce:bottle(C.darkBrown,'#d5a57e')+l('M-7 6 Q0 -2 7 6',C.red,2)
};
// Legacy daily boards retain their original data; only the visual aliases change.
export const LEGACY_INGREDIENT_ALIASES={egg:'eggs',pepper:'bell_pepper',beans:'black_beans',coconut:'coconut_milk',herbs:'basil'};
const ingredientCache=new Map();
export function ingredientArt(id,name=id,compact=false){const key=LEGACY_INGREDIENT_ALIASES[id]||id;const body=INGREDIENT_ART[key];if(!body)throw Error(`Clearline ingredient missing: ${id}`);const cacheKey=`${key}|${name}|${compact}`;if(ingredientCache.has(cacheKey))return ingredientCache.get(cacheKey);const svg=`<svg class="clearline-art ingredient-art" viewBox="${compact?'30 19 60 60':'0 0 120 100'}" role="img" aria-label="${escapeHtml(name)} illustration" xmlns="http://www.w3.org/2000/svg">${compact?'':'<circle cx="60" cy="49" r="39" fill="#eef5ee"/>'}<g transform="translate(60 49)" stroke="${C.line}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;ingredientCache.set(cacheKey,svg);return svg}
const escapeHtml=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');

// Each recipe is composed as a prepared dish, with a family-specific vessel or
// construction and ingredient-specific prepared toppings. IDs never map to a
// category glyph. Variant ingredient changes automatically alter the artwork.
const accents={chicken:C.orange,beef:C.darkBrown,pork:'#c88d76',bacon:C.red,ham:'#d98e7f',turkey:'#c89d70',salmon:'#e99073',tuna:'#9cb7ae',shrimp:'#eb987a',eggs:C.yellow,tofu:C.cream,sausage:C.brown,tomato:C.red,onion:'#d6b691',garlic:C.cream,broccoli:C.darkGreen,carrot:C.orange,bell_pepper:C.red,mushroom:C.brown,spinach:C.darkGreen,lettuce:C.green,cucumber:'#a7cd8c',potato:'#c99e69',sweet_potato:'#d48753',zucchini:C.darkGreen,cabbage:'#aacb8d',peas:C.green,corn:C.yellow,green_beans:C.green,celery:'#9cbf7c',rice:C.cream,pasta:C.yellow,noodles:'#dfbb77',bread:C.cream,tortilla:'#e9c585',flour:C.cream,oats:'#cfad7c',quinoa:'#d3b382',couscous:'#d5af73',breadcrumbs:C.brown,pizza_dough:'#eac894',rice_noodles:C.white,cheese:C.yellow,mozzarella:C.cream,parmesan:'#e8d296',milk:C.white,cream:C.cream,butter:C.yellow,yogurt:C.white,cream_cheese:C.cream,sour_cream:C.white,black_beans:C.darkBrown,kidney_beans:'#9b5046',chickpeas:'#d4af78',lentils:'#ad8257',peanut_butter:C.brown,peanuts:C.brown,almonds:C.brown,apple:C.red,banana:C.yellow,strawberry:C.red,blueberry:'#6377a1',lemon:C.yellow,lime:'#a6c776',avocado:C.darkGreen,pineapple:C.yellow,mango:C.orange,orange:C.orange,olive_oil:'#b5bc6b',soy_sauce:C.darkBrown,tomato_sauce:C.red,coconut_milk:C.white,honey:C.yellow,sugar:C.white,salt:C.white,black_pepper:C.darkBrown,chili_powder:C.red,cumin:C.brown,paprika:C.red,basil:C.green,cilantro:C.green,ginger:C.orange,curry_paste:C.red,pepperoni:C.red,white_fish:C.cream,cashews:'#d2aa72',pesto:C.darkGreen,mayonnaise:C.white,sesame_oil:C.yellow,bbq_sauce:C.darkBrown};
const prepared=(id,x,y,scale=1)=>{const key=LEGACY_INGREDIENT_ALIASES[id]||id;const color=accents[key];if(!color)throw Error(`Clearline recipe ingredient missing: ${id}`);let body;
 if(['rice','quinoa','couscous','oats','pasta','noodles','rice_noodles'].includes(key))body=Array.from({length:4},(_,i)=>e(-9+i*6,i%2?4:-3,3.5,2,color)).join('');
 else if(['broccoli','spinach','lettuce','basil','cilantro','cabbage','green_beans','celery','zucchini'].includes(key))body=leaf(0,9,.5,color)+leaf(6,5,.35,color);
 else if(['chicken','beef','pork','bacon','ham','turkey','salmon','tuna','shrimp','tofu','sausage','white_fish'].includes(key))body=p('M-11 -5 Q0 -12 10 -5 L9 7 Q0 12 -10 6Z',color)+l('M-6 -3 Q0 -7 5 -2','#f6d0aa',1.5);
 else if(['cheese','mozzarella','parmesan','cream_cheese'].includes(key))body=p('M-11 4 L8 -8 L12 7Z',color)+c(2,2,1.5,C.brown);
 else if(['black_beans','kidney_beans','chickpeas','lentils','peas','corn','peanuts','almonds','cashews'].includes(key))body=c(-5,0,4,color)+c(5,3,4,color);
 else if(['eggs'].includes(key))body=e(0,0,10,7,C.white)+c(0,0,4,C.yellow);
 else body=c(0,0,7,color)+l('M-4 -3 Q0 -6 3 -3','#f7e7bd',1.2);
 return g(x,y,scale,body)};
const dishKind=r=>{const n=r.name.toLowerCase(),id=r.id,f=r.family||r.category||'';
 if(/pizza|flatbread/.test(n))return 'pizza';if(/burger|sloppy joe/.test(n))return 'burger';if(/taco/.test(n))return 'taco';if(/burrito|wrap/.test(n))return 'wrap';if(/avocado toast/.test(n))return 'toast';if(/french toast/.test(n))return 'french_toast';if(/sandwich|toast|melt|sub|grilled cheese/.test(n))return 'sandwich';if(/loaded baked potato|chili cheese potato|stuffed sweet potato/.test(n))return 'potato';if(/baked salmon/.test(n))return 'plate';if(/soup|stew|ramen|chili/.test(n))return 'soup';if(/bake|casserole|lasagna|gratin|pie|ziti/.test(n))return 'bake';if(/pancake/.test(n))return 'pancake';if(/oatmeal/.test(n))return 'oatmeal';if(/omelet|frittata/.test(n))return 'omelet';if(/muffin/.test(n))return 'muffin';if(/scrambled/.test(n))return 'scramble';if(/salad/.test(n))return 'salad';if(/nachos/.test(n))return 'nachos';if(/quesadilla/.test(n))return 'quesadilla';if(/pasta|spaghetti|mac|noodle|scampi|lo mein|chow mein|pad thai/.test(n))return 'pasta';if(/stir.fry|skillet|hash|fritter|fajita|sausage and peppers|sweet chili chicken/.test(n))return 'skillet';if(/stuffed pepper/.test(n))return 'stuffed';if(/potato/.test(n))return 'potato';if(/rice|risotto|bowl|biryani|curry|falafel/.test(n))return 'bowl';if(f.includes('seafood'))return 'plate';return 'bowl'};
const vessels={
 bowl:()=>p('M19 52 Q60 68 101 52 L95 74 Q60 92 25 74Z',C.blue)+e(60,51,41,14,'#8fb7ad')+e(60,49,35,10,C.cream),
 soup:()=>p('M21 51 Q60 67 99 51 L93 75 Q60 90 27 75Z',C.blue)+e(60,49,39,14,'#89b7ad')+e(60,48,34,10,'#e6bd79')+l('M42 29 Q37 22 43 17 M60 27 Q55 19 61 14 M78 29 Q73 22 79 17','#a2bfb1',1.5),
 bake:()=>p('M17 41 L103 41 L101 78 Q60 88 19 78Z',C.blue)+p('M22 44 L98 44 L96 73 Q60 80 24 73Z','#e6b660')+p('M17 54 L10 54 L10 67 L19 67 M102 54 L110 54 L110 67 L101 67',C.blue)+l('M31 49 Q60 41 89 49','#fff0b7',3),
 skillet:()=>p('M17 53 Q60 75 103 53 L96 75 Q60 91 24 75Z',C.ink)+e(60,51,43,15,C.line)+e(60,49,37,10,'#e7c58d')+p('M101 58 L119 62 L118 70 L99 64Z',C.ink),
 salad:()=>p('M18 52 Q60 68 102 52 L95 76 Q60 89 25 76Z',C.blue)+e(60,49,42,14,'#a6c5a6')+e(60,48,36,10,'#8dbb82')+leaf(45,51,.55)+leaf(68,52,.55),
 plate:()=>e(60,67,47,18,'#d2dfd1')+e(60,63,42,15,C.white),
 pizza:()=>e(60,54,43,25,C.brown)+e(60,51,39,21,'#efc477')+e(60,50,34,17,C.red)+l('M60 31 L60 73 M28 51 L92 51 M36 39 L84 63 M84 39 L36 63','#f7df9b',2),
 burger:()=>p('M24 46 Q25 18 60 18 Q95 18 96 46Z','#e5b672')+l('M33 37 Q60 22 87 37','#f7dcaa',2)+p('M24 49 Q60 44 96 49 L94 56 Q60 60 26 56Z',C.green)+p('M24 57 Q60 54 96 57 L94 67 Q60 70 26 67Z',C.brown)+p('M27 70 Q60 74 93 70 L91 80 Q60 87 29 80Z','#d19a5c'),
 sandwich:()=>p('M16 73 L43 30 L69 73Z M52 73 L79 30 L106 73Z',C.brown)+p('M23 66 L43 40 L62 66Z M59 66 L79 40 L99 66Z',C.cream)+l('M24 67 Q43 60 62 67 M60 67 Q79 60 99 67',C.green,4),
 taco:()=>[33,73].map(x=>g(x,0,1,p('M-23 68 Q-22 31 0 27 Q22 31 23 68Z','#e6b56c')+p('M-18 62 Q-15 39 0 36 Q15 39 18 62Z',C.darkBrown)+l('M-17 50 Q0 42 17 50',C.green,5))).join(''),
 wrap:()=>p('M18 63 L64 24 L99 58 L60 80Z','#e6c68e')+p('M60 80 L99 58 L94 67 L66 86Z',C.brown)+p('M65 28 Q82 36 93 55 L70 51Z',C.green),
 quesadilla:()=>p('M17 67 Q60 23 103 67 L60 79Z','#e4b779')+p('M27 64 Q60 36 93 64 L60 71Z',C.yellow)+l('M60 39 L60 75',C.brown,2),
 nachos:()=>e(60,68,45,16,'#d1dfd2')+[35,53,71,88].map((x,i)=>p(`M${x-13} ${60-i%2*8} L${x+12} ${51-i%2*8} L${x+3} ${72-i%2*7}Z`,'#e4ba72')).join('')+l('M31 56 Q60 45 89 60',C.yellow,4),
 pasta:()=>e(60,65,46,19,'#d0dfd2')+e(60,62,41,15,C.white)+Array.from({length:6},(_,i)=>l(`M${36+i*9} 61 Q${42+i*7} 41 ${52+i*5} 61`,C.yellow,4)).join(''),
 breakfast:()=>e(60,65,46,19,'#d0dfd2')+e(60,62,41,15,C.white)+e(60,54,25,13,C.cream)+c(60,54,9,C.yellow),
 pancake:()=>e(60,67,45,17,'#d0dfd2')+e(60,65,39,13,C.white)+e(60,61,27,10,'#d8a76a')+e(60,55,27,10,'#edc381')+e(60,49,27,10,'#f2d295')+p('M56 42 L67 42 L66 50 L58 52Z',C.yellow)+l('M68 45 Q78 50 69 60',C.brown,3),
 french_toast:()=>e(60,67,45,17,'#d0dfd2')+e(60,64,40,14,C.white)+g(44,53,.65,slice('#e9bd7d'))+g(75,56,.65,slice('#dfaf70'))+l('M38 52 Q60 42 82 55',C.brown,2),
 toast:()=>e(60,69,45,16,'#d0dfd2')+g(60,51,1.17,slice())+p('M39 53 Q51 38 63 52 Q75 38 84 53 L79 64 Q61 58 43 64Z','#91b878')+c(61,52,8,C.brown),
 oatmeal:()=>p('M20 52 Q60 68 100 52 L94 75 Q60 89 26 75Z',C.blue)+e(60,49,40,13,'#adc5ad')+e(60,48,34,9,'#d0ad7a')+l('M40 48 Q60 40 80 49','#e9d3a7',2),
 omelet:()=>e(60,66,45,17,'#d0dfd2')+e(60,63,41,14,C.white)+p('M26 60 Q32 35 62 39 Q85 42 93 61 Q65 74 26 60Z',C.yellow)+l('M39 55 Q60 42 81 57','#f8e7a3',2),
 scramble:()=>e(60,67,45,17,'#d0dfd2')+e(60,64,41,14,C.white)+[38,51,65,78].map((x,i)=>p(`M${x-11} ${59-i%2*6} Q${x} ${43-i%2*5} ${x+10} ${58-i%2*6} Q${x+4} ${69-i%2*5} ${x-11} ${59-i%2*6}Z`,C.yellow)).join(''),
 muffin:()=>e(60,70,45,14,'#d0dfd2')+[41,78].map(x=>p(`M${x-12} 52 Q${x-13} 34 ${x} 34 Q${x+14} 34 ${x+12} 52 L${x+9} 69 L${x-9} 69Z`,'#e3ba72')).join(''),
 stuffed:()=>e(60,69,45,15,'#d0dfd2')+[42,77].map(x=>p(`M${x-15} 45 Q${x-13} 29 ${x} 29 Q${x+15} 29 ${x+15} 45 L${x+11} 70 L${x-11} 70Z`,C.red)+e(x,43,12,5,C.cream)).join(''),
 potato:()=>e(60,65,45,18,'#d1dfd1')+p('M28 63 Q30 33 60 34 Q90 33 93 63 Q60 82 28 63Z',C.brown)+p('M34 58 Q60 45 86 58 L77 66 Q60 61 43 66Z',C.cream)
};
const positions={bowl:[[43,46],[72,45],[58,54],[82,54],[34,55]],soup:[[43,46],[70,46],[57,52],[81,51],[34,51]],bake:[[40,53],[75,54],[57,62],[86,64],[29,65]],skillet:[[41,46],[73,47],[57,55],[82,55],[35,55]],salad:[[42,46],[71,44],[58,55],[83,52],[31,52]],plate:[[42,55],[71,54],[58,63],[83,62],[31,62]],pizza:[[42,45],[70,42],[58,55],[80,59],[37,60]],burger:[[38,57],[72,57],[58,62],[84,63],[30,62]],sandwich:[[42,57],[79,56],[55,64],[90,63],[31,63]],taco:[[29,49],[73,47],[43,56],[87,56],[20,57]],wrap:[[67,43],[77,49],[83,56],[61,56],[69,63]],quesadilla:[[42,59],[68,55],[58,63],[81,63],[30,64]],pasta:[[43,55],[72,54],[58,63],[83,61],[32,60]],breakfast:[[38,62],[78,61],[58,51],[86,54],[29,54]],potato:[[43,55],[72,55],[59,62],[82,63],[34,63]]};
for(const kind of ['pancake','french_toast','toast','oatmeal','omelet','scramble','muffin','stuffed','nachos'])positions[kind]=positions.breakfast;
function preparationMarks(recipe,kind){const n=recipe.name.toLowerCase(),ids=Object.keys(recipe.ingredients);let marks='';
 if(kind==='burger'){const patty=ids.includes('chicken')?C.orange:ids.includes('turkey')?'#c89d70':ids.includes('black_beans')||n.includes('veggie')?C.darkGreen:C.darkBrown;marks+=p('M27 56 Q60 53 93 56 L92 65 Q60 68 28 65Z',patty);if(n.includes('cheese'))marks+=p('M34 54 L85 54 L75 60 L60 57 L48 61Z',C.yellow)}
 if(n.includes('shawarma'))marks+=l('M65 45 L82 51 M62 49 L78 55',C.brown,2)+l('M31 50 Q44 44 57 50',C.white,3);
 if(n.includes('greek'))marks+=p('M35 45 L45 42 L47 49 L37 52Z M74 47 L84 44 L86 51 L76 54Z',C.cream)+c(58,47,3,C.darkGreen);
 if(n.includes('biryani'))marks+=l('M35 48 Q55 39 85 49',C.orange,3)+g(60,49,.6,grains(C.yellow,5));
 if(n.includes('burrito bowl'))marks+=l('M59 39 L59 59 M39 45 L52 52 M68 52 L84 44',C.white,2);
 if(n.includes('fried rice'))marks+=c(82,49,5,C.yellow)+l('M33 45 Q58 38 80 44',C.brown,2);
 if(n.includes('risotto'))marks+=l('M35 48 Q60 39 86 49',C.white,3);
 if(n.includes('curry'))marks+=p('M35 50 Q60 37 86 50 Q64 59 35 50Z',n.includes('red')?C.red:C.orange);
 if(kind==='pasta'){if(/tomato|bolognese|ragu|ziti/.test(n))marks+=l('M38 53 Q60 45 82 56',C.red,5);else if(/pesto|spinach/.test(n))marks+=l('M38 53 Q60 45 82 56',C.darkGreen,5);else if(/alfredo|creamy|cheese/.test(n))marks+=l('M38 53 Q60 45 82 56',C.cream,5)}
 if(n.includes('caesar'))marks+=l('M37 51 Q60 45 83 51',C.cream,4);
 if(n.includes('southwest'))marks+=c(56,47,4,C.yellow)+c(68,50,4,C.darkBrown);
 if(n.includes('pepperoni pizza'))marks+=c(44,43,5,C.red)+c(70,48,5,C.red)+c(58,59,5,C.red);
 if(n.includes('veggie pizza'))marks+=leaf(43,48,.4,C.darkGreen)+leaf(74,49,.4,C.green)+c(59,58,4,C.orange);
 return marks}
const recipeCache=new Map();
export function recipeArt(recipe){if(!recipe?.id||!recipe?.name||!recipe?.ingredients)throw Error('Clearline recipe requires id, name, and ingredients');const cacheKey=`${recipe.id}|${recipe.name}|${JSON.stringify(recipe.ingredients)}`;if(recipeCache.has(cacheKey))return recipeCache.get(cacheKey);const kind=dishKind(recipe),ids=Object.keys(recipe.ingredients).filter(id=>!['salt','black_pepper','sugar','olive_oil','sesame_oil','soy_sauce'].includes(id));if(!ids.length)throw Error(`Clearline recipe has no visible components: ${recipe.id}`);const pos=positions[kind];const toppings=ids.slice(0,5).map((id,i)=>prepared(id,...pos[i],i<2?.9:.65)).join('');const svg=`<svg class="clearline-art dish-art dish-${kind}" viewBox="0 0 120 100" role="img" aria-label="${escapeHtml(recipe.name)} prepared dish illustration" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="51" r="46" fill="#eef5ee"/><g stroke="${C.line}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${vessels[kind]()}${preparationMarks(recipe,kind)}${toppings}</g></svg>`;recipeCache.set(cacheKey,svg);return svg}
export const recipeArtKind=dishKind;
