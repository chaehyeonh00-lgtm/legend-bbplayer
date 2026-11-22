// 배포용 빌드: index.html(원본)을 압축·난독화해서 dist/에 내보낸다.
const fs=require('fs'),path=require('path');
const JO=require('javascript-obfuscator');
const out='dist';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
let html=fs.readFileSync('index.html','utf8');
// 스크립트 난독화
html=html.replace(/<script>([\s\S]*?)<\/script>/g,(m,code)=>{
  const r=JO.obfuscate(code,{compact:true,identifierNamesGenerator:'hexadecimal',renameGlobals:true,
    stringArray:true,stringArrayEncoding:['base64'],stringArrayThreshold:1,stringArrayRotate:true,stringArrayShuffle:true,
    splitStrings:true,splitStringsChunkLength:6,controlFlowFlattening:false,deadCodeInjection:false,selfDefending:false,
    unicodeEscapeSequence:false,transformObjectKeys:false,numbersToExpressions:false,stringArrayWrappersCount:2,stringArrayWrappersType:'function'});
  return '<script>'+r.getObfuscatedCode()+'</script>';
});
// CSS 압축 + 주석 제거
html=html.replace(/<style>([\s\S]*?)<\/style>/g,(m,css)=>'<style>'+css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*\n\s*/g,'').replace(/\s*([{};:,>])\s*/g,'$1').replace(/;}/g,'}')+'</style>');
html=html.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s*\n\s*</g,'><');
fs.writeFileSync(path.join(out,'index.html'),html);
for(const f of ['favicon.png','social-preview.png'])fs.copyFileSync(f,path.join(out,f));
console.log('built',(html.length/1024).toFixed(0)+'KB');
