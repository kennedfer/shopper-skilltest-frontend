export const clearInputValue = (elementId:string):void =>{
  const input:HTMLInputElement = (document.getElementById(elementId) as HTMLInputElement);
  if(input!=null) input.value = "";
}
