const inputSlider =document.querySelector("[data-lengthSlider]");
const lengthDisplay =document.querySelector("[data-lengthNumber]");

const passwordDisplay =document.querySelector("[data-passwordDisplay]");
const copyBtn =document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("[data-copyMsg]");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox =document.querySelectorAll("input[type=checkbox]");

const symbols="!~@#$%^&*(){}|'/.>,<][?";
console.log("sstarting");
let password="";
let passwordLength= 8;
let checkbox=0;
 handleSlider();
//set strength circle to grey
setIndicator("#ccc");
//set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%100"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) +min;
}

//if first checkbox marked
function generateRandomNumber(){
    return getRndInteger(0,9);
}

//if lower case check box marked
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

//👉fromCharCode() this method convert ASCII value to string
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper =false;
    let hasLower =false;
    let hasNum =false;
    let hasSym = false;

    if(uppercaseCheck.checked)hasUpper =true;
    if(lowercaseCheck.checked)hasLower =true;
    if(numberCheck.checked)hasNum =true;
    if(symbolsCheck.checked)hasSym =true;

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >10){
         setIndicator("#f00");
    }
    else if( (hasLower || hasUpper)&& (hasNum || hasSym)&&passwordLength >6&&passwordLength <=10){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#0f0");        
    }
    
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.removed("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

//this function count the number of marked checkboxes
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)checkCount++;
    });

    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

//this function help to know which boxes  are marked
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});

//👉 function to shuffle password string/array
function shufflePassword(array){
    //Fisher Yates Method to shuffle
    for(let i=array.length-1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength =e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
if(passwordDisplay.value)
copyContent();
});

generateBtn.addEventListener('click',() => {
    //none of the checkbox are selected
    console.log("I am enter");
    if(checkCount<=0)return ;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //remove old password
    password="";

    let funcArr =[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

     if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

     if(numberCheck.checked)
        funcArr.push(generateRandomNumber);

     if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //remaining password
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex =getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    
    //shuffle the password
    password =shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value =password;
    calcStrength();
});







