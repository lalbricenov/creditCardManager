const svgNS = "http://www.w3.org/2000/svg";//url for the namespace for svg

const createElementSVG = function(type, properties){
  let newElement = document.createElementNS(svgNS, type);
  for(let key in properties){
    newElement.setAttribute(key, properties[key]);
  }
  return newElement;
}

// Functions to convert Hex to rgb and viceversa ********************
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgbColor) {
  return "#" + componentToHex(rgbColor.r) + componentToHex(rgbColor.g) + componentToHex(rgbColor.b);
}
function hexToRgb(hex) {
  let r = parseInt("0x"+hex.substring(1,3));
  let g = parseInt("0x"+hex.substring(3,5));
  let b = parseInt("0x"+hex.substring(5,7));
  
  return {r, g, b}
}
function newColor(hexColor)
{// Function that outputs a darker or lighter color from the input color
  let rgbColor = hexToRgb(hexColor);
  let shift;
  // If one of the channels is larger than 230 of if the sum of the three channels is less than 3*125
  if(rgbColor.r > 230 || rgbColor.g > 230 || rgbColor.b > 230 ||rgbColor.r + rgbColor.g + rgbColor.b >125*3) shift = -40;// Darker color
  else shift = 40;// Lighter color
  // console.log("before", rgbColor);
  for(let ch in rgbColor)
  {
    // console.log(ch);
    if(rgbColor[ch] != 0) rgbColor[ch] = Math.floor(rgbColor[ch] + shift);// Change the value of the channel only if it is present
    
    if(rgbColor[ch] > 255 ) rgbColor[ch] = 255;
    if(rgbColor[ch] < 0) rgbColor[ch] = 0
  }
  // console.log(rgbColor);
  return rgbToHex(rgbColor);
}
// ******************************************************
// This function decides if the color of the text should be black or white
function pickTextColorBasedOnBgColor(bgColor, lightColor, darkColor) {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? darkColor : lightColor;
}
//***************************************************************
const editCreditCard = function(banco, franquicia, fourLast, color1, validThru, nameOnCard, containerId){
  // Changing the colors of the card
  let textColor = pickTextColorBasedOnBgColor(color1, "#ffffff", "#000000");
  let textNodes = document.querySelectorAll("#"+containerId+">svg>text");
  for(node of textNodes)
  {
    node.style["fill"] = textColor;
  }
  
  let fileNameColor = textColor=="#000000"? "Black": "White";
  console.log(textColor, fileNameColor);
  let logoFileName = "static/images/creditCard/logo"+franquicia+fileNameColor+".png";
  //THIS DOESNT WORK, I DONT KNOW HOW TO MAKE IT WORK YET
  document.getElementById(containerId+"logoFranq").setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', logoFileName);
  // document.getElementById(containerId+"contact").setAttributeNS('http://www.w3.org/1999/xlink', 'href', "static/images/creditCard/contactless"+fileNameColor+".png");

  // console.log(document.getElementById(containerId).firstElementChild.childNodes);// changing the color to all the text inside the svgImage (firstChilid of the container)
  let color2 = newColor(color1);
  document.getElementById(containerId+"color1").style = "stop-color:"+color1+";stop-opacity:1";
  document.getElementById(containerId+"color2").style = "stop-color:"+color2+";stop-opacity:1";
  document.getElementById(containerId+"rect").fill = "url(#grad1"+containerId+")";
  

  // Changing the text on the card
  document.getElementById(containerId + "expDate").innerHTML = validThru.substring(5,7)+"/"+validThru.substring(2,4);
  document.getElementById(containerId + "lastFour").innerHTML = "#### #### #### " + fourLast;
  document.getElementById(containerId + "banco").innerHTML = banco;
  document.getElementById(containerId + "nameOnCard").innerHTML = nameOnCard;

}

