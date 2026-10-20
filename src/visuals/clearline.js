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
// Larger, silhouette-led drawings for ingredients that were confusable at 40px.
Object.assign(INGREDIENT_ART,{
 rice:p('M-22 10 Q0 -1 22 10 L19 20 Q0 27 -19 20Z',C.blue)+e(0,9,22,8,C.white)+[-13,-5,4,13].map((x,i)=>e(x,6+(i%2)*4,5,2.5,C.cream,`transform="rotate(${-20+i*14} ${x} ${6+(i%2)*4})"`)).join(''),
 quinoa:p('M-22 10 Q0 -1 22 10 L19 20 Q0 27 -19 20Z',C.blue)+e(0,9,22,8,'#d9bd86')+[-13,-5,4,13].map((x,i)=>c(x,6+(i%2)*5,3.4,i%2?'#8d6e4e':C.cream)+c(x+1,5+(i%2)*5,1.2,C.white)).join(''),
 couscous:p('M-22 10 Q0 -1 22 10 L19 20 Q0 27 -19 20Z',C.blue)+e(0,9,22,8,'#e6c78e')+Array.from({length:13},(_,i)=>c(-16+(i%5)*8,3+Math.floor(i/5)*5,2.3,i%3?'#d2a86a':C.cream)).join(''),
 milk:packet(C.white,p('M-13 -21 L2 -27 L17 -21 L17 22 L-17 22 L-17 -15Z',C.white)+p('M-17 -15 L-13 -21 L2 -27 L-2 -15Z',C.blue)+p('M-12 -4 L12 -4 L12 15 L-12 15Z',C.blue)+p('M0 -1 Q10 9 0 13 Q-10 9 0 -1Z',C.white)),
 cream:jar(C.cream,C.blue)+p('M-10 6 Q-4 -7 0 2 Q5 -5 10 6 Q3 15 -5 11Z',C.white)+l('M-11 17 L11 17',C.white,2),
 cheese:cheese(C.yellow)+c(-10,13,3,'#d4953b')+c(10,6,3,'#d4953b'),
 mozzarella:e(-8,7,14,13,C.white)+e(11,5,13,12,C.cream)+l('M-17 2 Q-8 -6 0 2 M4 1 Q11 -5 17 2','#d7d4b6',1.7),
 parmesan:cheese('#ebd996')+p('M13 -15 L23 -8 L21 15 L12 11Z','#d1b473')+Array.from({length:5},(_,i)=>c(-11+i*6,11-(i%2)*6,1.5,C.brown)).join(''),
 black_beans:[[-12,-5],[9,-7],[-3,13],[16,11]].map(([x,y])=>g(x,y,.68,bean('#4b3840'))).join(''),
 kidney_beans:[[-12,-5],[9,-7],[-3,13],[16,11]].map(([x,y])=>g(x,y,.7,bean('#a95149')+l('M-4 -6 Q2 -10 5 -3',C.cream,1.5))).join(''),
 chickpeas:[[-11,-8],[10,-8],[-3,11],[16,11]].map(([x,y])=>g(x,y,.73,c(0,0,9,'#d3ac74')+p('M-1 -8 Q5 -3 2 2 Q-2 3 -4 -1Z',C.cream))).join(''),
 lentils:p('M-22 10 Q0 -1 22 10 L19 20 Q0 27 -19 20Z',C.blue)+e(0,9,22,8,'#b88456')+Array.from({length:12},(_,i)=>e(-15+(i%5)*8,4+Math.floor(i/5)*5,3.3,2.2,i%2?'#8e6948':'#d1a36d')).join(''),
 tomato_sauce:jar(C.red,C.cream)+c(0,5,8,C.red)+leaf(3,-1,.25,C.darkGreen),
 pesto:jar(C.darkGreen,C.cream)+leaf(0,13,.55,C.darkGreen)+c(6,3,2,C.yellow),
 bbq_sauce:bottle(C.darkBrown,'#d59b73')+l('M-10 6 Q0 -1 10 6',C.red,3),
 curry_paste:jar(C.orange,C.cream)+p('M-11 10 Q0 -5 11 10Z',C.red)+l('M-6 8 Q0 2 6 8',C.yellow,1.5),
 broccoli:floret()+g(-13,-5,.38,floret()),
 spinach:leaf(-7,20,1,C.darkGreen)+leaf(12,18,.85,C.green)+l('M-8 19 L13 18',C.darkGreen,2),
 lettuce:leaf(-12,20,1,'#8fca7a')+leaf(11,21,1,C.green)+leaf(1,20,.82,'#b2d696'),
 cabbage:round('#a8cf8d',false)+l('M-18 4 Q-2 -15 17 3 M-16 13 Q-2 -4 15 11 M-3 -14 Q6 -1 0 20','#6c9d71',2),
 zucchini:p('M-23 -7 Q-17 -20 16 -18 Q26 -14 23 8 Q18 20 -18 19 Q-28 11 -23 -7Z',C.darkGreen)+l('M-16 -12 Q-21 1 -13 13 M-4 -15 Q0 0 -1 15','#a9ce89',2)
});
// Experimental 35-ingredient expansion. Each body has its own silhouette.
Object.assign(INGREDIENT_ART,{
 lamb:p('M-22 -9 Q-5 -23 17 -15 Q28 -3 15 18 Q-3 26 -23 9Z','#a94f4c')+p('M-14 -5 Q-2 -15 11 -9 L7 11 Q-4 19 -16 7Z','#d37d70')+l('M-9 1 Q2 -7 9 -2','#f3bd9d',2),
 tempeh:p('M-24 -13 L17 -17 L24 13 L-17 20Z','#d8b786')+p('M-19 -9 L14 -12 L18 10 L-13 15Z','#eddbad')+Array.from({length:9},(_,i)=>c(-12+i%3*11,-5+Math.floor(i/3)*7,2.5,i%2?C.brown:C.cream)).join(''),
 crab:p('M-15 -2 Q0 -15 15 -2 L11 15 Q0 24 -11 15Z',C.red)+c(-7,-4,3,C.white)+c(7,-4,3,C.white)+l('M-7 -4 L-9 -18 M7 -4 L9 -18 M-17 5 L-27 -4 M17 5 L27 -4',C.red,4)+p('M-26 -7 L-15 -13 L-16 -2Z M26 -7 L15 -13 L16 -2Z',C.orange),
 chorizo:p('M-23 -9 Q-15 -21 -4 -15 L20 7 Q26 14 17 20 Q9 25 3 17Z','#a6473a')+e(6,9,11,6,'#c65c42')+c(3,7,2,C.cream)+c(11,11,1.5,C.yellow),
 feta:p('M-23 12 L-10 -12 L17 -14 L24 12 L10 22Z',C.white)+p('M-23 12 L10 22 L10 8 L-10 -12Z','#e3dfca')+c(4,1,2,C.brown)+c(-5,9,1.5,C.brown)+l('M10 8 L24 12',C.line,1.5),
 ricotta:bowl(C.cream)+e(0,3,22,9,C.white)+Array.from({length:5},(_,i)=>c(-15+i*7,1+i%2*4,2.3,C.cream)).join(''),
 halloumi:[[-12,-4],[8,-8],[-1,11]].map(([x,y],i)=>g(x,y,.65,p('M-14 -9 L14 -9 L11 9 L-12 9Z',C.cream)+l('M-9 -4 L9 -4',i%2?C.brown:C.orange,2))).join(''),
 scallions:[-9,2,12].map((x,i)=>g(x,0,.75,l('M0 23 Q-3 1 2 -20',i%2?C.green:C.darkGreen,5)+l('M0 22 L1 8',C.white,3))).join(''),
 jalapeno:p('M-20 5 Q-22 -11 -8 -16 Q13 -23 23 -9 Q18 10 -7 18 Q-17 19 -20 5Z',C.darkGreen)+l('M14 -15 Q17 -25 24 -23',C.green,4)+l('M-12 -5 Q-5 -14 9 -12','#9ccf81',2),
 eggplant:p('M-18 -14 Q-4 -24 11 -15 Q28 -3 16 17 Q3 29 -14 16 Q-25 5 -18 -14Z',C.purple)+p('M-15 -16 Q0 -28 15 -17 L7 -11 L0 -18 L-6 -10Z',C.darkGreen)+l('M8 -16 L12 -24',C.green,3),
 cauliflower:p('M-5 6 L-6 22 L6 22 L5 5Z','#9fbe7f')+[-13,0,13].map((x,i)=>c(x,-4-(i===1?7:0),10,C.cream)+c(x+2,-9-(i===1?7:0),3,C.white)).join('')+leaf(-15,15,.45,C.green),
 kale:leaf(-10,20,1.1,C.darkGreen)+leaf(10,19,1.05,C.green)+l('M-8 18 Q-19 5 -10 -8 M11 18 Q22 2 12 -10','#c5dfab',2),
 asparagus:[-13,0,13].map((x,i)=>g(x,1,.8,p('M-3 -14 L3 -14 L4 23 L-4 23Z',C.green)+p('M-7 -13 L0 -24 L7 -13Z',C.darkGreen)+l('M-4 -5 L4 -5',C.cream,2))).join(''),
 edamame:p('M-25 6 Q-13 -12 20 -10 Q28 0 15 15 Q-4 25 -25 6Z',C.green)+[-12,0,12].map((x,i)=>c(x,3+i%2*3,6,'#a5d57a')).join('')+l('M-20 10 Q-2 19 17 12',C.darkGreen,2),
 arugula:herb(C.darkGreen)+[-13,13].map(x=>g(x,-7,.55,p('M-8 3 L-15 -8 L-6 -10 L-2 -20 L4 -10 L13 -10 L8 3Z',C.green))).join(''),
 olives:[[-12,-6],[10,-8],[-1,13]].map(([x,y],i)=>g(x,y,.72,e(0,0,10,8,i%2?C.darkGreen:C.purple)+c(1,0,3,C.red))).join(''),
 butternut_squash:p('M-8 -23 Q5 -26 10 -13 Q3 -4 13 0 Q25 7 18 20 Q3 30 -15 19 Q-25 9 -13 -1 Q-5 -8 -8 -23Z',C.orange)+l('M-2 -23 L2 -30',C.darkGreen,3)+l('M-9 12 Q2 22 13 14','#f4c078',2),
 bok_choy:p('M-11 22 L-4 -3 L4 -4 L12 22Z',C.cream)+leaf(-8,-1,.85,C.darkGreen)+leaf(8,-2,.85,C.green)+l('M-4 16 L4 16',C.line,1.5),
 bean_sprouts:[-13,-2,10].map((x,i)=>g(x,1,.8,l('M0 20 Q-7 0 4 -16',C.cream,3)+c(4,-16,4,i%2?C.yellow:C.green))).join(''),
 artichoke_hearts:p('M0 23 Q-22 12 -20 -4 Q-8 -18 0 -11 Q8 -18 20 -4 Q22 12 0 23Z',C.green)+p('M0 17 Q-13 8 -11 -3 Q0 -10 11 -3 Q13 8 0 17Z',C.cream)+[-1,1].map(side=>leaf(side*11,-7,.43,C.darkGreen)).join(''),
 dill:l('M0 23 L0 -21',C.darkGreen,2)+[-1,1].flatMap(side=>[0,1,2].map(i=>l(`M0 ${13-i*11} L${side*(12+i*2)} ${3-i*12}`,C.green,1.8))).join('')+c(0,-22,2,C.yellow),
 pita_bread:p('M-23 18 Q-25 -17 0 -22 Q25 -17 23 18Z','#d8a46b')+p('M-18 12 Q-16 -12 0 -15 Q16 -12 18 12Z',C.cream)+l('M-17 5 Q0 1 17 5',C.brown,2),
 gnocchi:[[-14,-5],[6,-9],[-5,11],[16,9]].map(([x,y])=>g(x,y,.66,p('M-13 -5 Q-12 -13 0 -13 Q13 -12 13 -3 Q11 10 -1 11 Q-13 9 -13 -5Z',C.cream)+l('M-8 -5 L8 -4 M-7 1 L7 2',C.brown,1.5))).join(''),
 orzo:bowl('#e8cf9b')+Array.from({length:13},(_,i)=>e(-17+i%5*8,-4+Math.floor(i/5)*6,3.5,1.6,C.yellow,`transform="rotate(25 ${-17+i%5*8} ${-4+Math.floor(i/5)*6})"`)).join(''),
 bulgur:bowl('#d7b37d')+Array.from({length:14},(_,i)=>p(`M${-19+i%5*8} ${-5+Math.floor(i/5)*6} l3 -2 l3 3 l-3 2Z`,i%2?C.brown:C.cream)).join(''),
 farro:bowl('#ae8059')+Array.from({length:11},(_,i)=>e(-17+i%4*10,-4+Math.floor(i/4)*6,4.2,2.3,i%2?'#8b6247':'#d3ac78')).join(''),
 cornmeal:packet('#e6c47a',p('M-12 -3 L12 -3 L12 13 L-12 13Z',C.cream)+Array.from({length:8},(_,i)=>c(-8+i%4*5,3+Math.floor(i/4)*5,1.3,C.yellow)).join('')),
 sesame_seeds:jar(C.cream,C.white)+Array.from({length:9},(_,i)=>e(-9+i%4*6,0+Math.floor(i/4)*5,2,1,C.brown)).join(''),
 rice_vinegar:bottle(C.white,C.blue)+l('M-9 6 L9 6 M-5 10 L5 10',C.white,2),
 mustard:jar(C.yellow,C.cream)+p('M-10 10 Q-8 -3 0 4 Q8 -4 10 10Z',C.yellow)+l('M-8 12 L8 12',C.brown,1.5),
 hot_sauce:bottle(C.red,C.cream)+p('M0 -1 Q11 8 0 13 Q-10 8 0 -1Z',C.red)+l('M-6 11 L6 11',C.orange,2),
 tahini:jar('#d1b88b',C.cream)+p('M-11 9 Q-2 -3 10 7 Q4 14 -9 13Z','#b69a70')+c(1,8,2,C.white),
 miso_paste:jar(C.brown,C.cream)+p('M-10 10 Q0 -4 10 10Z','#9b654e')+l('M-7 7 Q0 3 7 7',C.cream,1.5),
 vegetable_broth:packet(C.green,p('M-12 -3 L12 -3 L12 14 L-12 14Z',C.cream)+leaf(0,11,.38,C.darkGreen)),
 salsa:jar(C.red,C.cream)+c(-6,5,3,C.green)+c(5,2,3,C.orange)+c(6,9,2,C.yellow)
});
// Legacy daily boards retain their original data; only the visual aliases change.
export const LEGACY_INGREDIENT_ALIASES={egg:'eggs',pepper:'bell_pepper',beans:'black_beans',coconut:'coconut_milk',herbs:'basil'};
const ingredientCache=new Map();
export function ingredientArt(id,name=id,compact=false){const key=LEGACY_INGREDIENT_ALIASES[id]||id;const body=INGREDIENT_ART[key];if(!body)throw Error(`Clearline ingredient missing: ${id}`);const cacheKey=`${key}|${name}|${compact}`;if(ingredientCache.has(cacheKey))return ingredientCache.get(cacheKey);const svg=`<svg class="clearline-art ingredient-art" viewBox="${compact?'30 19 60 60':'20 9 80 80'}" role="img" aria-label="${escapeHtml(name)} illustration" xmlns="http://www.w3.org/2000/svg">${compact?'':'<circle cx="60" cy="49" r="39" fill="#eef5ee"/>'}<g transform="translate(60 49)" stroke="${C.line}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;ingredientCache.set(cacheKey,svg);return svg}
const escapeHtml=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');

// Each recipe is composed as a prepared dish, with a family-specific vessel or
// construction and ingredient-specific prepared toppings. IDs never map to a
// category glyph. Variant ingredient changes automatically alter the artwork.
const accents={chicken:C.orange,beef:C.darkBrown,pork:'#c88d76',bacon:C.red,ham:'#d98e7f',turkey:'#c89d70',salmon:'#e99073',tuna:'#9cb7ae',shrimp:'#eb987a',eggs:C.yellow,tofu:C.cream,sausage:C.brown,tomato:C.red,onion:'#d6b691',garlic:C.cream,broccoli:C.darkGreen,carrot:C.orange,bell_pepper:C.red,mushroom:C.brown,spinach:C.darkGreen,lettuce:C.green,cucumber:'#a7cd8c',potato:'#c99e69',sweet_potato:'#d48753',zucchini:C.darkGreen,cabbage:'#aacb8d',peas:C.green,corn:C.yellow,green_beans:C.green,celery:'#9cbf7c',rice:C.cream,pasta:C.yellow,noodles:'#dfbb77',bread:C.cream,tortilla:'#e9c585',flour:C.cream,oats:'#cfad7c',quinoa:'#d3b382',couscous:'#d5af73',breadcrumbs:C.brown,pizza_dough:'#eac894',rice_noodles:C.white,cheese:C.yellow,mozzarella:C.cream,parmesan:'#e8d296',milk:C.white,cream:C.cream,butter:C.yellow,yogurt:C.white,cream_cheese:C.cream,sour_cream:C.white,black_beans:C.darkBrown,kidney_beans:'#9b5046',chickpeas:'#d4af78',lentils:'#ad8257',peanut_butter:C.brown,peanuts:C.brown,almonds:C.brown,apple:C.red,banana:C.yellow,strawberry:C.red,blueberry:'#6377a1',lemon:C.yellow,lime:'#a6c776',avocado:C.darkGreen,pineapple:C.yellow,mango:C.orange,orange:C.orange,olive_oil:'#b5bc6b',soy_sauce:C.darkBrown,tomato_sauce:C.red,coconut_milk:C.white,honey:C.yellow,sugar:C.white,salt:C.white,black_pepper:C.darkBrown,chili_powder:C.red,cumin:C.brown,paprika:C.red,basil:C.green,cilantro:C.green,ginger:C.orange,curry_paste:C.red,pepperoni:C.red,white_fish:C.cream,cashews:'#d2aa72',pesto:C.darkGreen,mayonnaise:C.white,sesame_oil:C.yellow,bbq_sauce:C.darkBrown};
Object.assign(accents,{lamb:'#a94f4c',tempeh:'#c89d6d',crab:C.red,chorizo:'#a6473a',feta:C.white,ricotta:C.cream,halloumi:'#f1dfb2',scallions:C.green,jalapeno:C.darkGreen,eggplant:C.purple,cauliflower:C.cream,kale:C.darkGreen,asparagus:C.green,edamame:C.green,arugula:C.darkGreen,olives:C.purple,butternut_squash:C.orange,bok_choy:C.green,bean_sprouts:C.cream,artichoke_hearts:C.green,dill:C.green,pita_bread:'#e6c68e',gnocchi:C.cream,orzo:C.yellow,bulgur:'#d7b37d',farro:'#ae8059',cornmeal:C.yellow,sesame_seeds:C.cream,rice_vinegar:C.white,mustard:C.yellow,hot_sauce:C.red,tahini:'#d1b88b',miso_paste:C.brown,vegetable_broth:C.green,salsa:C.red});
const prepared=(id,x,y,scale=1)=>{const key=LEGACY_INGREDIENT_ALIASES[id]||id;const color=accents[key];if(!color)throw Error(`Clearline recipe ingredient missing: ${id}`);let body;
 if(key==='crab')body=p('M-10 1 Q0 -7 10 1 L5 7 L-5 7Z',C.red)+l('M-7 2 L-13 -5 M7 2 L13 -5',C.red,2);
 else if(key==='chorizo')body=e(0,0,11,7,'#a6473a')+c(-3,-2,2,C.cream)+c(4,2,1.5,C.orange);
 else if(key==='lamb')body=p('M-11 -5 Q1 -12 11 -3 L7 8 Q-2 10 -10 5Z','#a94f4c')+l('M-4 -4 L5 4','#e3a58a',2);
 else if(key==='tempeh'||key==='halloumi')body=p('M-10 -7 L8 -7 L11 6 L-8 7Z',color)+l('M-7 -2 L7 -2 M-6 3 L8 3',key==='halloumi'?C.brown:C.cream,1.6);
 else if(key==='shrimp')body=p('M-10 -8 Q10 -12 11 3 Q7 13 -6 7 L-11 3 Q4 5 4 0 Q2 -6 -7 -3Z',color)+c(-6,-5,1.5,C.ink);
 else if(['salmon','tuna','white_fish'].includes(key))body=p('M-11 -3 Q0 -11 11 -4 L8 6 Q0 10 -10 5Z',color)+l('M-5 -3 Q1 -6 6 -2','#f7dec2',1.5);
 else if(key==='tofu')body=p('M-9 -6 L5 -7 L10 3 L-4 7Z',C.cream)+l('M-9 -6 L-7 4 L-4 7',C.line,1.5);
 else if(key==='bacon')body=l('M-8 -8 Q-12 -2 -6 3 Q-2 8 -7 11 M2 -9 Q-3 -2 3 3 Q7 8 2 11',C.red,4)+l('M-8 -8 Q-12 -2 -6 3 M2 -9 Q-3 -2 3 3',C.cream,1.5);
 else if(key==='sausage')body=e(0,0,11,6,color)+e(0,0,5,3,'#d79b73');
 else if(key==='rice')body=Array.from({length:4},(_,i)=>e(-9+i*6,i%2?4:-3,4,2,C.cream)).join('');
 else if(['quinoa','couscous','oats','orzo','bulgur','farro','cornmeal'].includes(key))body=Array.from({length:7},(_,i)=>e(-8+i%4*5,-4+Math.floor(i/4)*6,key==='orzo'?3.4:2.1,1.7,color)).join('');
 else if(['pasta','noodles','rice_noodles','gnocchi'].includes(key))body=key==='gnocchi'?e(-4,0,5,3,C.cream)+e(5,2,5,3,C.cream):Array.from({length:3},(_,i)=>l(`M${-9+i*6} 7 Q${-5+i*5} -8 ${i*6} 5`,color,2.8)).join('');
 else if(['broccoli','spinach','lettuce','basil','cilantro','cabbage','green_beans','celery','zucchini','kale','arugula','bok_choy','scallions','dill','asparagus','artichoke_hearts'].includes(key))body=leaf(0,9,.5,color)+leaf(6,5,.35,color);
 else if(['chicken','beef','pork','bacon','ham','turkey','salmon','tuna','shrimp','tofu','sausage','white_fish'].includes(key))body=p('M-11 -5 Q0 -12 10 -5 L9 7 Q0 12 -10 6Z',color)+l('M-6 -3 Q0 -7 5 -2','#f6d0aa',1.5);
 else if(['cheese','mozzarella','parmesan','cream_cheese','feta','ricotta'].includes(key))body=p('M-11 4 L8 -8 L12 7Z',color)+c(2,2,1.5,C.brown);
 else if(['black_beans','kidney_beans','chickpeas','lentils','peas','corn','peanuts','almonds','cashews','edamame','olives','sesame_seeds'].includes(key))body=c(-5,0,4,color)+c(5,3,4,color);
 else if(['eggs'].includes(key))body=e(0,0,10,7,C.white)+c(0,0,4,C.yellow);
 else body=c(0,0,7,color)+l('M-4 -3 Q0 -6 3 -3','#f7e7bd',1.2);
 return g(x,y,scale,body)};
// Every approved V3 recipe has an intentional serving shape. This prevents a
// keyword (notably "burrito" in Burrito Bowl) from selecting the wrong vessel.
const presentationGroups={
 taco:'beef_tacos chicken_tacos black_bean_tacos shrimp_tacos',
 quesadilla:'chicken_quesadilla cheese_quesadilla mushroom_quesadilla',
 burrito:'beef_burrito bean_burrito breakfast_burrito',
 wrap:'chicken_wrap veggie_wrap',
 burrito_bowl:'burrito_bowl',
 fajitas:'chicken_fajitas',nachos:'nachos',
 pasta:'spaghetti_bolognese chicken_alfredo mac_and_cheese pesto_pasta tomato_basil_pasta mushroom_pasta shrimp_scampi creamy_spinach_pasta pasta_primavera garlic_fish_pasta',
 rice:'chicken_fried_rice egg_fried_rice shrimp_fried_rice beef_rice_bowl teriyaki_chicken_rice mushroom_risotto vegetable_rice_bowl chicken_biryani pineapple_fried_rice rice_and_beans salmon_rice_bowl',
 ramen:'chicken_ramen beef_ramen shrimp_noodle_bowl',
 noodles:'pad_thai beef_lo_mein vegetable_lo_mein chicken_chow_mein garlic_noodles sesame_noodles singapore_noodles',
 soup:'tomato_soup chicken_noodle_soup beef_stew vegetable_soup broccoli_cheddar_soup lentil_soup mushroom_soup chicken_curry_soup potato_soup minestrone',
 skillet:'beef_broccoli_stir_fry chicken_vegetable_stir_fry garlic_shrimp_stir_fry tofu_stir_fry mushroom_beef_stir_fry sweet_chili_chicken ginger_pork_stir_fry pepper_beef_stir_fry cashew_chicken breakfast_hash sausage_and_peppers garlic_butter_shrimp salmon_potato_skillet chickpea_stir_fry potato_and_egg_skillet broccoli_rice_skillet',
 sandwich:'grilled_cheese blt_sandwich turkey_sandwich ham_and_cheese chicken_sandwich tuna_melt egg_salad_sandwich breakfast_sandwich',
 sub:'meatball_sub',
 omelet:'cheese_omelet mushroom_omelet spinach_frittata',scramble:'scrambled_eggs',pancake:'pancakes',french_toast:'french_toast',oatmeal:'oatmeal_bowl',muffin:'egg_muffins',toast:'avocado_toast',
 salad:'caesar_salad greek_salad chicken_salad tuna_salad quinoa_salad chickpea_salad pasta_salad cucumber_tomato_salad spinach_salad southwest_salad shrimp_salad',
 bake:'chicken_casserole cheesy_bean_bake tuna_casserole potato_gratin broccoli_cheese_bake shepherds_pie baked_mac_and_cheese sausage_pasta_bake baked_ziti',
 lasagna:'lasagna vegetable_lasagna',
 pizza:'margherita_pizza pepperoni_pizza chicken_pizza veggie_pizza mushroom_pizza bbq_chicken_pizza spinach_flatbread cheese_flatbread breakfast_pizza tomato_garlic_flatbread',
 burger:'beef_burger cheeseburger chicken_burger turkey_burger veggie_burger sloppy_joe',
 potato:'loaded_baked_potato chili_cheese_potato stuffed_sweet_potato',
 fish:'baked_salmon lemon_salmon teriyaki_salmon',patties:'tuna_patties',
 curry:'shrimp_curry chicken_curry beef_curry chickpea_curry coconut_tofu_curry lentil_curry thai_red_curry vegetable_curry',
 grain_bowl:'chicken_shawarma_bowl falafel_bowl greek_chicken_bowl mediterranean_grain_bowl sweet_potato_bowl',
 stuffed:'stuffed_peppers',fritters:'zucchini_fritters'
};
export const RECIPE_PRESENTATIONS=Object.fromEntries(Object.entries(presentationGroups).flatMap(([kind,group])=>group.split(' ').map(id=>[id,kind])));
// Complete-dish serving shapes for the 75 experimental expansion recipes.
const expansionPresentations={
 taco:'fish_tacos cauliflower_tacos',tostada:'breakfast_tostadas',burrito:'chorizo_breakfast_burrito',
 grain_bowl:'shrimp_fajita_bowl coconut_shrimp_rice_bowl lamb_chickpea_bowl halloumi_bulgur_bowl tempeh_sesame_bowl warm_farro_vegetable_bowl',
 pasta:'lemon_ricotta_pasta sausage_kale_pasta eggplant_parmesan_pasta asparagus_orzo_primavera creamy_salmon_pasta gnocchi_with_spinach',
 rice:'miso_mushroom_rice_bowl ginger_salmon_rice edamame_rice_bowl chorizo_tomato_rice lemon_herb_rice',
 noodles:'miso_mushroom_noodles spicy_peanut_noodles shrimp_rice_noodle_stir_fry cold_sesame_noodle_salad',
 soup:'bok_choy_noodle_soup miso_tofu_soup kidney_bean_kale_soup roasted_cauliflower_soup orzo_vegetable_soup salmon_chowder',
 skillet:'sesame_beef_stir_fry bok_choy_chicken_stir_fry tempeh_pepper_stir_fry chili_garlic_shrimp ginger_tofu_edamame_stir_fry chorizo_potato_hash eggplant_chickpea_skillet',
 panini:'pesto_mozzarella_panini',sandwich:'turkey_avocado_club crab_salad_sandwich',wrap:'grilled_halloumi_wrap',pita:'mediterranean_pita_pocket',
 scramble:'feta_spinach_scramble',oatmeal:'savory_mushroom_oats',sweet_toast:'ricotta_berry_toast',shakshuka:'shakshuka',
 salad:'kale_apple_salad mediterranean_orzo_salad warm_farro_lentil_salad edamame_sesame_salad bulgur_chickpea_salad',
 bake:'mushroom_gnocchi_gratin cheesy_cauliflower_gratin creamy_chicken_orzo_bake salmon_asparagus_bake',boats:'stuffed_zucchini_boats',med_fish_bake:'mediterranean_fish_bake',
 pizza:'pesto_chicken_flatbread mediterranean_flatbread eggplant_pizza artichoke_spinach_flatbread arugula_parmesan_pizza',
 burger:'lamb_feta_burger spicy_black_bean_burger mushroom_cheeseburger halloumi_veggie_burger',sub:'chicken_parmesan_sub',
 crab_cakes:'crab_cakes',miso_salmon:'miso_glazed_salmon',grits:'shrimp_and_grits',
 curry:'butternut_squash_curry cauliflower_lentil_curry',polenta:'crispy_polenta_with_mushrooms',stuffed_mushroom:'stuffed_portobello_mushrooms'
};
Object.assign(RECIPE_PRESENTATIONS,Object.fromEntries(Object.entries(expansionPresentations).flatMap(([kind,group])=>group.split(' ').map(id=>[id,kind]))));
const dishKind=r=>{if(RECIPE_PRESENTATIONS[r.id])return RECIPE_PRESENTATIONS[r.id];const n=r.name.toLowerCase(),f=r.family||r.category||'';
 if(/pizza|flatbread/.test(n))return 'pizza';if(/burger|sloppy joe/.test(n))return 'burger';if(/taco/.test(n))return 'taco';if(/burrito|wrap/.test(n))return 'wrap';if(/avocado toast/.test(n))return 'toast';if(/french toast/.test(n))return 'french_toast';if(/sandwich|toast|melt|sub|grilled cheese/.test(n))return 'sandwich';if(/loaded baked potato|chili cheese potato|stuffed sweet potato/.test(n))return 'potato';if(/baked salmon/.test(n))return 'plate';if(/soup|stew|ramen|chili/.test(n))return 'soup';if(/bake|casserole|lasagna|gratin|pie|ziti/.test(n))return 'bake';if(/pancake/.test(n))return 'pancake';if(/oatmeal/.test(n))return 'oatmeal';if(/omelet|frittata/.test(n))return 'omelet';if(/muffin/.test(n))return 'muffin';if(/scrambled/.test(n))return 'scramble';if(/salad/.test(n))return 'salad';if(/nachos/.test(n))return 'nachos';if(/quesadilla/.test(n))return 'quesadilla';if(/pasta|spaghetti|mac|noodle|scampi|lo mein|chow mein|pad thai/.test(n))return 'pasta';if(/stir.fry|skillet|hash|fritter|fajita|sausage and peppers|sweet chili chicken/.test(n))return 'skillet';if(/stuffed pepper/.test(n))return 'stuffed';if(/potato/.test(n))return 'potato';if(/rice|risotto|bowl|biryani|curry|falafel/.test(n))return 'bowl';if(f.includes('seafood'))return 'plate';return 'bowl'};
const vessels={
 bowl:()=>p('M19 52 Q60 68 101 52 L95 74 Q60 92 25 74Z',C.blue)+e(60,51,41,14,'#8fb7ad')+e(60,49,35,10,C.cream),
 soup:()=>p('M21 51 Q60 67 99 51 L93 75 Q60 90 27 75Z',C.blue)+e(60,49,39,14,'#89b7ad')+e(60,48,34,10,'#e6bd79')+`<g class="steam-strokes">${l('M42 29 Q37 22 43 17 M60 27 Q55 19 61 14 M78 29 Q73 22 79 17','#a2bfb1',1.5)}</g>`,
 bake:()=>p('M17 41 L103 41 L101 78 Q60 88 19 78Z',C.blue)+p('M22 44 L98 44 L96 73 Q60 80 24 73Z','#e6b660')+p('M17 54 L10 54 L10 67 L19 67 M102 54 L110 54 L110 67 L101 67',C.blue)+l('M31 49 Q60 41 89 49','#fff0b7',3),
 skillet:()=>p('M17 53 Q60 75 103 53 L96 75 Q60 91 24 75Z',C.ink)+e(60,51,43,15,C.line)+e(60,49,37,10,'#e7c58d')+p('M101 58 L119 62 L118 70 L99 64Z',C.ink),
 salad:()=>p('M18 52 Q60 68 102 52 L95 76 Q60 89 25 76Z',C.blue)+e(60,49,42,14,'#a6c5a6')+e(60,48,36,10,'#8dbb82')+leaf(45,51,.55)+leaf(68,52,.55),
 plate:()=>e(60,67,47,18,'#d2dfd1')+e(60,63,42,15,C.white),
 pizza:()=>e(60,54,43,25,C.brown)+e(60,51,39,21,'#efc477')+e(60,50,34,17,C.red)+l('M60 31 L60 73 M28 51 L92 51 M36 39 L84 63 M84 39 L36 63','#f7df9b',2),
 burger:()=>p('M24 46 Q25 18 60 18 Q95 18 96 46Z','#e5b672')+l('M33 37 Q60 22 87 37','#f7dcaa',2)+p('M24 49 Q60 44 96 49 L94 56 Q60 60 26 56Z',C.green)+p('M24 57 Q60 54 96 57 L94 67 Q60 70 26 67Z',C.brown)+p('M27 70 Q60 74 93 70 L91 80 Q60 87 29 80Z','#d19a5c'),
 sandwich:()=>p('M16 73 L43 30 L69 73Z M52 73 L79 30 L106 73Z',C.brown)+p('M23 66 L43 40 L62 66Z M59 66 L79 40 L99 66Z',C.cream)+l('M24 67 Q43 60 62 67 M60 67 Q79 60 99 67',C.green,4),
 taco:()=>[33,73].map(x=>g(x,0,1,p('M-23 68 Q-22 31 0 27 Q22 31 23 68Z','#e6b56c')+p('M-18 62 Q-15 39 0 36 Q15 39 18 62Z',C.darkBrown)+l('M-17 50 Q0 42 17 50',C.green,5))).join(''),
 // Rolled, closed-ended tortilla with one visible cross-section.
 burrito:()=>e(60,78,46,9,'#d3e0d4')+p('M19 59 Q17 50 28 46 L80 31 Q95 27 101 39 L103 51 Q103 59 92 63 L41 77 Q29 80 23 71Z','#d5a365')+p('M25 56 Q26 51 35 48 L81 35 Q91 32 95 38 L45 70 Q33 74 27 68Z','#efd09a')+l('M36 51 Q32 60 42 69 M49 45 Q45 54 54 62','#d5a365',2)+e(93,46,10,14,'#c89258')+e(91,46,8,11,C.cream),
 // A cut wrap: the open top exposes filling, unlike the sealed burrito.
 wrap:()=>e(60,78,44,9,'#d3e0d4')+p('M29 71 L48 33 Q60 25 71 31 L98 71 Q64 79 29 71Z','#ddae73')+p('M36 68 L51 38 Q61 31 69 37 L89 68 Q66 73 36 68Z','#f1d49f')+e(60,34,13,7,C.cream)+p('M48 34 Q58 23 72 33 L70 39 Q59 34 50 39Z',C.green)+l('M43 57 Q60 62 79 57','#c58c5a',2),
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
Object.assign(vessels,{
 pizza:(recipe)=>{const flat=recipe.id.includes('flatbread'),ry=flat?20:26,sauce=recipe.id==='bbq_chicken_pizza'?C.darkBrown:recipe.id==='cheese_flatbread'||recipe.id==='spinach_flatbread'?C.cream:C.red;return e(60,54,44,ry,'#c8874d')+e(60,51,39,ry-4,'#edc584')+e(60,50,35,ry-8,sauce)+e(60,50,31,ry-11,recipe.id==='cheese_flatbread'?C.cream:'#e7b769')},
 sandwich:()=>e(60,76,48,11,'#d3e0d4')+p('M19 62 Q20 38 36 36 L84 36 Q101 39 101 62 L96 73 L24 73Z','#c78d58')+p('M25 57 Q25 42 39 42 L82 42 Q94 43 95 57Z',C.cream)+p('M24 58 L97 58 L93 63 L28 63Z',C.green)+p('M26 64 Q60 60 94 64 L91 69 Q60 72 29 69Z','#d88773')+l('M28 73 Q60 78 92 73','#ebc493',2),
 // Open cross-section, not a folded tortilla.
 burrito_bowl:()=>p('M17 51 Q60 69 103 51 L96 78 Q60 94 24 78Z',C.blue)+e(60,49,43,16,'#779f89')+e(60,46,37,12,C.cream)+p('M25 45 Q40 34 57 45 L52 55 Q39 57 25 45Z',C.cream)+p('M63 45 Q80 33 96 45 L90 54 Q75 57 63 45Z',C.darkBrown)+p('M52 47 Q61 38 69 47 L68 57 L53 57Z',C.red),
 // A long split roll with round meatballs and sauce, unlike triangular sandwiches.
 sub:()=>e(60,75,48,13,'#d3e0d4')+p('M14 59 Q17 38 40 37 L91 39 Q106 42 107 59 L96 75 L26 74Z','#d69f63')+p('M20 54 Q28 44 41 45 L92 46 Q98 47 101 55 L94 63 L27 62Z',C.cream)+p('M23 58 Q60 52 99 59 L96 67 Q61 70 25 66Z',C.red)+[38,59,81].map(x=>c(x,57,9,C.darkBrown)+c(x-3,54,2.5,'#c78b64')).join('')+l('M26 70 Q62 75 97 70','#f2d59a',2),
 rice:()=>p('M18 53 Q60 70 102 53 L94 76 Q60 90 26 76Z',C.blue)+e(60,50,42,14,'#80a997')+e(60,48,36,11,C.cream)+Array.from({length:12},(_,i)=>e(32+(i%6)*10,44+Math.floor(i/6)*7,3,1.5,i%3?C.white:'#e7d4ad')).join(''),
 grain_bowl:()=>p('M18 53 Q60 70 102 53 L94 76 Q60 90 26 76Z',C.blue)+e(60,50,42,14,'#80a997')+e(60,48,36,11,'#d9c89e')+p('M27 48 Q43 33 56 45 L51 58 Q36 57 27 48Z',C.green)+p('M66 44 Q79 34 94 47 L88 57 Q75 57 66 44Z',C.cream),
 curry:()=>p('M18 53 Q60 71 102 53 L95 77 Q60 91 25 77Z',C.blue)+e(60,50,42,15,'#80a997')+e(60,48,36,11,'#cf8a54')+p('M26 48 Q39 35 54 45 L52 57 Q39 58 26 48Z',C.cream)+p('M62 44 Q80 35 95 48 L90 57 Q74 57 62 44Z',C.orange),
 ramen:()=>p('M18 52 Q60 69 102 52 L95 77 Q60 91 25 77Z',C.blue)+e(60,49,42,14,'#7da69a')+e(60,47,36,11,'#b47c4b')+Array.from({length:5},(_,i)=>l(`M${35+i*10} 47 Q${39+i*9} 38 ${45+i*9} 50`,'#ecd58d',2.5)).join('')+e(76,48,11,8,C.white)+c(76,48,5,C.yellow),
 noodles:()=>e(60,68,48,17,'#d1dfd2')+e(60,63,43,15,C.white)+Array.from({length:8},(_,i)=>l(`M${31+i*7} ${57+i%2*4} Q${38+i*5} 41 ${49+i*5} 59`,'#d8b269',2.7)).join(''),
 lasagna:()=>e(60,72,48,14,'#d1dfd2')+p('M27 55 L74 38 L96 53 L52 71Z',C.red)+p('M27 55 L52 71 L52 80 L27 64Z','#dba65f')+p('M52 71 L96 53 L96 62 L52 80Z','#e8c381')+l('M32 54 L74 41 L89 52 L52 67Z',C.cream,4)+l('M30 63 L52 76 L92 59',C.red,3),
 fish:()=>e(60,68,48,17,'#d1dfd2')+e(60,64,43,14,C.white)+p('M28 58 Q55 38 90 51 Q99 57 88 67 Q53 78 28 58Z','#e89170')+l('M39 55 Q59 48 80 56 M42 63 Q63 57 83 62','#f5c8a3',2.2),
 patties:()=>e(60,68,48,17,'#d1dfd2')+e(60,64,43,14,C.white)+e(44,56,16,9,'#b79568')+e(76,58,16,9,'#b79568')+l('M34 54 Q44 48 54 54 M66 56 Q76 50 86 56','#e0c49b',2),
 fajitas:()=>e(60,68,48,17,'#d1dfd2')+p('M24 54 Q59 39 96 54 L90 70 Q58 79 29 68Z',C.ink)+[0,1,2,3].map((_,i)=>l(`M${34+i*14} 53 L${46+i*11} 67`,i%2?C.red:C.orange,4)).join('')+p('M15 59 Q26 47 37 57 L33 70Z',C.cream),
 fritters:()=>e(60,69,48,16,'#d1dfd2')+e(60,65,42,13,C.white)+[39,64,84].map((x,i)=>e(x,58+i%2*5,13,8,'#c49e5c')+l(`M${x-7} ${57+i%2*5} Q${x} ${50+i%2*5} ${x+7} ${58+i%2*5}`,C.darkGreen,2)).join('')
});
Object.assign(vessels,{
 tostada:()=>e(60,73,46,13,'#d4e0d3')+e(60,63,38,17,'#c98d4f')+e(60,59,34,13,'#e9bd75')+e(60,55,27,10,C.darkBrown),
 panini:()=>e(60,76,47,10,'#d4e0d3')+p('M23 60 Q29 35 48 34 L95 49 L99 66 L45 77Z','#be8453')+p('M29 56 L47 39 L91 51 L90 59 L46 70Z',C.cream)+l('M35 62 L89 61 M39 54 L91 55',C.darkBrown,3),
 pita:()=>e(60,77,46,10,'#d4e0d3')+p('M23 69 Q20 40 42 30 Q65 23 91 39 Q102 52 97 70Z','#d7a369')+p('M30 60 Q30 40 46 36 Q67 30 89 44 L91 58 Q62 50 30 60Z',C.cream)+l('M31 60 Q61 48 94 59',C.brown,2),
 sweet_toast:()=>e(60,72,45,15,'#d3e0d4')+g(60,52,1.18,slice('#e6bd87'))+p('M39 53 Q58 39 83 52 L79 63 Q59 56 42 63Z',C.white),
 shakshuka:()=>e(60,72,47,15,'#d3e0d4')+p('M18 56 Q60 69 102 56 L96 77 Q60 89 24 77Z',C.ink)+e(60,54,42,15,C.red)+[44,77].map(x=>e(x,51,12,9,C.white)+c(x,51,5,C.yellow)).join(''),
 boats:()=>e(60,72,47,15,'#d3e0d4')+[43,78].map(x=>p(`M${x-18} 58 Q${x-13} 34 ${x} 34 Q${x+16} 34 ${x+18} 58 Q${x} 77 ${x-18} 58Z`,C.darkGreen)+e(x,55,14,7,C.red)).join(''),
 grits:()=>p('M19 56 Q60 71 101 56 L94 78 Q60 91 26 78Z',C.blue)+e(60,52,41,14,'#d9d1a6')+e(60,50,35,10,'#eee3b5'),
 polenta:()=>e(60,72,47,16,'#d3e0d4')+e(60,68,41,13,C.white)+[39,62,84].map(x=>p(`M${x-13} 60 L${x} 40 L${x+13} 60Z`,C.yellow)+l(`M${x-10} 59 L${x+10} 59`,C.brown,2)).join(''),
 stuffed_mushroom:()=>e(60,73,47,15,'#d3e0d4')+[40,78].map(x=>e(x,60,19,12,C.brown)+e(x,56,15,8,C.cream)+e(x,52,11,5,C.green)).join('')
 ,crab_cakes:()=>e(60,72,48,16,'#d3e0d4')+e(60,68,42,13,C.white)+[42,77].map((x,i)=>e(x,57+i%2*3,16,10,'#b87842')+e(x,54+i%2*3,14,7,'#d9a45e')+Array.from({length:5},(_,j)=>c(x-8+j*4,53+i%2*3+(j%2)*3,1.4,j%2?C.brown:C.orange)).join('')).join('')+g(94,54,.35,citrus(C.yellow))+l('M36 67 Q60 73 83 68',C.darkGreen,2),
 miso_salmon:()=>e(60,72,48,16,'#d3e0d4')+e(60,68,42,13,C.white)+p('M25 58 Q48 36 82 45 Q96 51 91 62 Q65 74 25 58Z','#e99470')+p('M32 55 Q59 43 85 52 L82 58 Q58 50 35 61Z','#965442')+l('M39 57 Q59 49 81 56','#e9bb75',2)+[39,47,56].map(x=>e(x,67,3,1.5,C.cream)).join('')+leaf(88,66,.26,C.green),
 med_fish_bake:()=>p('M16 43 L104 43 L101 77 Q60 89 19 77Z',C.blue)+p('M21 46 L99 46 L96 72 Q60 79 24 72Z',C.red)+p('M30 56 Q56 35 88 52 Q96 57 87 66 Q55 75 30 56Z',C.cream)+l('M39 54 Q59 47 78 56 M44 62 Q63 57 81 62','#b4bdad',2)+[35,83].map(x=>c(x,50,4,C.purple)+c(x,50,1.5,C.red)).join('')+g(65,46,.25,citrus(C.yellow))
});
const positions={bowl:[[43,46],[72,45],[58,54],[82,54],[34,55]],soup:[[43,46],[70,46],[57,52],[81,51],[34,51]],bake:[[40,53],[75,54],[57,62],[86,64],[29,65]],skillet:[[41,46],[73,47],[57,55],[82,55],[35,55]],salad:[[42,46],[71,44],[58,55],[83,52],[31,52]],plate:[[42,55],[71,54],[58,63],[83,62],[31,62]],pizza:[[42,45],[70,42],[58,55],[80,59],[37,60]],burger:[[38,57],[72,57],[58,62],[84,63],[30,62]],sandwich:[[42,57],[79,56],[55,64],[90,63],[31,63]],taco:[[29,49],[73,47],[43,56],[87,56],[20,57]],wrap:[[67,43],[77,49],[83,56],[61,56],[69,63]],quesadilla:[[42,59],[68,55],[58,63],[81,63],[30,64]],pasta:[[43,55],[72,54],[58,63],[83,61],[32,60]],breakfast:[[38,62],[78,61],[58,51],[86,54],[29,54]],potato:[[43,55],[72,55],[59,62],[82,63],[34,63]]};
for(const kind of ['pancake','french_toast','toast','oatmeal','omelet','scramble','muffin','stuffed','nachos'])positions[kind]=positions.breakfast;
Object.assign(positions,{
 burrito:[[90,43],[87,49],[95,49],[83,43],[92,39]],wrap:[[55,33],[62,35],[68,33],[59,39],[70,39]],
 burrito_bowl:[[37,45],[76,45],[59,49],[86,51],[30,51]],sub:[[38,54],[60,54],[82,54],[71,63],[48,62]],
 rice:[[39,46],[76,45],[58,51],[86,51],[30,52]],grain_bowl:[[41,45],[76,44],[58,52],[86,52],[30,52]],
 curry:[[42,46],[77,46],[58,52],[85,52],[31,52]],ramen:[[40,45],[69,44],[55,52],[87,51],[31,52]],
 noodles:[[42,56],[75,55],[58,62],[86,62],[31,62]],lasagna:[[43,52],[75,51],[60,60],[85,59],[33,61]],
 fish:[[40,53],[76,54],[58,61],[87,62],[31,62]],patties:[[39,55],[74,55],[57,61],[86,61],[31,61]],fajitas:[[42,53],[76,52],[58,62],[86,63],[31,63]],
 fritters:[[39,56],[66,61],[83,57],[57,52],[30,62]]
});
Object.assign(positions,{
 tostada:[[42,51],[72,50],[58,56],[82,58],[32,59]],panini:[[42,55],[70,53],[56,61],[83,61],[32,65]],pita:[[43,46],[73,44],[58,51],[81,53],[34,55]],
 sweet_toast:[[42,50],[70,49],[55,56],[80,55],[33,58]],shakshuka:[[39,51],[73,50],[57,56],[84,57],[32,58]],boats:[[40,48],[76,48],[56,56],[84,59],[32,60]],
 grits:[[41,47],[75,46],[57,52],[83,54],[32,54]],polenta:[[40,54],[73,54],[57,61],[84,62],[31,62]],stuffed_mushroom:[[40,50],[76,50],[58,57],[84,58],[32,60]]
 ,crab_cakes:[[42,55],[75,55],[58,62],[86,62],[31,62]],miso_salmon:[[42,55],[75,55],[58,62],[86,62],[31,62]],med_fish_bake:[[40,53],[75,54],[57,61],[85,62],[31,62]]
});
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
 if(kind==='soup'){
  const soupFill=n.includes('tomato')?C.red:n.includes('broccoli')?'#d8bd73':n.includes('mushroom')?'#aa9070':n.includes('lentil')?'#b28456':n.includes('potato')?C.cream:n.includes('curry')?C.orange:n.includes('beef')?'#9d6847':'#d6a66c';
  marks+=e(60,48,33,9,soupFill);
  if(n.includes('tomato'))marks+=p('M44 48 Q60 40 77 49',C.cream)+leaf(61,51,.3,C.darkGreen);
  else if(n.includes('broccoli'))marks+=g(54,48,.54,floret())+g(75,49,.34,floret());
  else if(n.includes('mushroom'))marks+=[45,68,81].map((x,i)=>g(x,48+i%2*4,.44,INGREDIENT_ART.mushroom)).join('');
  else if(n.includes('noodle'))marks+=Array.from({length:4},(_,i)=>l(`M${35+i*13} 48 Q${42+i*10} 39 ${49+i*10} 51`,C.cream,2.4)).join('')+p('M43 47 L51 42 L57 48 L49 53Z',C.orange);
  else if(n.includes('lentil'))marks+=Array.from({length:8},(_,i)=>e(39+i%4*12,45+Math.floor(i/4)*6,3,2,C.brown)).join('');
  else if(n.includes('potato'))marks+=[44,65,81].map(x=>p(`M${x-5} 44 L${x+4} 44 L${x+5} 51 L${x-5} 52Z`,C.cream)).join('');
  else if(n.includes('minestrone'))marks+=l('M38 46 L48 51 L55 45 M65 48 L75 52 L82 45',C.yellow,3)+c(59,49,4,C.red);
  else if(n.includes('beef'))marks+=p('M39 44 L51 42 L54 51 L42 53Z',C.darkBrown)+p('M67 46 L78 43 L82 51 L70 53Z',C.brown);
  else marks+=p('M44 46 L53 41 L58 48 L49 52Z',C.orange)+leaf(69,51,.36,C.darkGreen);
 }
 if(kind==='pizza'){
  if(n.includes('margherita'))marks+=[[-17,-5],[11,-8],[0,11]].map(([x,y])=>g(60+x,50+y,.46,leaf(0,10,.8,C.darkGreen)+c(5,7,4,C.white))).join('');
  if(n.includes('mushroom'))marks+=[[-15,-5],[12,-7],[0,10]].map(([x,y])=>g(60+x,50+y,.35,INGREDIENT_ART.mushroom)).join('');
  if(n.includes('chicken'))marks+=[[-16,-4],[12,-6],[1,11]].map(([x,y])=>g(60+x,50+y,.5,p('M-11 -6 L8 -7 L11 5 L-6 8Z',C.orange))).join('');
  if(n.includes('bbq'))marks+=l('M35 45 Q60 33 84 49 M37 58 Q60 47 80 62',C.darkBrown,3);
  if(n.includes('breakfast'))marks+=e(61,50,12,8,C.white)+c(61,50,5,C.yellow)+p('M36 55 L50 53 L51 59 L36 61Z',C.red);
  if(n.includes('flatbread'))marks+=p('M20 50 Q58 20 101 49 Q75 77 28 67Z','none',`stroke="${C.brown}" stroke-width="3"`);
 }
 if(kind==='burger'){
  if(n.includes('chicken'))marks+=l('M34 60 Q60 54 86 60',C.orange,5);
  if(n.includes('veggie'))marks+=p('M32 58 Q60 53 88 58 L86 66 Q60 69 34 66Z',C.darkGreen)+c(43,61,2,C.orange)+c(72,60,2,C.yellow);
  if(n.includes('turkey'))marks+=l('M35 61 Q60 55 85 61','#c89d70',5);
  if(n.includes('sloppy'))marks+=p('M31 57 Q50 62 64 56 Q76 63 90 58 L87 72 Q77 67 72 72 Q55 65 44 72Z',C.red);
 }
 if(kind==='sandwich'){
  if(n.includes('ham'))marks+=p('M28 61 Q40 53 52 62 Q65 53 78 62 L91 62 L89 68 L29 68Z','#dc8f83')+l('M33 59 L87 59',C.yellow,3);
  if(n.includes('blt'))marks+=l('M32 60 Q43 56 55 60 Q68 56 86 60',C.red,4)+l('M32 64 Q43 60 55 64 Q68 60 86 64',C.darkBrown,3);
  if(n.includes('tuna'))marks+=p('M31 59 Q59 52 88 59 L86 66 Q60 62 32 67Z','#9ab0a4')+l('M37 57 L82 57',C.yellow,3);
  if(n.includes('egg salad'))marks+=e(57,59,24,5,C.cream)+c(48,58,3,C.yellow)+c(68,59,3,C.yellow);
  if(n.includes('grilled cheese'))marks+=p('M28 60 L90 60 L84 68 L58 64 L38 69Z',C.yellow);
 }
 if(kind==='salad'){
  if(n.includes('greek'))marks+=p('M39 43 L49 43 L50 52 L40 52Z M70 44 L80 44 L80 53 L70 53Z',C.cream)+c(60,45,4,C.darkGreen);
  if(n.includes('cucumber tomato'))marks+=e(43,47,8,5,'#a8ce91')+e(74,46,8,5,C.red)+e(60,54,8,5,'#a8ce91');
  if(n.includes('pasta'))marks+=l('M36 50 Q44 40 51 51 M66 48 Q75 39 82 49',C.yellow,4);
  if(n.includes('quinoa'))marks+=e(60,48,15,8,'#d4bc8a')+Array.from({length:6},(_,i)=>c(49+i%3*9,45+Math.floor(i/3)*6,1.5,C.brown)).join('');
  if(n.includes('chickpea'))marks+=[43,58,76].map((x,i)=>c(x,47+i%2*5,5,'#d2b07d')).join('');
  if(n.includes('spinach'))marks+=leaf(59,56,.7,C.darkGreen);
 }
 if(kind==='bake'||kind==='lasagna'){
  if(n.includes('gratin'))marks+=Array.from({length:4},(_,i)=>e(34+i*16,54+i%2*5,9,5,C.cream)).join('');
  if(n.includes('mac'))marks+=Array.from({length:4},(_,i)=>l(`M${35+i*15} 55 Q${40+i*15} 48 ${46+i*15} 56`,C.yellow,4)).join('');
  if(n.includes('shepherd'))marks+=p('M27 48 Q60 35 94 48 L93 58 Q60 51 27 58Z',C.cream)+l('M34 50 Q60 43 86 50',C.brown,2);
  if(n.includes('broccoli'))marks+=g(57,56,.58,floret());
  if(n.includes('bean'))marks+=g(45,57,.53,bean())+g(72,59,.53,bean());
 }
 if(kind==='fish'){
  if(n.includes('lemon'))marks+=g(82,56,.4,citrus(C.yellow));
  if(n.includes('patties'))marks+=e(44,58,13,8,'#9eaa91')+e(77,58,13,8,'#9eaa91');
 }
 if(kind==='curry'){
  if(n.includes('thai red'))marks+=p('M41 46 Q60 38 79 47 Q61 58 41 46Z',C.red)+leaf(74,55,.35,C.darkGreen);
  if(n.includes('chickpea'))marks+=[43,61,78].map(x=>c(x,47,4,'#d9b67e')).join('');
  if(n.includes('lentil'))marks+=Array.from({length:7},(_,i)=>e(39+i%4*11,46+Math.floor(i/4)*6,3,2,C.brown)).join('');
  if(n.includes('tofu'))marks+=p('M45 43 L56 43 L58 53 L46 53Z M69 45 L79 45 L80 54 L70 54Z',C.cream);
 }
 if(kind==='ramen'&&n.includes('shrimp'))marks+=g(47,47,.48,INGREDIENT_ART.shrimp);
 if(kind==='rice'&&n.includes('pineapple'))marks+=p('M46 45 L52 38 L58 46 L52 52Z M72 44 L79 39 L84 48 L76 52Z',C.yellow);
 if(kind==='grain_bowl'&&n.includes('falafel'))marks+=[45,65,81].map(x=>c(x,47,6,C.darkGreen)).join('');
 if(kind==='grain_bowl'&&n.includes('shawarma'))marks+=p('M63 43 L83 47 L79 55 L61 52Z',C.orange)+l('M66 45 L78 51',C.brown,2);
 return marks}
const pizzaDetails=id=>{
 const spots=[[41,44],[68,41],[58,55],[80,57],[36,57]];
 const discs=(color,r=6)=>spots.map(([x,y])=>c(x,y,r,color)).join('');
 const flatbread=()=>e(60,53,45,22,'none',`stroke="${C.brown}" stroke-width="3"`);
 switch(id){
  case 'margherita_pizza':return [[43,43],[71,43],[58,57]].map(([x,y])=>e(x,y,9,6,C.cream)+g(x+3,y+4,.38,leaf(0,10,.8,C.darkGreen))).join('');
  case 'pepperoni_pizza':return discs(C.red,7)+spots.map(([x,y])=>c(x-2,y-2,1.4,C.cream)).join('');
  case 'chicken_pizza':return spots.slice(0,4).map(([x,y],i)=>p(`M${x-8} ${y-4} L${x+7} ${y-5} L${x+9} ${y+3} L${x-5} ${y+5}Z`,i%2?C.orange:'#d29368')).join('');
  case 'veggie_pizza':return [[42,44],[75,45],[58,58]].map(([x,y],i)=>e(x,y,8,6,i===1?C.orange:C.darkGreen)+e(x,y,4,2,'#e5bf7e')).join('')+p('M47 57 L55 51 L58 59Z',C.red);
  case 'mushroom_pizza':return [[42,44],[73,43],[58,57],[80,56]].map(([x,y])=>g(x,y,.42,p('M-13 0 Q-10 -11 0 -12 Q10 -11 13 0Z',C.brown)+p('M-3 0 L3 0 L3 9 L-3 9Z',C.cream))).join('');
  case 'bbq_chicken_pizza':return spots.slice(0,4).map(([x,y])=>p(`M${x-7} ${y-4} L${x+6} ${y-5} L${x+8} ${y+3} L${x-5} ${y+5}Z`,C.orange)).join('')+l('M31 45 Q58 34 86 49 M34 59 Q60 48 84 62',C.darkBrown,4);
  case 'spinach_flatbread':return flatbread()+[[43,43],[66,43],[56,56],[81,55]].map(([x,y])=>g(x,y,.4,leaf(0,12,1,C.darkGreen))).join('');
  case 'cheese_flatbread':return flatbread()+p('M30 49 Q60 32 90 49 Q79 61 58 63 Q39 59 30 49Z',C.cream)+l('M40 49 Q60 43 80 50',C.yellow,3);
  case 'breakfast_pizza':return e(58,49,17,11,C.white)+c(58,49,8,C.yellow)+p('M35 56 L48 54 L49 60 L35 61Z M72 56 L85 53 L87 59 L73 62Z',C.red);
  case 'tomato_garlic_flatbread':return flatbread()+[[42,44],[72,43],[59,57]].map(([x,y])=>p(`M${x-7} ${y-5} Q${x} ${y-8} ${x+7} ${y-3} L${x} ${y+6}Z`,C.red)).join('')+c(83,56,4,C.cream)+c(36,57,4,C.cream);
  case 'pesto_chicken_flatbread':return flatbread()+e(60,51,31,14,C.darkGreen)+spots.slice(0,4).map(([x,y])=>p(`M${x-7} ${y-4} L${x+7} ${y-5} L${x+8} ${y+4} L${x-5} ${y+5}Z`,C.orange)+c(x+5,y-3,2,C.cream)).join('');
  case 'mediterranean_flatbread':return flatbread()+spots.map(([x,y],i)=>i%2?c(x,y,5,C.purple)+c(x,y,2,C.red):p(`M${x-6} ${y-5} L${x+5} ${y-5} L${x+7} ${y+5} L${x-5} ${y+5}Z`,C.cream)).join('');
  case 'eggplant_pizza':return spots.slice(0,4).map(([x,y])=>e(x,y,8,6,C.purple)+e(x,y,5,3,'#d5bc8e')).join('')+leaf(59,54,.35,C.darkGreen);
  case 'artichoke_spinach_flatbread':return flatbread()+spots.slice(0,4).map(([x,y])=>p(`M${x} ${y+6} Q${x-9} ${y-1} ${x} ${y-6} Q${x+9} ${y-1} ${x} ${y+6}Z`,C.cream)+leaf(x+3,y+5,.24,C.darkGreen)).join('');
  case 'arugula_parmesan_pizza':return spots.slice(0,4).map(([x,y])=>leaf(x,y+8,.44,C.darkGreen)+p(`M${x-4} ${y+2} L${x+5} ${y-2} L${x+7} ${y+5}Z`,C.cream)).join('');
  default:throw Error(`Missing pizza details: ${id}`);
 }
};
const recipeCache=new Map();
export function recipeArt(recipe){if(!recipe?.id||!recipe?.name||!recipe?.ingredients)throw Error('Clearline recipe requires id, name, and ingredients');const cacheKey=`${recipe.id}|${recipe.name}|${JSON.stringify(recipe.ingredients)}`;if(recipeCache.has(cacheKey))return recipeCache.get(cacheKey);const kind=dishKind(recipe),ids=Object.keys(recipe.ingredients).filter(id=>!['salt','black_pepper','sugar','olive_oil','sesame_oil','soy_sauce'].includes(id));if(!ids.length)throw Error(`Clearline recipe has no visible components: ${recipe.id}`);const pos=positions[kind];const isFilledTortilla=kind==='burrito'||kind==='wrap',drawnAsCompleteDish=['crab_cakes','miso_salmon','med_fish_bake'].includes(kind);const fillingIds=isFilledTortilla?ids.filter(id=>id!=='tortilla'):ids;const toppings=kind==='pizza'?pizzaDetails(recipe.id):drawnAsCompleteDish?'':fillingIds.slice(0,5).map((id,i)=>prepared(id,...pos[i],isFilledTortilla?0.4:i<2?0.9:0.65)).join('');const marks=kind==='pizza'||drawnAsCompleteDish?'':preparationMarks(recipe,kind);const svg=`<svg class="clearline-art dish-art dish-${kind}" viewBox="8 8 104 86" role="img" aria-label="${escapeHtml(recipe.name)} prepared dish illustration" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="51" r="46" fill="#eef5ee"/><g stroke="${C.line}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${vessels[kind](recipe)}${marks}${toppings}</g></svg>`;recipeCache.set(cacheKey,svg);return svg}
export const recipeArtKind=dishKind;