const createCreditCard = function(banco, franquicia, fourLast, color1, validThru, nameOnCard, containerId){
  let textColor = pickTextColorBasedOnBgColor(color1, "#ffffff", "#000000");
  let color2 = newColor(color1);
  let svgImage = createElementSVG('svg', {
    "class":"creditCardImage","viewBox":"0 0 270 171", "width":"270px", "height":"171px"});
  
  let defs = createElementSVG('defs',{});
  let gradientId = "grad1"+containerId;
  let gradient = createElementSVG('linearGradient', {
    "id":gradientId,
    "x1":"0%",
    "y1":"0%", 
    "x2":"100%",
    "y2":"0%",
  });
  let stop1 = createElementSVG('stop',{
    "id":containerId + "color1",// This will be used to reference the color when editing the card
    "offset":"0%",
    "style":"stop-color:"+color1+";stop-opacity:1"
  })
  let stop2 = createElementSVG('stop',{
    "id":containerId + "color2",// This will be used to reference the color when editing the card
    "offset":"100%",
    "style":"stop-color:"+color2+";stop-opacity:1"
  })
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svgImage.appendChild(defs);

  let rect = createElementSVG('rect', {
    id:containerId+"rect",
    x:"0",
    y:"0",
    rx:"10",
    ry:"10",
    width:"100%",
    height:"100%",
    fill:"url(#"+gradientId+")"
  });
  svgImage.appendChild(rect);


  // Logos and icons on card **************************************
  let fileNameColor = textColor=="#000000"? "Black": "White";
  let logoFranq = createElementSVG('image', {
    id:containerId+"logoFranq",
    x:"200px",
    y:franquicia!="Visa"?"120px":"147px",
    width:"60px",
    href:"static/images/creditCard/logo"+franquicia+fileNameColor+".png"
  })
  let chip = createElementSVG('image', {
    x:"32px",
    y:"56px",
    width:"35px",
    href:"static/images/creditCard/chip.png"
  })
  let contactless = createElementSVG('image', {
    id:containerId+"contact",
    x:"76px",
    y:"63px",
    width:"19px",
    href:"static/images/creditCard/contactless"+fileNameColor+".png"
  })
  
  let bancoText = createElementSVG('text', {
    "id":containerId + "banco",
    x:"19px",
    y:"45px",
    style:"font-family:monospace; font-size: 26px;fill:"+textColor+";"
  })
  bancoText.innerHTML = banco;

  let validText = createElementSVG('text', {
    x:"98px",
    y:"131px",
    style:"font-size: 6px;font-weight: bold;fill:"+textColor+";"
  })
  validText.innerHTML = "VALID";

  let thruText = createElementSVG('text', {
    x:"98px",
    y:"138px",
    style:"font-size: 6px;font-weight: bold;fill:"+textColor+";"
  })
  thruText.innerHTML = "THRU";
  svgImage.appendChild(validText);
  svgImage.appendChild(thruText);
  svgImage.appendChild(bancoText);
  svgImage.appendChild(logoFranq);
  svgImage.appendChild(contactless);
  svgImage.appendChild(chip);

// Data on card *********************************************
  let cardNumber = createElementSVG('text', {
    "id":containerId + "lastFour",
    x:"27px",
    y:"115px",
    style:"font-family:'Courier New', Courier, monospace;font-size: 19px;fill:"+textColor+";"
  })
  cardNumber.innerHTML = "#### #### #### "+ fourLast;

  let expDate = createElementSVG('text', {
    "id":containerId + "expDate",
    x:"121px",
    y:"137px",
    style:"font-family:monospace;font-size: 13px;fill:"+textColor+";"
  })
  expDate.innerHTML = validThru;

  let name = createElementSVG('text', {
    "id":containerId + "nameOnCard",
    x:"35px",
    y:"155px",
    style:"font-family:monospace;font-size: 13px;fill:"+textColor+";"
  })
  name.innerHTML = nameOnCard;


  svgImage.appendChild(name);
  svgImage.appendChild(expDate);
  svgImage.appendChild(cardNumber);

  document.getElementById(containerId).appendChild(svgImage);
}
const addEventListenersOnFieldsUpdate = function()
{// Function that search for divs with id cardN# where # is a number
  let idCard = "cardN";
  let idForm = "formForCardN";
  let i = 0;
  let divFormPairs=[];
  let div;
  do
  {
    i = i + 1;
    div = document.getElementById(idCard+i);
    // console.log(div);
    if(div!=null)
    {
      let form = document.getElementById(idForm+i)
      if(form!=null)
      {
        let pair = {div, form}
        // console.log(pair);
        divFormPairs.push(pair);
      }else break;
    }else break;
  }while(div!=null);
  // console.log(divFormPairs);
  for(pair of divFormPairs)
  {
    // Add an event listener for every input that will be visible on the card.
    // The event that will be listened is "input", that is, every time the value of the field is changed. The change in color happens when the dialogue is closed, and its value is a hex representation of the color chosen.
    pair.form.banco.addEventListener("input", fillCardFromForm, false);
    pair.form.lastFour.addEventListener("input", fillCardFromForm, false);
    pair.form.nameOnCard.addEventListener("input", fillCardFromForm, false);
    pair.form.cardColor.addEventListener("input", fillCardFromForm, false);
    pair.form.franquicia.addEventListener("input", fillCardFromForm, false);
    pair.form.validThru.addEventListener("input", fillCardFromForm, false);
  }
}
const fillCardFromForm = function(event)
{
  // event is a variable that stores the information of the event that was triggered.
  let form = event.path[2];//path is a variable that stores the tree of parents of the element that triggered the event. Position 2 is the form that contains the input.
  let banco = form.banco.value;
  let lastFour = form.lastFour.value;
  let nameOnCard = form.nameOnCard.value;
  let cardColor = form.cardColor.value;
  let franquicia = form.franquicia.value;
  let validThru = form.validThru.value;
  editCreditCard(banco, franquicia, lastFour, cardColor,validThru, nameOnCard, "cardN"+form.id[form.id.length-1]);
  // console.log(event.target.value);

}
// addEventListenersOnFieldsUpdate();
// createCreditCard("Banco", "Visa", "0000", "#000000", "99/99", "Test", "cardN1");
// module.exports = {createCreditCard, findAndUpdateCards};

